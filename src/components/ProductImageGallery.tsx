import React, { useState } from 'react';
import { ImageOff, ZoomIn, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ProductImageGalleryProps {
  images?: string[];
  primaryImageUrl?: string;
  title: string;
  className?: string;
  aspectRatio?: string;
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images = [],
  primaryImageUrl,
  title,
  className = '',
  aspectRatio = 'aspect-square'
}) => {
  const { t } = useLanguage();
  // Filter out duplicate or empty image URLs
  const uniqueImages: string[] = Array.from(
    new Set([primaryImageUrl, ...images].filter((img): img is string => Boolean(img && img.trim())))
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isFullScreen, setIsFullScreen] = useState(false);

  const currentImage = uniqueImages[activeIndex];
  const hasError = !currentImage || imageErrors[activeIndex];

  const handleImageError = (index: number) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setZoomPosition({ x, y });
  };

  const handleNext = () => {
    setActiveIndex(prev => (prev + 1) % uniqueImages.length);
  };

  const handlePrev = () => {
    setActiveIndex(prev => (prev - 1 + uniqueImages.length) % uniqueImages.length);
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Main Image Viewport with Hover Zoom */}
      <div 
        className={`relative ${aspectRatio} w-full rounded-2xl bg-slate-100 dark:bg-slate-800/80 overflow-hidden border border-slate-200/80 dark:border-slate-700/80 group select-none`}
        onMouseEnter={() => !hasError && setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        {hasError ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/40">
            <div className="w-12 h-12 rounded-2xl bg-slate-200/60 dark:bg-slate-700/60 flex items-center justify-center mb-2">
              <ImageOff className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
              {t.imageUnavailable}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 max-w-[200px]">
              {title}
            </p>
          </div>
        ) : (
          <>
            <img
              src={currentImage}
              alt={`${title} - Photo ${activeIndex + 1}`}
              className={`w-full h-full object-cover transition-transform duration-200 ${
                isZoomed ? 'scale-150 cursor-crosshair' : 'scale-100'
              }`}
              style={
                isZoomed
                  ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }
                  : undefined
              }
              onError={() => handleImageError(activeIndex)}
              loading="lazy"
            />

            {/* Quick Action Overlays */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => setIsFullScreen(true)}
                className="p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-colors cursor-pointer shadow-md"
                title={t.fullScreenGallery}
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/50 text-white text-[10px] font-medium backdrop-blur-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="w-3 h-3 text-amber-300" />
              <span>{t.clickToZoom}</span>
            </div>

            {/* Arrow Nav (if multiple images) */}
            {uniqueImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 dark:bg-slate-900/80 text-slate-800 dark:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white cursor-pointer shadow-md"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 dark:bg-slate-900/80 text-slate-800 dark:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white cursor-pointer shadow-md"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </>
        )}
      </div>

      {/* Multiple Thumbnail Strip */}
      {uniqueImages.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {uniqueImages.map((imgUrl, idx) => {
            const isSelected = activeIndex === idx;
            const thumbError = imageErrors[idx];

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#2E7D32] dark:border-[#22C55E] ring-2 ring-[#2E7D32]/20'
                    : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                }`}
                title={`View Photo ${idx + 1}`}
              >
                {thumbError ? (
                  <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[9px] text-slate-400">
                    <ImageOff className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <img
                    src={imgUrl}
                    alt={`${title} thumb ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(idx)}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Full Screen Gallery Modal */}
      {isFullScreen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between text-white pb-3 border-b border-white/10">
            <div>
              <h3 className="text-sm sm:text-base font-bold font-serif">{title}</h3>
              <p className="text-xs text-white/60">
                Photo {activeIndex + 1} of {uniqueImages.length}
              </p>
            </div>
            <button
              onClick={() => setIsFullScreen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Centered High-Res Photo View */}
          <div className="relative flex-1 flex items-center justify-center p-4">
            {uniqueImages.length > 1 && (
              <button
                onClick={handlePrev}
                className="absolute left-4 p-3 rounded-full bg-white/15 hover:bg-white/30 text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <img
              src={currentImage}
              alt={title}
              className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl"
            />

            {uniqueImages.length > 1 && (
              <button
                onClick={handleNext}
                className="absolute right-4 p-3 rounded-full bg-white/15 hover:bg-white/30 text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails */}
          <div className="flex justify-center items-center gap-2 overflow-x-auto py-2">
            {uniqueImages.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  activeIndex === idx ? 'border-[#22C55E] scale-105' : 'border-white/30 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={imgUrl} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
