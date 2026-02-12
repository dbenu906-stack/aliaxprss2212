'use client';

import { useState } from 'react';
import { uploadFile } from '@/lib/upload';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function HomePageContentForm() {
  const { toast } = useToast();
  const [bannerImage, setBannerImage] = useState('');
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
    console.log({ bannerImage });
    toast({ title: 'Success', description: 'Homepage content updated successfully.' });
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
      <Button type="submit" disabled={isUploading}>Update</Button>
    </form>
  );
}
