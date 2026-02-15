 'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProductCard } from '@/components/product-card';
import { MoreToLove } from '@/components/more-to-love';
import { Product } from '@/lib/types';
import { slugify } from '@/lib/utils';

interface Category {
  id: number;
  name: string;
  image_url?: string;
}

export default function CategoryPage() {
  const params = useParams();
  const categoryParam = (params?.category as string) || '';
  const slug = categoryParam;
  
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        setIsLoading(true);
        
        const categoriesRes = await fetch('/api/categories');
        if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
        
        const categoriesData = await categoriesRes.json();
        const categories = categoriesData.data || [];
        
        const matchedCategory = categories.find(
          (cat: any) => slugify(cat.name) === slug.toLowerCase()
        );
        
        if (!matchedCategory) {
          setError('Category not found');
          setIsLoading(false);
          return;
        }
        
        setCategory(matchedCategory);
        
        const productsRes = await fetch('/api/products');
        if (!productsRes.ok) throw new Error('Failed to fetch products');
        
        const productsData = await productsRes.json();
        const allProducts = productsData.data || productsData || [];
        const categoryProducts = allProducts.filter(
          (prod: any) => (prod.category_id || prod.categoryId) === matchedCategory.id
        );
        
        setProducts(categoryProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchCategoryAndProducts();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-red-600">{error || 'Category not found'}</div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            {category.name}
          </h1>
          {category.image_url && (
            <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={category.image_url}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Products section */}
        <div>
          {products.length > 0 ? (
            <>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">
                Products in {category.name}
              </h2>
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No products found in this category yet.</p>
            </div>
          )}
        </div>

        {/* More to Love section */}
        <div className="mt-16">
          <MoreToLove />
        </div>
      </div>
    </div>
  );
}
