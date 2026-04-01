"use client";

import type { OshiImage } from "@/types";

interface DashboardBackgroundProps {
  images: OshiImage[];
  oshiName?: string;
}

export function DashboardBackground({
  images,
  oshiName,
}: DashboardBackgroundProps) {
  if (images.length === 0) return null;

  // 全推しの画像を集めてたくさん並べる
  const displayImages = [];
  const targetCount = 20;
  for (let i = 0; i < targetCount; i++) {
    displayImages.push(images[i % images.length]);
  }

  return (
    <div className="relative w-full overflow-hidden">
      {/* 画像グリッド - 画面いっぱいに敷き詰め */}
      <div className="grid grid-cols-3 gap-0.5">
        {displayImages.slice(0, 9).map((img, i) => (
          <div
            key={`bg-${i}`}
            className="relative aspect-square overflow-hidden"
          >
            <img
              src={img.data}
              alt=""
              className="w-full h-full object-cover"
            />
            {/* 画像の上に薄い推しカラーのオーバーレイ */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.3) 100%)",
              }}
            />
          </div>
        ))}
      </div>

      {/* 下部のグラデーションフェード */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24"
        style={{
          background: "linear-gradient(transparent, var(--bg-page))",
        }}
      />

      {/* 推し名オーバーレイ */}
      {oshiName && (
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <span className="text-white/80 text-xs font-medium tracking-wider uppercase drop-shadow-lg">
            {oshiName} の推し活
          </span>
        </div>
      )}
    </div>
  );
}
