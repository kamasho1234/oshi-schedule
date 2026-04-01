"use client";

import type { OshiImage } from "@/types";

interface PhotoWallProps {
  images: OshiImage[];
  onSelect: (image: OshiImage) => void;
}

export function PhotoWall({ images, onSelect }: PhotoWallProps) {
  return (
    <div className="columns-2 gap-1.5">
      {images.map((image) => (
        <button
          key={image.id}
          type="button"
          onClick={() => onSelect(image)}
          className="w-full mb-1.5 break-inside-avoid block"
        >
          <img
            src={image.data}
            alt={image.caption || ""}
            className="w-full rounded-lg object-cover"
          />
        </button>
      ))}
    </div>
  );
}
