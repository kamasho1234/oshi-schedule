"use client";

import { useState, useEffect, useCallback } from "react";
import type { OshiImage } from "@/types";

interface OshiHeaderGalleryProps {
  images: OshiImage[];
  mainImage?: string;
  themeColor?: string;
  name: string;
}

export function OshiHeaderGallery({
  images,
  mainImage,
  themeColor,
  name,
}: OshiHeaderGalleryProps) {
  // Build the full gallery: mainImage first, then gallery images
  const allImages: string[] = [];
  if (mainImage) allImages.push(mainImage);
  images.forEach((img) => {
    if (img.data !== mainImage) allImages.push(img.data);
  });

  const [current, setCurrent] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      setCurrent(((index % allImages.length) + allImages.length) % allImages.length);
    },
    [allImages.length]
  );

  // Auto-slide for 2+ images
  useEffect(() => {
    if (allImages.length < 2) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % allImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [allImages.length]);

  // 0 images: placeholder
  if (allImages.length === 0) {
    const color = themeColor || "#ec4899";
    return (
      <div
        className="-mx-4 -mt-4 h-48 flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${color}, ${color}80)`,
        }}
      >
        <svg
          className="w-16 h-16 text-white/60"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>
    );
  }

  // 1 image: single display
  if (allImages.length === 1) {
    return (
      <div className="relative -mx-4 -mt-4">
        <img
          src={allImages[0]}
          alt={name}
          className="w-full h-64 object-cover"
        />
        {themeColor && (
          <div
            className="absolute bottom-0 left-0 right-0 h-1.5"
            style={{ backgroundColor: themeColor }}
          />
        )}
      </div>
    );
  }

  // 2+ images: slideshow
  return (
    <div className="relative -mx-4 -mt-4">
      <img
        src={allImages[current]}
        alt={`${name} ${current + 1}`}
        className="w-full h-64 object-cover transition-opacity duration-500"
      />
      {themeColor && (
        <div
          className="absolute bottom-0 left-0 right-0 h-1.5"
          style={{ backgroundColor: themeColor }}
        />
      )}
      {/* Dot indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
        {allImages.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === current
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`画像 ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
