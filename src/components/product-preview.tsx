
'use client';

import { useState, useEffect } from 'react';
import { Star, ShieldCheck, Package, Undo2, Heart, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';

import { useAppContext } from '@/context/AppContext';
import { formatPrice } from '@/lib/utils';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export default function ProductPreview() {
  const { country, addToCart, closePreview, isPreviewOpen, previewProduct } = useAppContext();
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (isPreviewOpen) {
      document.body.style.overflow = 'hidden';
      setQuantity(1);
      setCurrentImageIndex(0);
      setIsMobile(window.innerWidth < 768);
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isPreviewOpen]);

  if (!isPreviewOpen || !previewProduct) return null;

  // Handle both imageUrls array format
  const imageUrls = previewProduct.imageUrls || [];
  const displayImages = Array.isArray(imageUrls) 
    ? imageUrls.map(url => typeof url === 'string' ? url : (url as any).url)
    : [];

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  const nextImage = () => {
    if (displayImages.length === 0) return;
    setCurrentImageIndex(prev => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    if (displayImages.length === 0) return;
    setCurrentImageIndex(prev => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const selectedImage = displayImages.length > 0 ? displayImages[currentImageIndex] : '/placeholder.svg';

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 flex items-center justify-center ${isPreviewOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={closePreview}>
      
      {/* Modal - Centered on both mobile and desktop */}
      <div 
        className={`relative bg-white w-11/12 md:w-full md:max-w-4xl rounded-lg shadow-2xl overflow-hidden transition-transform duration-300 flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh] ${isPreviewOpen ? 'scale-100' : 'scale-95'}`}
        onClick={(e) => e.stopPropagation()}>
        
        {/* Close button - Always visible */}
        <button 
          type="button" 
          className="absolute top-4 right-4 z-20 p-2 text-gray-600 hover:text-gray-900 transition-colors bg-white rounded-full shadow-md md:shadow-none md:bg-transparent"
          onClick={closePreview}
        >
          <X className="h-6 w-6" />
        </button>

        {/* Left side - Images (Mobile: Flex, Desktop: Left) */}
        <div className="w-full md:w-1/2 bg-gray-50 flex flex-col md:border-r border-gray-200 max-h-96 md:max-h-full">
          
          {/* Main image display */}
          <div className="flex-1 relative flex items-center justify-center bg-white overflow-hidden">
            {selectedImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selectedImage}
                alt={previewProduct.name}
                className="object-cover w-full h-full transition-transform duration-300"
              />
            ) : (
              <div className="text-center text-gray-400">
                <span>No Image</span>
              </div>
            )}
            
            {/* Image navigation arrows */}
            {displayImages.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between px-2 md:px-4 pointer-events-none">
                <button 
                  onClick={prevImage} 
                  className="bg-white/90 hover:bg-white rounded-full p-2 shadow-lg pointer-events-auto transition-all"
                >
                  <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-gray-800" />
                </button>
                <button 
                  onClick={nextImage} 
                  className="bg-white/90 hover:bg-white rounded-full p-2 shadow-lg pointer-events-auto transition-all"
                >
                  <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-gray-800" />
                </button>
              </div>
            )}
          </div>

          {/* Image thumbnails */}
          {displayImages.length > 1 && (
            <div className="flex gap-1.5 overflow-x-auto p-2 md:p-3 bg-gray-50 scrollbar-hide">
              {displayImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === currentImageIndex
                      ? 'border-blue-500'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right side - Product details */}
        <div className="w-full md:w-1/2 bg-white flex flex-col overflow-hidden">
          
          {/* Scrollable content */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6">
            {/* Product name */}
            <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-2 pr-8">{previewProduct.name}</h2>

            {/* Rating and sold info */}
            <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4 pb-3 md:pb-4 border-b border-gray-200">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-xs md:text-sm font-medium text-gray-700">
                  {previewProduct.rating ? previewProduct.rating.toFixed(1) : 'N/A'}
                </span>
              </div>
              <span className="text-xs md:text-sm text-gray-500">|</span>
              <span className="text-xs md:text-sm text-gray-600">{previewProduct.sold || 0} sold</span>
            </div>

            {/* Price section */}
            <div className="mb-3 md:mb-4">
              <div className="flex items-baseline gap-2 mb-1 md:mb-2">
                <span className="text-2xl md:text-4xl font-bold text-gray-900">
                  {formatPrice(previewProduct.price, country)}
                </span>
                {previewProduct.originalPrice && previewProduct.originalPrice > previewProduct.price && (
                  <span className="text-xs md:text-lg text-gray-400 line-through">
                    {formatPrice(previewProduct.originalPrice, country)}
                  </span>
                )}
              </div>
              {previewProduct.originalPrice && previewProduct.originalPrice > previewProduct.price && (
                <div className="text-red-600 text-xs md:text-sm font-medium">
                  Save {formatPrice(previewProduct.originalPrice - previewProduct.price, country)}
                </div>
              )}
            </div>

            {/* Service benefits */}
            <div className="space-y-2 mb-3 md:mb-4 pb-3 md:pb-4 border-b border-gray-200">
              <div className="flex items-start gap-2 md:gap-3">
                <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-xs md:text-sm text-gray-600">Official Store</span>
              </div>
              <div className="flex items-start gap-2 md:gap-3">
                <Package className="w-4 h-4 md:w-5 md:h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-xs md:text-sm text-gray-600">Free Shipping Available</span>
              </div>
              <div className="flex items-start gap-2 md:gap-3">
                <Undo2 className="w-4 h-4 md:w-5 md:h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <span className="text-xs md:text-sm text-gray-600">15-day Return/Refund Policy</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-3 md:mb-6">
              <h4 className="text-xs md:text-base font-semibold text-gray-900 mb-1 md:mb-2">Description</h4>
              <p className="text-xs md:text-sm text-gray-600 line-clamp-3">{previewProduct.description}</p>
            </div>
          </div>

          {/* Fixed footer - Always at bottom */}
          <div className="border-t border-gray-200 bg-white p-3 md:p-6 space-y-3 md:space-y-4 flex-shrink-0">
            
            {/* Quantity selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs md:text-sm font-medium text-gray-700">Quantity:</label>
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button 
                    onClick={() => handleQuantityChange(-1)} 
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 font-medium tabular-nums min-w-12 text-center">{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(1)} 
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-gray-500 ml-auto whitespace-nowrap">Max 500</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 md:gap-3">
              <Button 
                onClick={() => {
                  addToCart(previewProduct, quantity);
                  closePreview();
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm md:text-base h-11 md:h-12 font-semibold rounded-lg"
              >
                Add to Cart
              </Button>
              <Button 
                variant="outline"
                className="h-11 md:h-12 w-11 md:w-12 p-0 flex items-center justify-center hover:bg-red-50 rounded-lg"
              >
                <Heart className="w-5 h-5 md:w-6 md:h-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
