import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/mysql';
import fs from 'fs/promises';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const conn = await pool.getConnection();
    try {
      let query = 'SELECT * FROM products';
      const params: any[] = [];

      if (categoryId) {
        query += ' WHERE category_id = ?';
        params.push(categoryId);
      }

      // LIMIT and OFFSET cannot use placeholders in MySQL, so concatenate directly
      query += ` LIMIT ${Math.max(0, limit)} OFFSET ${Math.max(0, offset)}`;

      const [rows] = await conn.execute(query, params);

      // Get images for each product
      const productsWithImages = await Promise.all(
        (rows as any[]).map(async (product: any) => {
          const [images] = await conn.execute(
            'SELECT url, alt_text FROM product_images WHERE product_id = ?',
            [product.id]
          );
          return {
            id: product.id,
            name: product.name,
            description: product.description,
            price: parseFloat(product.price),
            originalPrice: parseFloat(product.price),
            categoryId: product.category_id,
            imageUrls: (images as any[]).length > 0 ? (images as any[]).map(img => img.url) : ['https://via.placeholder.com/300x300?text=NoImage'],
            stock: product.stock_quantity,
            sellerId: product.seller_id,
            published: true,
            rating: 4.5,
            sold: 0,
            store: { id: product.seller_id, name: 'Store' },
            createdAt: product.created_at,
          };
        })
      );

      return NextResponse.json({
        success: true,
        data: productsWithImages,
        total: (rows as any[]).length,
      });
    } finally {
      conn.release();
    }
  } catch (err: any) {
    console.error('Get products error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Verify seller/admin (check session cookie)
    const sessionCookie = req.cookies.get('session');
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = JSON.parse(sessionCookie.value);
    if (!user.isAdmin && !user.isSeller) {
      return NextResponse.json(
        { error: 'Only sellers and admins can add products' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const name = body.name;
    const description = body.description || '';
    const price = body.price;
    const stock = body.stock ?? 0;
    const imageUrls: string[] = Array.isArray(body.imageUrls) ? body.imageUrls : (body.imageUrls ? [body.imageUrls] : []);

    // category can be provided as `category` (name string) or `categoryId` (numeric id)
    const categoryName: string | undefined = body.category;
    const categoryIdFromClient: number | undefined = body.categoryId ? parseInt(body.categoryId as any, 10) : undefined;

    // Validate required fields
    if (!name || price === undefined || (!categoryName && !categoryIdFromClient)) {
      return NextResponse.json(
        { error: 'Missing required fields: name, price, category (or categoryId)' },
        { status: 400 }
      );
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      let categoryId: number | undefined = undefined;

      if (categoryIdFromClient && Number.isFinite(categoryIdFromClient)) {
        categoryId = categoryIdFromClient;
      } else if (categoryName) {
        // First check if category exists by name, if not create it
        const [categoryResult] = await conn.execute(
          'SELECT id FROM categories WHERE name = ?',
          [categoryName]
        );
        if ((categoryResult as any[]).length > 0) {
          categoryId = (categoryResult as any[])[0].id;
        } else {
          // Create new category if it doesn't exist
          const [newCategory] = await conn.execute(
            'INSERT INTO categories (name) VALUES (?)',
            [categoryName]
          );
          categoryId = (newCategory as any).insertId;
        }
      }

      // Insert product; avoid storing long data URLs (base64) in the `image_url` column
      // Prefer a short, remote URL for the product image. If the provided image is a data URL
      // or exceeds typical VARCHAR limits, leave `image_url` empty and still save images
      // in `product_images`.
      const firstImageCandidate = imageUrls.length > 0 ? imageUrls[0] : '';
      const firstImage =
        firstImageCandidate && !firstImageCandidate.startsWith('data:') && firstImageCandidate.length <= 255
          ? firstImageCandidate
          : '';
      const [result] = await conn.execute(
        'INSERT INTO products (name, description, price, category_id, seller_id, stock_quantity, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, description, parseFloat(price as any), categoryId, user.id || 1, parseInt(stock as any) || 0, firstImage]
      );

      const productId = (result as any).insertId;

      // If client provided data URLs (base64) for images, save them to disk and
      // replace with relative paths. This prevents storing long base64 strings
      // in the DB which can exceed column limits.
      const savedImageUrls: string[] = [];
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadDir, { recursive: true });

      for (const url of imageUrls) {
        if (!url) continue;

        if (url.startsWith('data:')) {
          // data:[<mediatype>][;base64],<data>
          const match = url.match(/^data:(image\/[^;]+);base64,(.*)$/);
          if (!match) continue;
          const mime = match[1];
          const base64 = match[2];
          const ext = mime.split('/')[1] || 'png';
          const filename = `${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`;
          const filePath = path.join(uploadDir, filename);
          const buffer = Buffer.from(base64, 'base64');
          await fs.writeFile(filePath, buffer);
          savedImageUrls.push(`/uploads/${filename}`);
        } else {
          // Regular URL or short path — store as-is
          savedImageUrls.push(url);
        }
      }

      // Also insert into product_images for each saved image URL
      for (const url of savedImageUrls) {
        if (url) {
          await conn.execute(
            'INSERT INTO product_images (product_id, url) VALUES (?, ?)',
            [productId, url]
          );
        }
      }

      await conn.commit();

      return NextResponse.json({
        success: true,
        productId,
        message: 'Product added successfully',
      });
    } catch (dbErr) {
      await conn.rollback();
      throw dbErr;
    } finally {
      conn.release();
    }
  } catch (err: any) {
    console.error('Create product error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
