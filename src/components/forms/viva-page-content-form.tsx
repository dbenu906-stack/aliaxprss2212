'use client';

import { useState } from 'react';
import { uploadFile } from '@/lib/upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export function VivaPageContentForm() {
  const { toast } = useToast();
  const [bannerImage, setBannerImage] = useState('');
  const [product1Id, setProduct1Id] = useState('');
  const [product2Id, setProduct2Id] = useState('');
  const [product3Id, setProduct3Id] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await uploadFile(file);
      setBannerImage(url);
      toast({ title: 'Success', description: 'Banner image uploaded successfully.' });
    } catch (error) {
      console.error('Upload failed:', error);
      toast({ title: 'Error', description: 'Failed to upload image.', variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!bannerImage) {
      toast({ title: 'Error', description: 'Please upload a banner image.', variant: 'destructive' });
      return;
    }
    console.log({ bannerImage, product1Id, product2Id, product3Id });
    toast({ title: 'Success', description: 'Viva page content updated successfully.' });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div>
        <label className="block text-sm font-medium mb-2">Banner Image *</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={isUploading}
          className="w-full p-2 border rounded"
          required
        />
        {isUploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
        {bannerImage && (
          <div className="mt-2">
            <img src={bannerImage} alt="Banner Preview" className="max-h-48 rounded" />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Product 1 ID</label>
        <Input
          placeholder="Enter product ID"
          value={product1Id}
          onChange={(e) => setProduct1Id(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Product 2 ID</label>
        <Input
          placeholder="Enter product ID"
          value={product2Id}
          onChange={(e) => setProduct2Id(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Product 3 ID</label>
        <Input
          placeholder="Enter product ID"
          value={product3Id}
          onChange={(e) => setProduct3Id(e.target.value)}
        />
      </div>

      <Button type="submit" disabled={isUploading}>Update</Button>
    </form>
  );
}
