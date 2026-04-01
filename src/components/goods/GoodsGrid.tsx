"use client";

import { useState, useMemo } from "react";
import { GoodsCard } from "@/components/goods/GoodsCard";
import type { Goods, Oshi } from "@/types";

interface GoodsGridProps {
  goodsList: Goods[];
  oshiList: Oshi[];
  onClickGoods: (goods: Goods) => void;
}

export function GoodsGrid({
  goodsList,
  oshiList,
  onClickGoods,
}: GoodsGridProps) {
  const [filterOshiId, setFilterOshiId] = useState("");

  const filtered = useMemo(() => {
    if (!filterOshiId) return goodsList;
    return goodsList.filter((g) => g.oshiId === filterOshiId);
  }, [goodsList, filterOshiId]);

  return (
    <div className="space-y-3">
      {/* 推しタブ - LPモック準拠 */}
      <div className="flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        <button
          onClick={() => setFilterOshiId("")}
          className="shrink-0 px-3 py-1 rounded-full text-xs font-bold transition-all"
          style={{
            backgroundColor: filterOshiId === "" ? "var(--color-primary)" : "var(--header-accent-bg, rgba(255,255,255,0.15))",
            color: filterOshiId === "" ? "#fff" : "var(--nav-text-inactive, rgba(255,255,255,0.6))",
          }}
        >
          ALL
        </button>
        {oshiList.map((oshi) => {
          const isActive = filterOshiId === oshi.id;
          const color = oshi.themeColor || "var(--color-primary)";
          return (
            <button
              key={oshi.id}
              onClick={() => setFilterOshiId(oshi.id)}
              className="shrink-0 px-3 py-1 rounded-full text-xs font-bold transition-all"
              style={{
                backgroundColor: isActive ? color : "var(--header-accent-bg, rgba(255,255,255,0.15))",
                color: isActive ? "#fff" : "var(--nav-text-inactive, rgba(255,255,255,0.6))",
              }}
            >
              {oshi.name}
            </button>
          );
        })}
      </div>

      {/* グリッド */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {filtered.map((goods) => (
            <GoodsCard
              key={goods.id}
              goods={goods}
              onClick={() => onClickGoods(goods)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-white/50 text-sm">
            {goodsList.length > 0
              ? "条件に一致するグッズがありません"
              : "グッズを登録しよう！"}
          </p>
        </div>
      )}
    </div>
  );
}
