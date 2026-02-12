'use client';

import { useAppContext } from '@/context/AppContext';
import Image from 'next/image';

export function DynamicHomeBanner() {
  const { homeBanners } = useAppContext();

  if (homeBanners.length === 0) {
    return null;
  }

  const banner = homeBanners[0];

  return (
    <div className="w-full">
      {banner.image_url && (
        <div className="relative w-full h-96 md:h-[500px] rounded-lg overflow-hidden">
          <Image
            src={banner.image_url}
            alt="Home Banner"
            fill
            className="object-cover w-full h-full"
            priority
          />
        </div>
      )}
    </div>
  );
}
