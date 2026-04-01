"use client";

import type { Goods } from "@/types";

interface GoodsCardProps {
  goods: Goods;
  onClick?: () => void;
}

export function GoodsCard({ goods, onClick }: GoodsCardProps) {
  return (
    <button
      onClick={onClick}
      className="overflow-hidden text-left transition-transform active:scale-[0.98] rounded-xl border border-card bg-card"
    >
      {goods.image ? (
        <img
          src={goods.image}
          alt={goods.name}
          className="w-full h-28 object-cover"
        />
      ) : (
        <div className="w-full h-28 bg-black/10 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-white/30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
      )}

      <div className="p-2" style={{ background: "var(--bg-card)" }}>
        <h3 className="text-xs font-bold text-heading truncate">
          {goods.name}
        </h3>
      </div>
    </button>
  );
}
