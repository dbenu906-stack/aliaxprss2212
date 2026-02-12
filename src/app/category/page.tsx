
'use client';

import { useAppContext } from '@/context/AppContext';
import { ProductCard } from '@/components/product-card';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const Page = () => {
  const { categories, products } = useAppContext();
  const [categoryList, setCategoryList] = useState(categories);

  useEffect(() => {
    setCategoryList(categories);
  }, [categories]);

  const categoryProducts = products.slice(0, 8);

  return (
    <div className="bg-white">
      <div className="py-16 sm:py-24 xl:max-w-7xl xl:mx-auto xl:px-8">
        <div className="px-4 sm:px-6 lg:px-8 xl:px-0">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Categories</h1>
        </div>

        <div className="mt-8 px-4 sm:px-6 lg:px-8 xl:px-0">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-y-10 gap-x-6">
                {categoryList.map((category) => (
                <Link key={category.id} href={`#`} className="group text-center">
                    <div className="relative w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                    <Image
                        src={category.image_url || category.imageUrl || '/placeholder.svg'}
                        alt={category.name}
                        width={80}
                        height={80}
                        objectFit="cover"
                        className="rounded-full"
                    />
                    </div>
                    <p className="mt-2 block text-sm font-medium text-gray-900 group-hover:text-indigo-600">
                    {category.name}
                    </p>
                </Link>
                ))}
            </div>
        </div>

        <div className="mt-16 px-4 sm:px-6 lg:px-8 xl:px-0">
            <h2 className="text-xl font-bold tracking-tight text-gray-900">Featured Products</h2>
        </div>

        <div className="mt-6 px-4 sm:px-6 lg:px-8 xl:px-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                {categoryProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

