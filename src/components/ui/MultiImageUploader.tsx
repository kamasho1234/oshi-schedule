"use client";

import { useRef } from "react";
import { compressImage } from "@/lib/image";
import { generateId, getNow } from "@/lib/utils";
import type { OshiImage } from "@/types";

interface MultiImageUploaderProps {
  images: OshiImage[];
  onChange: (images: OshiImage[]) => void;
  maxImages?: number;
}

export function MultiImageUploader({
  images,
  onChange,
  maxImages = 10,
}: MultiImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remaining = maxImages - images.length;
    const filesToProcess = Array.from(files).slice(0, remaining);

    const newImages: OshiImage[] = [];
    for (const file of filesToProcess) {
      const data = await compressImage(file);
      newImages.push({
        id: generateId(),
        data,
        createdAt: getNow(),
      });
    }

    onChange([...images, ...newImages]);
    // reset input so same file can be re-selected
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemove = (id: string) => {
    onChange(images.filter((img) => img.id !== id));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-dim">
          {images.length}/{maxImages}枚
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {images.map((img) => (
          <div key={img.id} className="relative group">
            <img
              src={img.data}
              alt=""
              className="w-full h-28 object-cover radius-card"
            />
            <button
              type="button"
              onClick={() => handleRemove(img.id)}
              className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="削除"
            >
              &times;
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="h-28 border-2 border-dashed border-input radius-card flex flex-col items-center justify-center text-dim hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
          >
            <svg
              className="w-6 h-6 mb-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="text-xs">追加</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        className="hidden"
      />
    </div>
  );
}
