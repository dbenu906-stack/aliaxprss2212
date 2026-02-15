'use client';

import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { homepageContent } from "@/lib/homepage-content";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

export function VivaSection() {
    const { vivaBanners } = useAppContext();
    
    // Use admin-managed viva banner if available, otherwise use defaults
    const banner = vivaBanners.length > 0 ? vivaBanners[0] : null;
    const title = banner?.title || homepageContent.vivaBannerTitle;
    const subtitle = banner?.subtitle || "Your fashion choice";

    return (
        <div className="w-full">
            <div className="relative w-full h-64 md:h-[360px] lg:h-[500px] rounded-lg overflow-hidden">
                {/* Background image (admin-uploaded) */}
                {banner?.image_url ? (
                    <Image src={banner.image_url} alt={title} fill className="object-cover" />
                ) : (
                    <Image src="/images/viva-banner.png" alt={title} fill className="object-cover" />
                )}

                {/* gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                <div className="absolute left-6 top-6 z-10">
                    <h2 className="text-4xl font-bold font-serif" style={{ color: (banner as any)?.text_color || '#ffffff' }}>{title}</h2>
                    <p className="mb-4" style={{ color: (banner as any)?.text_color || '#ffffff' }}>{subtitle}</p>
                    {banner?.button_text && banner?.button_link ? (
                      <Link href={banner.button_link}>
                        <Button variant="dark" className="mb-6">{banner.button_text}</Button>
                      </Link>
                    ) : banner?.button_text ? (
                      <Button variant="dark" className="mb-6">{banner.button_text}</Button>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
