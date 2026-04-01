"use client";

import { useState, useEffect, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { GoodsForm } from "@/components/goods/GoodsForm";
import { useGoods } from "@/hooks/useGoods";
import { useOshi } from "@/hooks/useOshi";
import { GOODS_CATEGORY_LABELS } from "@/lib/constants";
import { formatDate, formatYen } from "@/lib/utils";
import type { Goods } from "@/types";

export default function GoodsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { getById, edit, remove } = useGoods();
  const { items: oshiList } = useOshi();
  const [goods, setGoods] = useState<Goods | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);

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

  useEffect(() => {
    (async () => {
      const data = await getById(id);
      setGoods(data);
      setLoading(false);
    })();
  }, [id, getById]);

  const handleSave = async (updated: Goods) => {
    await edit(updated);
    setGoods(updated);
    setIsEditOpen(false);
  };

  const handleDelete = async () => {
    await remove(id);
    router.push("/goods");
  };

  const oshiName = goods?.oshiId
    ? oshiList.find((o) => o.id === goods.oshiId)?.name
    : undefined;

  if (loading) {
    return (
      <div className="h-[100dvh] relative flex flex-col overflow-hidden pb-20">
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "linear-gradient(180deg, var(--color-primary-light, #fce7f3) 0%, var(--bg-page, #fff) 100%)",
          }}
        />
        <div className="relative z-10 flex flex-col h-full">
          <header
            className="shrink-0 backdrop-blur-md border-b border-white/20"
            style={{
              background:
                "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark, #be185d))",
              opacity: 0.92,
            }}
          >
            <div className="max-w-lg mx-auto flex items-center h-10 px-4">
              <button
                onClick={() => router.push("/goods")}
                className="text-white/80 hover:text-white mr-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <h1 className="text-lg font-bold text-white flex-1">読み込み中...</h1>
            </div>
          </header>
          <div className="flex-1 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (!goods) {
    return (
      <div className="h-[100dvh] relative flex flex-col overflow-hidden pb-20">
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "linear-gradient(180deg, var(--color-primary-light, #fce7f3) 0%, var(--bg-page, #fff) 100%)",
          }}
        />
        <div className="relative z-10 flex flex-col h-full">
          <header
            className="shrink-0 backdrop-blur-md border-b border-white/20"
            style={{
              background:
                "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark, #be185d))",
              opacity: 0.92,
            }}
          >
            <div className="max-w-lg mx-auto flex items-center h-10 px-4">
              <button
                onClick={() => router.push("/goods")}
                className="text-white/80 hover:text-white mr-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <h1 className="text-lg font-bold text-white flex-1">グッズ</h1>
            </div>
          </header>
          <div className="flex-1 flex items-center justify-center" >
            <div className="text-center space-y-4">
              <p className="text-white/80 font-medium">グッズが見つかりません</p>
              <Button onClick={() => router.push("/goods")}>一覧に戻る</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        {/* Semi-transparent gradient header */}
        <header
          className="shrink-0 backdrop-blur-md border-b border-white/20"
          style={{
            background:
              "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark, #be185d))",
            opacity: 0.92,
          }}
        >
          <div className="max-w-lg mx-auto flex items-center h-10 px-4">
            <button
              onClick={() => router.push("/goods")}
              className="text-white/80 hover:text-white mr-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <h1 className="text-lg font-bold text-white flex-1 truncate">
              {goods.name}
            </h1>
            <Button
              size="sm"
              onClick={() => setIsEditOpen(true)}
              className="!bg-white/20 !text-white !border-white/30 hover:!bg-white/30"
            >
              編集
            </Button>
          </div>
        </header>

        {/* Scrollable content area */}
        <div
          className="flex-1 overflow-y-auto"
          
        >
          <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
            {/* Image */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg overflow-hidden">
              {goods.image ? (
                <img
                  src={goods.image}
                  alt={goods.name}
                  className="w-full h-64 object-cover"
                />
              ) : (
                <div className="h-48 bg-white/40 flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-gray-400"
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
            </div>

            {/* Basic info card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg p-4 space-y-4">
              <h2 className="text-2xl font-bold text-heading">{goods.name}</h2>

              <div className="flex flex-wrap gap-2">
                <Badge>{GOODS_CATEGORY_LABELS[goods.category]}</Badge>
                {oshiName && <Badge color="#8b5cf6">{oshiName}</Badge>}
              </div>
            </div>

            {/* Detail info card */}
            {((goods.price != null && goods.price !== undefined) || goods.purchaseDate || oshiName) && (
              <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg p-4 space-y-3">
                {goods.price != null && goods.price !== undefined && (
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-sub w-16">価格</span>
                    <span className="text-heading font-medium">
                      {formatYen(goods.price)}
                    </span>
                  </div>
                )}
                {goods.purchaseDate && (
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-sub w-16">購入日</span>
                    <span className="text-heading">
                      {formatDate(goods.purchaseDate)}
                    </span>
                  </div>
                )}
                {oshiName && (
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-sub w-16">推し</span>
                    <span className="text-heading">{oshiName}</span>
                  </div>
                )}
              </div>
            )}

            {/* Memo card */}
            {goods.memo && (
              <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg p-4 space-y-2">
                <h3 className="text-sm font-medium text-sub">メモ</h3>
                <p className="text-body text-sm whitespace-pre-wrap">
                  {goods.memo}
                </p>
              </div>
            )}

            {/* Delete button */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg p-4">
              {isDeleteConfirm ? (
                <div className="space-y-3">
                  <p className="text-sm text-red-600 text-center">
                    「{goods.name}」を削除しますか？この操作は取り消せません。
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      onClick={() => setIsDeleteConfirm(false)}
                      className="flex-1"
                    >
                      キャンセル
                    </Button>
                    <Button
                      variant="danger"
                      onClick={handleDelete}
                      className="flex-1"
                    >
                      削除する
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => setIsDeleteConfirm(true)}
                  className="w-full text-red-400 hover:text-red-500 hover:bg-red-50"
                >
                  このグッズを削除
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="グッズを編集"
      >
        <GoodsForm
          initial={goods}
          oshiList={oshiList}
          onSave={handleSave}
          onCancel={() => setIsEditOpen(false)}
        />
      </Modal>
    </div>
  );
}
