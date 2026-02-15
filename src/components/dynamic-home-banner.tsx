'use client';

import { useAppContext } from '@/context/AppContext';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function DynamicHomeBanner() {
  const { homeBanners } = useAppContext();

  if (homeBanners.length === 0) {
    return null;
  }

  const banner = homeBanners[0];

  return (
    <div className="w-full hidden md:block">
      {banner.image_url && (
        <div className="relative w-full h-64 md:h-[380px] rounded-lg overflow-hidden">
          <Image
            src={banner.image_url}
            alt={banner.title || "Home Banner"}
            fill
            className="object-cover w-full h-full"
            priority
          />
        </div>
      )}
    </div>
  );
}
