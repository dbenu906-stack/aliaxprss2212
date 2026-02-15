'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { uploadFile } from '@/lib/upload';
import { removeCategory } from './actions';
import Image from 'next/image';

// Define a type for the category to ensure type safety
interface Category {
    id: number;
    name: string;
    image_url?: string;
}

export default function ManageCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: '', image_url: '' });
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const result = await response.json();
      setCategories(result.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({ title: 'Error', description: 'Could not fetch categories.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleEditStart = (category: Category) => {
    setEditingId(category.id);
    setEditForm({ name: category.name, image_url: category.image_url || '' });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm({ name: '', image_url: '' });
  };

  const handleImageUpload = async (categoryId: number, file: File) => {
    try {
      setUploadingId(categoryId);
      const url = await uploadFile(file);
      setEditForm(prev => ({ ...prev, image_url: url }));
      toast({ title: 'Success', description: 'Image uploaded successfully' });
    } catch (error) {
      console.error('Image upload failed:', error);
      toast({ title: 'Error', description: 'Failed to upload image', variant: 'destructive' });
    } finally {
      setUploadingId(null);
    }
  };

  const handleSaveEdit = async (categoryId: number) => {
    if (!editForm.name.trim()) {
      toast({ title: 'Error', description: 'Category name is required', variant: 'destructive' });
      return;
    }

    try {
      const response = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: categoryId,
          name: editForm.name,
          image_url: editForm.image_url,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update category');
      }

      toast({ title: 'Success', description: 'Category updated successfully' });
      setEditingId(null);
      await loadCategories();
    } catch (error) {
      console.error('Update error:', error);
      toast({ title: 'Error', description: 'Failed to update category', variant: 'destructive' });
    }
  };

  const handleRemoveCategory = async (categoryId: number) => {
    const result = await removeCategory(categoryId);
    if (result.success) {
      toast({ title: 'Success', description: result.message });
      await loadCategories();
    } else {
      toast({ title: 'Error', description: result.message, variant: 'destructive' });
    }
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6"><p>Loading categories...</p></div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-3xl font-bold mb-6">Manage Categories</h1>
      <div className="space-y-6">
        {categories.length > 0 ? (
            categories.map((category) => (
              <div key={category.id} className="border rounded-lg p-6">
                {editingId === category.id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`name-${category.id}`}>Category Name</Label>
                      <Input
                        id={`name-${category.id}`}
                        value={editForm.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Category Icon/Image</Label>
                      <div className="flex flex-col gap-3 mt-1">
                        {editForm.image_url && (
                          <div className="relative w-24 h-24 bg-gray-100 rounded">
                            <Image
                              src={editForm.image_url}
                              alt={editForm.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleImageUpload(category.id, e.target.files[0]);
                              }
                            }}
                            disabled={uploadingId === category.id}
                          />
                          {uploadingId === category.id && (
                            <span className="text-sm text-gray-500">Uploading...</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={handleEditCancel}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleSaveEdit(category.id)}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {category.image_url && (
                        <div className="relative w-16 h-16 bg-gray-100 rounded">
                          <Image
                            src={category.image_url}
                            alt={category.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                      )}
                      <div>
                        <p className="text-lg font-medium">{category.name}</p>
                        {category.image_url && (
                          <p className="text-sm text-gray-500 truncate">{category.image_url}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleEditStart(category)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleRemoveCategory(category.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))
        ) : (
            <p>No categories found.</p>
        )}
      </div>
    </div>
  );
}
