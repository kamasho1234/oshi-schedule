"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { PhotoWall } from "@/components/oshi/PhotoWall";
import { PhotoLightbox } from "@/components/oshi/PhotoLightbox";
import { useOshi } from "@/hooks/useOshi";
import type { OshiImage } from "@/types";

interface TaggedImage extends OshiImage {
  oshiName: string;
  oshiGroup: string;
  themeColor?: string;
}

export default function AllPhotosPage() {
  const { items: oshiList, loading } = useOshi();
  const [activeTab, setActiveTab] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Build tab data from oshi groups
  const tabs = useMemo(() => {
    const groupMap = new Map<string, { name: string; color?: string }>();
    for (const oshi of oshiList) {
      const groupName = oshi.group || oshi.name;
      if (!groupMap.has(groupName)) {
        groupMap.set(groupName, { name: groupName, color: oshi.themeColor });
      }
    }
    return Array.from(groupMap.values());
  }, [oshiList]);

  // Build all images tagged with oshi info
  const allTaggedImages = useMemo(() => {
    const result: TaggedImage[] = [];
    for (const oshi of oshiList) {
      const groupName = oshi.group || oshi.name;
      if (oshi.image) {
        result.push({
          id: `${oshi.id}-main`,
          data: oshi.image,
          createdAt: oshi.createdAt,
          oshiName: oshi.name,
          oshiGroup: groupName,
          themeColor: oshi.themeColor,
        });
      }
      if (oshi.images) {
        for (const img of oshi.images) {
          if (img.data !== oshi.image) {
            result.push({
              ...img,
              id: `${oshi.id}-${img.id}`,
              oshiName: oshi.name,
              oshiGroup: groupName,
              themeColor: oshi.themeColor,
            });
          }
        }
      }
    }
    return result;
  }, [oshiList]);

  // Filter by active tab
  const filteredImages = useMemo(() => {
    if (activeTab === 0) return allTaggedImages;
    const tab = tabs[activeTab - 1];
    if (!tab) return allTaggedImages;
    return allTaggedImages.filter((img) => img.oshiGroup === tab.name);
  }, [activeTab, tabs, allTaggedImages]);

  const handleSelect = (image: OshiImage) => {
    const idx = filteredImages.findIndex((img) => img.id === image.id);
    if (idx >= 0) setLightboxIndex(idx);
  };

  return (
    <>
      <Header title="フォトウォール" showBack />
      <div className="min-h-screen" style={{ background: "var(--pw-bg, #030712)" }}>
        <div className="max-w-lg mx-auto px-3 pt-4 pb-28">
          {/* Title */}
          <p className="text-sm font-bold mb-3 px-1" style={{ color: "var(--pw-title, #ffffff)" }}>
            フォトウォール
          </p>

          {/* Oshi group tabs */}
          <div className="flex gap-1.5 px-1 mb-4 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            <button
              onClick={() => setActiveTab(0)}
              className="px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0"
              style={{
                backgroundColor: activeTab === 0
                  ? "var(--color-primary, #ec4899)"
                  : "var(--pw-tab-inactive-bg, rgba(255,255,255,0.1))",
                color: activeTab === 0
                  ? "#fff"
                  : "var(--pw-tab-inactive-text, rgba(255,255,255,0.6))",
              }}
            >
              ALL
            </button>
            {tabs.map((tab, i) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(i + 1)}
                className="px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0"
                style={{
                  backgroundColor: activeTab === i + 1
                    ? (tab.color || "var(--color-primary, #ec4899)")
                    : "var(--pw-tab-inactive-bg, rgba(255,255,255,0.1))",
                  color: activeTab === i + 1
                    ? "#fff"
                    : "var(--pw-tab-inactive-text, rgba(255,255,255,0.6))",
                }}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          )}

          {/* Empty state */}
          {!loading && filteredImages.length === 0 && (
            <div className="text-center py-16">
              <svg
                className="w-16 h-16 mx-auto mb-4"
                style={{ color: "var(--pw-tab-inactive-text, rgba(255,255,255,0.3))" }}
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
              <p className="text-sm" style={{ color: "var(--pw-tab-inactive-text, rgba(255,255,255,0.5))" }}>
                推しの詳細ページから画像をアップロードしよう
              </p>
            </div>
          )}

          {/* Photo grid */}
          {!loading && filteredImages.length > 0 && (
            <PhotoWall images={filteredImages} onSelect={handleSelect} />
          )}
        </div>
      </div>

      {lightboxIndex !== null && (
        <PhotoLightbox
          images={filteredImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
