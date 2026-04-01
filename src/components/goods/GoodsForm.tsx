"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { GOODS_CATEGORY_LABELS } from "@/lib/constants";
import { generateId, getNow } from "@/lib/utils";
import type { Goods, GoodsCategory, Oshi } from "@/types";

interface GoodsFormProps {
  initial?: Goods;
  oshiList: Oshi[];
  onSave: (goods: Goods) => void;
  onCancel: () => void;
}

const categoryOptions = Object.entries(GOODS_CATEGORY_LABELS).map(
  ([value, label]) => ({ value, label })
);

export function GoodsForm({
  initial,
  oshiList,
  onSave,
  onCancel,
}: GoodsFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [image, setImage] = useState<string | undefined>(initial?.image);
  const [category, setCategory] = useState<GoodsCategory>(
    initial?.category ?? "other"
  );
  const [price, setPrice] = useState(initial?.price?.toString() ?? "");
  const [purchaseDate, setPurchaseDate] = useState(
    initial?.purchaseDate ?? ""
  );
  const [oshiId, setOshiId] = useState(initial?.oshiId ?? "");
  const [memo, setMemo] = useState(initial?.memo ?? "");

  const oshiOptions = [
    { value: "", label: "選択なし" },
    ...oshiList.map((o) => ({ value: o.id, label: o.name })),
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const now = getNow();
    const goods: Goods = {
      id: initial?.id ?? generateId(),
      name: name.trim(),
      image,
      category,
      price: price ? Number(price) : undefined,
      purchaseDate: purchaseDate || undefined,
      oshiId: oshiId || undefined,
      memo: memo.trim(),
      createdAt: initial?.createdAt ?? now,
      updatedAt: now,
    };
    onSave(goods);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 画像 */}
      <ImageUploader value={image} onChange={setImage} />

      {/* 名前 */}
      <Input
        label="グッズ名 *"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="グッズの名前"
        required
      />

      {/* カテゴリ */}
      <Select
        label="カテゴリ"
        options={categoryOptions}
        value={category}
        onChange={(e) => setCategory(e.target.value as GoodsCategory)}
      />

      {/* 価格 */}
      <Input
        label="価格"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="0"
        min={0}
      />

      {/* 購入日 */}
      <Input
        label="購入日"
        type="date"
        value={purchaseDate}
        onChange={(e) => setPurchaseDate(e.target.value)}
      />

      {/* 推し選択 */}
      <Select
        label="推し"
        options={oshiOptions}
        value={oshiId}
        onChange={(e) => setOshiId(e.target.value)}
      />

      {/* メモ */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-sub">メモ</label>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="自由メモ"
          rows={3}
          className="w-full rounded-xl border border-input bg-[var(--bg-input)] px-4 py-2.5 text-body placeholder-[var(--text-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] focus:outline-none transition-colors resize-none"
        />
      </div>

      {/* ボタン */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="flex-1"
        >
          キャンセル
        </Button>
        <Button type="submit" className="flex-1">
          {initial ? "更新する" : "登録する"}
        </Button>
      </div>
    </form>
  );
}
