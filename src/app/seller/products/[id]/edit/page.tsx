'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/image-upload';
import { categories } from '@/lib/data';
import { useAppContext } from '@/context/AppContext';
import type { Product } from '@/lib/types';

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { products, updateProduct } = useAppContext();
  const [product, setProduct] = useState<Partial<Product> | null>(null);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const p = products.find((p) => p.id === id);
    if (p) {
      setProduct(p);
      setImages(p.imageUrls || []);
    }
  }, [id, products]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (product) {
      const isNumeric = ['price', 'originalPrice', 'stock'].includes(name);
      setProduct({ ...product, [name]: isNumeric ? Number(value) || 0 : value });
    }
  };

  const handleCategoryChange = (value: string) => {
    if (product) {
      setProduct({ ...product, categoryId: parseInt(value) });
    }
  };

  const handleImageChange = (urls: string[]) => {
    setImages(urls);
  };

  const handleSave = () => {
    if (product) {
      updateProduct(product.id as string, { ...product, imageUrls: images } as Product);
      router.push('/seller/products');
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Product</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" name="name" value={product.name || ''} onChange={handleInputChange} placeholder="e.g., Summer T-Shirt" />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={product.description || ''} onChange={handleInputChange} placeholder="Describe the product..." />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Price (৳)</Label>
                <Input id="price" name="price" type="number" value={product.price || 0} onChange={handleInputChange} placeholder="e.g., 500" />
              </div>
              <div>
                <Label htmlFor="originalPrice">Original Price</Label>
                <Input id="originalPrice" name="originalPrice" type="number" value={product.originalPrice || 0} onChange={handleInputChange} placeholder="e.g., 700" />
              </div>
              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" name="stock" type="number" value={product.stock || 0} onChange={handleInputChange} placeholder="e.g., 100" />
              </div>
            </div>
            <div>
              <Label htmlFor="categoryId">Category</Label>
              <Select onValueChange={handleCategoryChange} defaultValue={String(product.categoryId)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Product Images (up to 4)</Label>
              <ImageUpload value={images} onChange={handleImageChange} maxImages={4} />
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
