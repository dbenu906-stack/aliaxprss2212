'use client';

import { useState } from 'react';
import { uploadFile } from '@/lib/upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { addCategory } from './actions'; // Import the server action

export default function AddCategoryPage() {
  const [categoryName, setCategoryName] = useState('');
  const [subCategories, setSubCategories] = useState<{ name: string; image: string | File | null }[]>([{ name: '', image: null }]);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const handleAddSubCategory = () => {
    setSubCategories([...subCategories, { name: '', image: null }]);
  };

  const handleSubCategoryChange = (index: number, field: 'name' | 'image', value: string | File | null) => {
    const newSubCategories = [...subCategories];
    if (field === 'image' && value instanceof File) {
        // If a File object is passed directly, keep it (deprecated path)
        newSubCategories[index][field] = value;
    } else if (typeof value === 'string') {
        newSubCategories[index][field] = value;
    }
    setSubCategories(newSubCategories);
  };

  const handleSubCategoryFile = async (index: number, file: File | null) => {
    if (!file) {
      handleSubCategoryChange(index, 'image', null);
      return;
    }

    try {
      setUploadingIndex(index);
      const url = await uploadFile(file);
      handleSubCategoryChange(index, 'image', url);
    } catch (err) {
      console.error('Sub-category image upload failed', err);
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('categoryName', categoryName);
    subCategories.forEach((sub, index) => {
        formData.append(`subCategories[${index}][name]`, sub.name);
        if (sub.image) {
            formData.append(`subCategories[${index}][image]`, sub.image);
        }
    });

    const result = await addCategory(formData);

    if (result.success) {
      toast({ title: 'Success', description: result.message });
      setCategoryName('');
      setSubCategories([{ name: '', image: null }]);
    } else {
      toast({ title: 'Error', description: result.message, variant: 'destructive' });
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-3xl font-bold mb-6">Add New Category</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <Label htmlFor="categoryName" className="text-lg">Category Name</Label>
          <Input
            id="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Sub-categories</h2>
          {subCategories.map((sub, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 items-center">
              <div>
                <Label htmlFor={`subCategoryName-${index}`}>Sub-category Name</Label>
                <Input
                  id={`subCategoryName-${index}`}
                  value={sub.name}
                  onChange={(e) => handleSubCategoryChange(index, 'name', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor={`subCategoryImage-${index}`}>Image</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id={`subCategoryImage-${index}`}
                    type="file"
                    onChange={(e) => handleSubCategoryFile(index, e.target.files ? e.target.files[0] : null)}
                    className="mt-1"
                  />
                  {uploadingIndex === index && <span className="text-sm text-gray-500">Uploading...</span>}
                </div>
              </div>
            </div>
          ))}
          <Button type="button" onClick={handleAddSubCategory} variant="outline">
            Add Sub-category
          </Button>
        </div>

        <Button type="submit">Create Category</Button>
      </form>
    </div>
  );
}
