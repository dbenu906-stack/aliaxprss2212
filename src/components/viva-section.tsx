'use client';

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { homepageContent } from "@/lib/homepage-content";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

export function VivaSection() {
    const { vivaBanners } = useAppContext();
    
    // Use admin-managed viva banner if available, otherwise use defaults
    const banner = vivaBanners.length > 0 ? vivaBanners[0] : null;
    const title = banner?.title || homepageContent.vivaBannerTitle;
    const subtitle = banner?.subtitle || "Your fashion choice";
    const products = homepageContent.vivaProducts;

    return (
        <div className="bg-cyan-100 p-6 rounded-lg relative overflow-hidden">
            <div className="relative z-10">
                <h2 className="text-4xl font-bold font-serif">{title}</h2>
                <p className="mb-4">{subtitle}</p>
                <Button variant="dark" className="mb-6">Shop now</Button>
                <div className="grid grid-cols-3 gap-4">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
            {banner?.image_url ? (
                <Image
                    src={banner.image_url}
                    alt="Fashion banner"
                    width={400}
                    height={400}
                    className="absolute top-0 right-0 z-0 opacity-50 md:opacity-100"
                />
            ) : (
                <Image
                    src="/images/viva-banner.png"
                    alt="Fashion model"
                    width={400}
                    height={400}
                    className="absolute top-0 right-0 z-0 opacity-50 md:opacity-100"
                />
            )}
        </div>
    );
}
