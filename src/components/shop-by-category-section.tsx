'use client';

import { CategoryCarousel } from './category-carousel';
import { ProductCard } from './product-card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { homepageContent } from '@/lib/homepage-content';
import { useAppContext } from '@/context/AppContext';

export function ShopByCategorySection() {
  const { vivaBanners, products } = useAppContext();
  
  const banner = vivaBanners.length > 0 ? vivaBanners[0] : null;
  const title = banner?.title || homepageContent.vivaBannerTitle;
  const subtitle = banner?.subtitle || "Your fashion choice";
  const vivaProducts = products.slice(0, 3);

  return (
    <section className="space-y-8">
      <h2 className="text-3xl font-bold text-center mb-8">Shop by category</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Left: Viva Banner with Products */}
        <div className="relative rounded-lg overflow-hidden min-h-[420px]">
          {/* Background image */}
          {banner?.image_url ? (
            <Image 
              src={banner.image_url} 
              alt={title} 
              fill 
              className="object-cover"
            />
          ) : (
            <Image 
              src="/images/viva-banner.png" 
              alt={title} 
              fill 
              className="object-cover"
            />
          )}
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          
          {/* Text and Button - Top Left */}
          <div className="absolute top-6 left-6 z-10">
            <h3 className="text-3xl md:text-4xl font-bold font-serif text-black mb-2">{title}</h3>
            <p className="text-black mb-4">{subtitle}</p>
            {banner?.button_text && banner?.button_link ? (
              <Link href={banner.button_link}>
                <Button variant="dark">{banner.button_text}</Button>
              </Link>
            ) : banner?.button_text ? (
              <Button variant="dark">{banner.button_text}</Button>
            ) : (
              <Button variant="dark">Shop now</Button>
            )}
          </div>
          
          {/* 3 Product Cards - Bottom */}
          <div className="absolute left-4 right-4 bottom-4 z-20">
            <div className="grid grid-cols-3 gap-3">
              {vivaProducts.map((product) => (
                <div key={product.id} className="h-full">
                  <ProductCard product={product} size="compact" />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right: Category Carousel */}
        <div>
          <CategoryCarousel />
        </div>
      </div>
    </section>
  );
}
