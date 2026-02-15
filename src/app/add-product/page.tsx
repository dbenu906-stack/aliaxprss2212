'use client';

import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { uploadFile } from '@/lib/upload';
import { X } from 'lucide-react';

import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.preprocess((a) => parseFloat(a as string), z.number().min(0, 'Price must be a positive number')),
  originalPrice: z.preprocess((a) => parseFloat(a as string), z.number().min(0, 'Original price must be a positive number')),
  categoryId: z.string().min(1, 'Category is required'),
  stock: z.preprocess((a) => parseInt(a as string, 10), z.number().min(0, 'Stock must be a positive number')),
});

const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

export default function AddProductPage() {
  const { user, categories } = useAppContext();
  const router = useRouter();
  const { toast } = useToast();
  const [productImages, setProductImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      originalPrice: 0,
      categoryId: '',
      stock: 0,
    },
  });

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'seller')) {
      router.push('/');
    }
  }, [user, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 4);
    setProductImages(files);

    // Generate previews
    const previews: string[] = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result as string);
        if (previews.length === files.length) {
          setImagePreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newImages = productImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setProductImages(newImages);
    setImagePreviews(newPreviews);
  };

  const onSubmit = async (data: any) => {
    if (productImages.length === 0) {
      toast({ variant: 'destructive', title: 'At least one product image is required' });
      return;
    }

    try {
      // Upload images to /api/upload and get short URLs
      const imageUrls = await Promise.all(productImages.map(f => uploadFile(f)));

      // Send to API with correct field names
      const productPayload = {
        name: data.name,
        description: data.description,
        price: data.price,
        categoryId: parseInt(data.categoryId, 10),
        stock: data.stock,
        imageUrls: imageUrls,
        store: {
            id: user?.id,
            name: user?.storeName || 'My Store',
        }
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productPayload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add product');
      }

      toast({ title: 'Product Added', description: 'Your product has been added successfully.' });
      reset();
      setProductImages([]);
      setImagePreviews([]);
      router.push(user?.role === 'admin' ? '/admin/products' : '/seller');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error adding product';
      toast({ variant: 'destructive', title: 'Error', description: msg });
    }
  };

  if (!user || (user.role !== 'admin' && user.role !== 'seller')) {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Add New Product</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => <Input id="name" {...field} className="mt-1" />}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => <Textarea id="description" {...field} className="mt-1" />}
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                            <Controller
                            name="price"
                            control={control}
                            render={({ field }) => <Input id="price" type="number" {...field} className="mt-1" />}
                            />
                            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700">Original Price</label>
                            <Controller
                            name="originalPrice"
                            control={control}
                            render={({ field }) => <Input id="originalPrice" type="number" {...field} className="mt-1" />}
                            />
                            {errors.originalPrice && <p className="text-red-500 text-sm mt-1">{errors.originalPrice.message}</p>}
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Category</label>
                            <Controller
                            name="categoryId"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                                </SelectContent>
                                </Select>
                            )}
                            />
                            {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
                            <Controller
                            name="stock"
                            control={control}
                            render={({ field }) => <Input id="stock" type="number" {...field} className="mt-1" />}
                            />
                            {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Images (up to 4)</label>
                        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-gray-400 transition-colors">
                            <input 
                                type="file" 
                                accept="image/*" 
                                multiple
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="text-center">
                                <p className="text-sm text-gray-600">Click to upload images (up to 4)</p>
                                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB each</p>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">Upload images for product preview. The first image will be displayed as the main product image.</p>

                        {/* Image previews */}
                        {imagePreviews.length > 0 && (
                            <div className="mt-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Images ({imagePreviews.length})</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative group">
                                            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img 
                                                    src={preview} 
                                                    alt={`Preview ${index + 1}`} 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            <p className="text-xs text-gray-500 text-center mt-1">Image {index + 1}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit">Add Product</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    </div>
  );
}
