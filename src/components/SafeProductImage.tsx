import React, { useState, useEffect } from 'react';
import { ImageOff } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function isValidClientImageUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (trimmed.includes('/images/project_') || trimmed.includes('/images/project-')) {
    return false;
  }
  if (trimmed.startsWith('/images/')) {
    return !trimmed.includes('..') && trimmed.length > '/images/'.length;
  }
  if (trimmed.startsWith('data:image/')) {
    return /^data:image\/(png|jpeg|jpg|webp|gif|svg\+xml);base64,[A-Za-z0-9+/=]+$/i.test(trimmed);
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export function withImageCacheBust(url: string, updatedAt?: string): string {
  const trimmed = url.trim();
  if (!updatedAt || !trimmed || trimmed.startsWith('data:image/')) {
    return trimmed;
  }
  const sep = trimmed.includes('?') ? '&' : '?';
  return `${trimmed}${sep}v=${encodeURIComponent(updatedAt)}`;
}

interface SafeProductImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  containerClassName?: string;
  updatedAt?: string;
  compact?: boolean;
  allowProjectImages?: boolean;
}

export const SafeProductImage: React.FC<SafeProductImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  containerClassName = '',
  updatedAt,
  compact = false,
  allowProjectImages = false
}) => {
  const { t } = useLanguage();
  const trimmed = typeof src === 'string' ? src.trim() : '';
  const urlAllowed = allowProjectImages
    ? Boolean(trimmed)
    : isValidClientImageUrl(trimmed);

  const [hasError, setHasError] = useState(!urlAllowed);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setHasError(!urlAllowed);
    setLoaded(false);
  }, [trimmed, updatedAt, urlAllowed]);

  if (!urlAllowed || hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 text-center select-none ${containerClassName || className}`}
        title={t.imageUnavailable}
        role="img"
        aria-label={`${alt} - ${t.imageUnavailable}`}
      >
        <ImageOff className={compact ? 'w-4 h-4 shrink-0' : 'w-6 h-6 mb-1 shrink-0'} />
        {!compact && (
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-2 leading-tight">
            {t.imageUnavailable}
          </span>
        )}
      </div>
    );
  }

  const finalSrc = withImageCacheBust(trimmed, updatedAt);

  return (
    <div className={`relative overflow-hidden bg-slate-100 dark:bg-slate-800/60 ${containerClassName || className}`}>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-slate-200/70 dark:bg-slate-700/50" />
      )}
      <img
        src={finalSrc}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setHasError(true)}
        className={`${className} transition-opacity duration-200 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
};
