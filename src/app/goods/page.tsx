"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { GoodsGrid } from "@/components/goods/GoodsGrid";
import { GoodsForm } from "@/components/goods/GoodsForm";
import { useGoods } from "@/hooks/useGoods";
import { useOshi } from "@/hooks/useOshi";
import { AuthButton } from "@/components/layout/AuthButton";
import type { Goods } from "@/types";

export default function GoodsPage() {
  const router = useRouter();
  const { items: goodsList, loading, add } = useGoods();
  const { items: oshiList } = useOshi();
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Collect all oshi images for photo wall background
  const allImages = useMemo(() => {
    const imgs: string[] = [];
    for (const oshi of oshiList) {
      if (oshi.image) imgs.push(oshi.image);
      if (oshi.images) {
        for (const img of oshi.images) {
          imgs.push(img.data);
        }
      }
    }
    return imgs;
  }, [oshiList]);

  const handleSave = async (goods: Goods) => {
    await add(goods);
    setIsAddOpen(false);
  };

  const handleClickGoods = (goods: Goods) => {
    router.push(`/goods/${goods.id}`);
  };

  return (
    <div className="h-[100dvh] relative flex flex-col overflow-hidden pb-20">
      {/* Photo wall background */}
      {allImages.length > 0 && (
        <div className="fixed inset-0 opacity-80 z-0 overflow-hidden"><div className="grid grid-cols-3 gap-0" style={{ minHeight: "200vh" }}>
          {allImages.concat(allImages).concat(allImages).concat(allImages).concat(allImages).concat(allImages).slice(0, 60).map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="w-full block"
              style={{ objectFit: "cover" }}
              draggable={false}
            />
          ))}
          </div>
        </div>
      )}

      {/* Fallback bg when no images */}
      {allImages.length === 0 && (
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "linear-gradient(180deg, var(--color-primary-light, #fce7f3) 0%, var(--bg-page, #fff) 100%)",
          }}
        />
      )}

      {/* Fixed overlay */}
      <div className="fixed inset-0 z-[1]" style={{ background: "rgba(0,0,0,0.15)", pointerEvents: "none" }} />

      {/* Content layer */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <header className="shrink-0 backdrop-blur-md border-b border-white/20" style={{ background: "var(--bg-header)" }}>
          <div className="max-w-lg mx-auto flex items-center h-10 px-4">
            <div className="flex-1 flex justify-start">
              <AuthButton compact />
            </div>
            <h1 className="text-lg font-bold text-center" style={{ color: "var(--header-text)" }}>グッズコレクション</h1>
            <div className="flex-1 flex justify-end">
              <button onClick={() => setIsAddOpen(true)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--header-accent-bg)" }}>
                <svg className="w-5 h-5" style={{ color: "var(--header-text)" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable content area */}
        <div
          className="flex-1 overflow-y-auto"
          
        >
          <div className="max-w-lg mx-auto px-4 py-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            ) : goodsList.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="text-5xl">🎁</div>
                <p className="text-white/80 font-medium">グッズを登録しよう！</p>
                <Button onClick={() => setIsAddOpen(true)}>グッズを追加</Button>
              </div>
            ) : (
              <GoodsGrid
                goodsList={goodsList}
                oshiList={oshiList}
                onClickGoods={handleClickGoods}
              />
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="グッズを追加"
      >
        <GoodsForm
          oshiList={oshiList}
          onSave={handleSave}
          onCancel={() => setIsAddOpen(false)}
        />
      </Modal>
    </div>
  );
}
