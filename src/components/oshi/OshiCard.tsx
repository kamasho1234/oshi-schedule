"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { OSHI_GENRE_LABELS } from "@/lib/constants";
import type { Oshi } from "@/types";

interface OshiCardProps {
  oshi: Oshi;
  onClick: () => void;
}

export function OshiCard({ oshi, onClick }: OshiCardProps) {
  return (
    <Card onClick={onClick} className="overflow-hidden p-0">
      {/* 画像エリア */}
      <div className="relative h-40 bg-[var(--bg-skeleton)]">
        {oshi.image ? (
          <img
            src={oshi.image}
            alt={oshi.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-4xl"
            style={{
              backgroundColor: oshi.themeColor
                ? `${oshi.themeColor}20`
                : "#f3f4f6",
            }}
          >
            <span
              style={{ color: oshi.themeColor || "var(--color-primary)" }}
            >
              {oshi.name.charAt(0)}
            </span>
          </div>
        )}
        {/* テーマカラーアクセント */}
        {oshi.themeColor && (
          <div
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{ backgroundColor: oshi.themeColor }}
          />
        )}
      </div>

      {/* 情報エリア */}
      <div className="p-3 space-y-1.5">
        <h3 className="font-bold text-heading truncate">{oshi.name}</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge color={oshi.themeColor}>
            {OSHI_GENRE_LABELS[oshi.genre]}
          </Badge>
          {oshi.oshiType === "group" && (
            <span className="text-[10px] text-sub bg-[var(--bg-skeleton)] px-1.5 py-0.5 rounded">
              グループ
            </span>
          )}
          {oshi.oshiType !== "group" && oshi.group && (
            <span className="text-xs text-sub truncate">
              {oshi.group}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
