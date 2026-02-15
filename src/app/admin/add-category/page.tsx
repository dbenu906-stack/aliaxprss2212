'use client';

import { useState } from 'react';
import { uploadFile } from '@/lib/upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { addCategory } from './actions';
import Image from 'next/image';

export default function AddCategoryPage() {
  const [categoryName, setCategoryName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const url = await uploadFile(file);
      setImageUrl(url);
      toast({ title: 'Success', description: 'Image uploaded successfully' });
    } catch (err) {
      console.error('Image upload failed:', err);
      toast({ title: 'Error', description: 'Failed to upload image', variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      toast({ title: 'Error', description: 'Category name is required', variant: 'destructive' });
      return;
    }

    if (!imageUrl) {
      toast({ title: 'Error', description: 'Category image is required', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await addCategory({
        name: categoryName,
        image_url: imageUrl,
      });

      if (result.success) {
        toast({ title: 'Success', description: result.message });
        setCategoryName('');
        setImageUrl('');
      } else {
        toast({ title: 'Error', description: result.message, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create category', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Create New Category</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="categoryName" className="text-lg font-medium">Category Name</Label>
          <Input
            id="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="e.g., Electronics, Fashion, Home & Garden"
            className="mt-2"
          />
        </div>

        <div>
          <Label className="text-lg font-medium">Category Icon/Image</Label>
          <p className="text-sm text-gray-600 mt-1 mb-3">This icon will appear in the Shop by Category section (recommended size: 96x96)</p>
          
          {imageUrl && (
            <div className="mb-4 flex items-center gap-4">
              <div className="relative w-24 h-24 bg-gray-100 rounded">
                <Image
                  src={imageUrl}
                  alt={categoryName}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{categoryName}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setImageUrl('')}
                >
                  Change Image
                </Button>
              </div>
            </div>
          )}
          
          {!imageUrl && (
            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleImageUpload(e.target.files[0]);
                  }
                }}
                disabled={isUploading}
                className="mt-2"
              />
              {isUploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting || !categoryName.trim() || !imageUrl}>
            {isSubmitting ? 'Creating...' : 'Create Category'}
          </Button>
        </div>
      </form>
    </div>
  );
}
