"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { OshiForm } from "@/components/oshi/OshiForm";
import { useOshi } from "@/hooks/useOshi";
import type { Oshi } from "@/types";

export default function OshiListPage() {
  const router = useRouter();
  const { items: oshiList, loading, add } = useOshi();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const allImages = useMemo(() => {
    const imgs: string[] = [];
    for (const oshi of oshiList) {
      if (oshi.image) imgs.push(oshi.image);
      if (oshi.images) {
        for (const img of oshi.images) imgs.push(img.data);
      }
    }
    return imgs;
  }, [oshiList]);

  const handleSave = async (oshi: Oshi) => {
    await add(oshi);
    setIsModalOpen(false);
  };

  return (
    <div className="h-[100dvh] relative flex flex-col overflow-hidden pb-20">
      {allImages.length > 0 && (
        <div className="fixed inset-0 opacity-80 z-0 overflow-hidden">
          <div className="grid grid-cols-3 gap-0" style={{ minHeight: "200vh" }}>
            {(() => {
              const tiles: string[] = [];
              while (tiles.length < 60) tiles.push(...allImages);
              return tiles.slice(0, 60).map((src, i) => (
                <img key={i} src={src} alt="" className="w-full block" draggable={false} />
              ));
            })()}
          </div>
        </div>
      )}
      {allImages.length === 0 && (
        <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(180deg, var(--color-primary-light, #fce7f3) 0%, var(--bg-page, #fff) 100%)" }} />
      )}
      <div className="fixed inset-0 z-[1]" style={{ background: "rgba(0,0,0,0.15)", pointerEvents: "none" }} />

      <div className="relative z-10 flex flex-col h-full">
        <header className="shrink-0 backdrop-blur-md border-b border-white/20" style={{ background: "var(--bg-header)" }}>
          <div className="max-w-lg mx-auto flex items-center h-10 px-4">
            <div className="flex-1" />
            <h1 className="text-lg font-bold text-center" style={{ color: "var(--header-text)" }}>推し</h1>
            <div className="flex-1 flex justify-end">
              <button onClick={() => setIsModalOpen(true)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--header-accent-bg)" }}>
                <svg className="w-5 h-5" style={{ color: "var(--header-text)" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-lg mx-auto px-4 py-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            ) : oshiList.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <p className="text-white/80 text-lg">推しを登録しよう！</p>
                <Button onClick={() => setIsModalOpen(true)}>推しを追加する</Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {oshiList.map((oshi) => (
                  <button
                    key={oshi.id}
                    onClick={() => router.push(`/oshi/${oshi.id}`)}
                    className="relative overflow-hidden rounded-2xl shadow-sm text-left transition-transform active:scale-[0.98]"
                    style={{ background: "rgba(255,255,255,0.1)" }}
                  >
                    <div className="relative h-40 bg-[var(--bg-skeleton)]">
                      {oshi.image ? (
                        <img src={oshi.image} alt={oshi.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl" style={{ backgroundColor: oshi.themeColor ? `${oshi.themeColor}20` : "#f3f4f6" }}>
                          <span style={{ color: oshi.themeColor || "var(--color-primary)" }}>{oshi.name.charAt(0)}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 px-3 pb-2.5">
                        <h3 className="font-bold text-white text-sm truncate">{oshi.name}</h3>
                        {oshi.group && <p className="text-xs text-white/70 truncate">{oshi.group}</p>}
                      </div>
                    </div>
                    {oshi.themeColor && <div className="h-1 w-full" style={{ backgroundColor: oshi.themeColor }} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="推しを追加">
        <OshiForm onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
