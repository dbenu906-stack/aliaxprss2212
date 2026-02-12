import React from 'react';

interface HeroBannerProps {
  title: string;
  imageUrl?: string;
}

export function HeroBanner({ title, imageUrl }: HeroBannerProps) {
  return (
    <section className="w-full bg-gray-50 rounded-lg overflow-hidden">
      <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">{title}</h1>
        </div>
        {imageUrl ? (
          // Use a plain img tag to avoid depending on next/image remote config
          <div className="w-full md:w-1/3">
            <img src={imageUrl} alt={title} className="w-full h-auto rounded-md object-cover" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
