"use client";

import { useState, useEffect, useRef, useCallback, use } from "react";
import { Header } from "@/components/layout/Header";
import { PhotoWall } from "@/components/oshi/PhotoWall";
import { PhotoLightbox } from "@/components/oshi/PhotoLightbox";
import { useOshi } from "@/hooks/useOshi";
import { compressImage } from "@/lib/image";
import { generateId, getNow } from "@/lib/utils";
import type { Oshi, OshiImage } from "@/types";
import Link from "next/link";

export default function PhotoWallPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { getById, edit } = useOshi();
  const [oshi, setOshi] = useState<Oshi | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const data = await getById(id);
      setOshi(data);
      setLoading(false);
    })();
  }, [id, getById]);

  // Combine main image + gallery images
  const allImages: OshiImage[] = [];
  if (oshi) {
    if (oshi.image) {
      allImages.push({
        id: "main",
        data: oshi.image,
        createdAt: oshi.createdAt,
      });
    }
    if (oshi.images) {
      oshi.images.forEach((img) => {
        if (img.data !== oshi.image) allImages.push(img);
      });
    }
  }

  const saveImages = useCallback(async (mainImage: string | undefined, galleryImages: OshiImage[]) => {
    if (!oshi) return;
    const updated: Oshi = {
      ...oshi,
      image: mainImage,
      images: galleryImages,
      updatedAt: getNow(),
    };
    await edit(updated);
    setOshi(updated);
  }, [oshi, edit]);

  const handleAddPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !oshi) return;
    const files = Array.from(e.target.files);
    const newImages: OshiImage[] = [];

    for (const file of files) {
      const data = await compressImage(file);
      newImages.push({
        id: generateId(),
        data,
        createdAt: getNow(),
      });
    }

    const currentGallery = oshi.images || [];
    await saveImages(oshi.image, [...currentGallery, ...newImages]);
    e.target.value = "";
  };

  const handleDelete = async (imageId: string) => {
    if (!oshi) return;
    if (imageId === "main") {
      await saveImages(undefined, oshi.images || []);
    } else {
      const filtered = (oshi.images || []).filter((img) => img.id !== imageId);
      await saveImages(oshi.image, filtered);
    }
  };

  const handleReorder = async (fromIdx: number, toIdx: number) => {
    if (!oshi || fromIdx === toIdx) return;

    const items = [...allImages];
    const [moved] = items.splice(fromIdx, 1);
    items.splice(toIdx, 0, moved);

    // First item becomes main image, rest go to gallery
    const newMain = items[0]?.data;
    const newGallery: OshiImage[] = items.slice(1).map((img) => ({
      id: img.id === "main" ? generateId() : img.id,
      data: img.data,
      caption: img.caption,
      createdAt: img.createdAt,
    }));

    await saveImages(newMain, newGallery);
  };

  const handleSelect = (image: OshiImage) => {
    if (isEditing) return;
    const idx = allImages.findIndex((img) => img.id === image.id);
    if (idx >= 0) setLightboxIndex(idx);
  };

  const handleDragStart = (idx: number) => {
    setDragIndex(idx);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverIndex(idx);
  };

  const handleDrop = async (idx: number) => {
    if (dragIndex !== null && dragIndex !== idx) {
      await handleReorder(dragIndex, idx);
    }
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleMoveUp = async (idx: number) => {
    if (idx > 0) await handleReorder(idx, idx - 1);
  };

  const handleMoveDown = async (idx: number) => {
    if (idx < allImages.length - 1) await handleReorder(idx, idx + 1);
  };

  if (loading) {
    return (
      <>
        <Header title="フォトウォール" showBack />
        <div className="min-h-screen" style={{ background: "var(--pw-bg, #030712)" }}>
          <div className="max-w-lg mx-auto px-4 pt-4 pb-24">
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="フォトウォール" showBack />
      <div className="min-h-screen" style={{ background: "var(--pw-bg, #030712)" }}>
        <div className="max-w-lg mx-auto px-3 pt-4 pb-24">
          {/* Title + actions */}
          <div className="flex items-center justify-between mb-3 px-1">
            <p className="text-sm font-bold" style={{ color: "var(--pw-title, #ffffff)" }}>
              {oshi?.name} のフォトウォール
            </p>
            <div className="flex items-center gap-2">
              {allImages.length > 0 && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                  style={{
                    backgroundColor: isEditing ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.1)",
                    color: isEditing ? "#fca5a5" : "rgba(255,255,255,0.6)",
                  }}
                >
                  {isEditing ? "完了" : "編集"}
                </button>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all"
                style={{
                  backgroundColor: oshi?.themeColor ? `${oshi.themeColor}44` : "rgba(255,255,255,0.15)",
                  color: "#ffffff",
                }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                追加
              </button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleAddPhotos}
            className="hidden"
          />

          {/* All oshi photos link */}
          <Link
            href="/photos"
            className="flex items-center justify-center gap-1.5 mb-4 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{
              backgroundColor: "var(--pw-tab-inactive-bg, rgba(255,255,255,0.1))",
              color: "var(--pw-tab-inactive-text, rgba(255,255,255,0.6))",
            }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            全推しのフォトウォールを見る
          </Link>

          {allImages.length === 0 ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-16 rounded-2xl border-2 border-dashed transition-colors"
              style={{
                borderColor: "rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              <svg
                className="w-12 h-12 mx-auto mb-3 opacity-40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm font-medium">タップして画像を追加</p>
            </button>
          ) : isEditing ? (
            /* Edit mode - list with reorder/delete */
            <div className="space-y-2">
              {allImages.map((image, idx) => (
                <div
                  key={image.id}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDrop={() => handleDrop(idx)}
                  onDragEnd={() => { setDragIndex(null); setDragOverIndex(null); }}
                  className={`flex items-center gap-3 p-2 rounded-xl transition-all ${
                    dragOverIndex === idx ? "ring-2 ring-white/40" : ""
                  } ${dragIndex === idx ? "opacity-50" : ""}`}
                  style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                >
                  {/* Drag handle */}
                  <div className="flex flex-col gap-0.5 px-1 cursor-grab active:cursor-grabbing text-white/30">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="9" cy="6" r="1.5" /><circle cx="15" cy="6" r="1.5" />
                      <circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" />
                      <circle cx="9" cy="18" r="1.5" /><circle cx="15" cy="18" r="1.5" />
                    </svg>
                  </div>

                  {/* Thumbnail */}
                  <img
                    src={image.data}
                    alt=""
                    className="w-14 h-14 rounded-lg object-cover shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/70">
                      {idx === 0 ? "メイン画像" : `画像 ${idx + 1}`}
                    </p>
                  </div>

                  {/* Move buttons */}
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => handleMoveUp(idx)}
                      disabled={idx === 0}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white/50 hover:text-white disabled:opacity-20 transition-colors"
                      style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleMoveDown(idx)}
                      disabled={idx === allImages.length - 1}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white/50 hover:text-white disabled:opacity-20 transition-colors"
                      style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-400/20 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <PhotoWall images={allImages} onSelect={handleSelect} />
          )}
        </div>
      </div>

      {lightboxIndex !== null && (
        <PhotoLightbox
          images={allImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
