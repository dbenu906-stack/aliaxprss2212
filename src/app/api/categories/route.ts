import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/mysql';

export async function GET() {
  try {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.execute('SELECT * FROM categories');
      return NextResponse.json({
        success: true,
        data: (rows as any[]).map(cat => ({
          id: cat.id,
          name: cat.name,
          image_url: cat.image_url,
          imageUrl: cat.image_url,
        })),
      });
    } finally {
      conn.release();
    }
  } catch (err: any) {
    console.error('Get categories error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('session');
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = JSON.parse(sessionCookie.value);
    if (!user.isAdmin) {
      return NextResponse.json({ error: 'Only admins can create categories' }, { status: 403 });
    }

    const { name, image_url } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Category name required' }, { status: 400 });
    }

    const conn = await pool.getConnection();
    try {
      const [result] = await conn.execute(
        'INSERT INTO categories (name, image_url) VALUES (?, ?)',
        [name, image_url || '']
      );
      return NextResponse.json({
        success: true,
        categoryId: (result as any).insertId,
        message: 'Category created successfully',
      });
    } finally {
      conn.release();
    }
  } catch (err: any) {
    console.error('Create category error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('session');
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = JSON.parse(sessionCookie.value);
    if (!user.isAdmin) {
      return NextResponse.json({ error: 'Only admins can update categories' }, { status: 403 });
    }

    const { id, name, image_url } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Category id required' }, { status: 400 });
    }

    const conn = await pool.getConnection();
    try {
      const [result] = await conn.execute(
        'UPDATE categories SET name = ?, image_url = ? WHERE id = ?',
        [name, image_url || '', id]
      );
      
      if ((result as any).affectedRows === 0) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: 'Category updated successfully',
      });
    } finally {
      conn.release();
    }
  } catch (err: any) {
    console.error('Update category error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
