'use client';

import React, { useState } from 'react';
import { Shirt } from 'lucide-react';

interface ProductImageProps {
  src?: string;
  alt: string;
  brand?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ProductImage({
  src,
  alt,
  brand,
  size = 'sm',
  className = '',
}: ProductImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const cleanSrc = src?.trim() ?? '';
  const showFallback = !cleanSrc || failedSrc === cleanSrc;

  const iconSize = size === 'lg' ? 32 : size === 'md' ? 22 : 16;

  if (showFallback) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center bg-[#F1F3F5] text-neutral-400 border border-neutral-200/80 select-none overflow-hidden ${className}`}
        aria-label={alt}
      >
        <Shirt size={iconSize} strokeWidth={1.6} className="text-neutral-400" />
        {size !== 'sm' && (
          <span className="mt-1.5 text-[11px] font-medium text-neutral-500 px-2 truncate max-w-full">
            {brand?.trim() || 'Sin imagen'}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative bg-[#F1F3F5] overflow-hidden border border-neutral-200/80 ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={cleanSrc}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setFailedSrc(cleanSrc)}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
