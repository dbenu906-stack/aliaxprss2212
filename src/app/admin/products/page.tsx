'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { AddProductButton } from './_components/buttons';
import { ProductsTable } from './_components/table';
import { useEffect, useState } from 'react';

// Define the type for a product for type safety
export interface Product {
    id: string | number;
    name: string;
    category: string;
    category_id?: number;
    price: number;
    stock: number;
    stock_quantity?: number;
    imageUrl?: string;
    image_url?: string;
    createdAt: string;
    created_at?: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                if (!response.ok) {
                    console.error('Failed to fetch products:', response.status);
                    setProducts([]);
                    return;
                }

                const result = await response.json();
                
                // Transform API response to match table format
                const transformedProducts = (result.data || []).map((product: any) => ({
                    id: product.id,
                    name: product.name,
                    category: product.category_name || product.category || 'Uncategorized',
                    category_id: product.categoryId || product.category_id,
                    price: product.price,
                    stock: product.stock_quantity || product.stock || 0,
                    image_url: product.imageUrls?.[0] || product.image_url,
                    createdAt: product.createdAt || product.created_at || new Date().toISOString(),
                }));
                
                setProducts(transformedProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
                setProducts([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Products</CardTitle>
                    <CardDescription>
                        {isLoading ? 'Loading products...' : `Manage your store's products (${products.length} found).`}
                    </CardDescription>
                </div>
                <AddProductButton />
            </CardHeader>
            <CardContent>
                <ProductsTable data={products} />
            </CardContent>
        </Card>
    );
}
