"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ImageUploader } from "@/components/ui/ImageUploader";
import {
  OSHI_GENRE_LABELS,
  OSHI_TYPE_LABELS,
  SNS_PLATFORM_LABELS,
  THEME_PRESETS,
} from "@/lib/constants";
import { MultiImageUploader } from "@/components/ui/MultiImageUploader";
import { generateId, getNow } from "@/lib/utils";
import type { Oshi, OshiType, OshiGenre, OshiImage, SnsLink, SnsPlatform } from "@/types";

interface OshiFormProps {
  initial?: Oshi;
  onSave: (oshi: Oshi) => void;
  onCancel: () => void;
}

const genreOptions = Object.entries(OSHI_GENRE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const snsOptions = Object.entries(SNS_PLATFORM_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export function OshiForm({ initial, onSave, onCancel }: OshiFormProps) {
  const [oshiType, setOshiType] = useState<OshiType>(initial?.oshiType ?? "individual");
  const [name, setName] = useState(initial?.name ?? "");
  const [image, setImage] = useState<string | undefined>(initial?.image);
  const [birthday, setBirthday] = useState(initial?.birthday ?? "");
  const [showBirthday, setShowBirthday] = useState(initial?.showBirthday !== false);
  const [genre, setGenre] = useState<OshiGenre>(initial?.genre ?? "idol");
  const [group, setGroup] = useState(initial?.group ?? "");
  const [members, setMembers] = useState(initial?.members ?? "");
  const [themeColor, setThemeColor] = useState(initial?.themeColor ?? "");
  const [memo, setMemo] = useState(initial?.memo ?? "");
  const [images, setImages] = useState<OshiImage[]>(initial?.images ?? []);
  const [snsLinks, setSnsLinks] = useState<SnsLink[]>(
    initial?.snsLinks ?? []
  );

  const handleAddSns = () => {
    setSnsLinks([...snsLinks, { platform: "twitter", url: "", label: "" }]);
  };

  const handleRemoveSns = (index: number) => {
    setSnsLinks(snsLinks.filter((_, i) => i !== index));
  };

  const handleSnsChange = (
    index: number,
    field: keyof SnsLink,
    value: string
  ) => {
    const updated = [...snsLinks];
    updated[index] = { ...updated[index], [field]: value };
    setSnsLinks(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const now = getNow();
    const oshi: Oshi = {
      id: initial?.id ?? generateId(),
      name: name.trim(),
      oshiType,
      image,
      images,
      birthday: birthday || undefined,
      showBirthday,
      genre,
      group: oshiType === "individual" ? (group.trim() || undefined) : undefined,
      members: oshiType === "group" ? (members.trim() || undefined) : undefined,
      snsLinks: snsLinks.filter((l) => l.url.trim()),
      memo: memo.trim(),
      themeColor: themeColor || undefined,
      createdAt: initial?.createdAt ?? now,
      updatedAt: now,
    };
    onSave(oshi);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* メイン画像（新規登録時のみ表示） */}
      {!initial && (
        <div className="space-y-1">
          <label className="block text-sm font-medium text-sub">メイン画像</label>
          <ImageUploader value={image} onChange={setImage} />
        </div>
      )}

      {/* 推しタイプ */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-sub">推しタイプ</label>
        <div className="flex rounded-xl bg-[var(--bg-input)] border border-input p-1 gap-1">
          {(Object.entries(OSHI_TYPE_LABELS) as [OshiType, string][]).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setOshiType(value)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                oshiType === value
                  ? "bg-[var(--color-primary)] text-white shadow-sm"
                  : "text-sub hover:text-body"
              }`}
            >
              {value === "individual" ? "👤" : "👥"} {label}
            </button>
          ))}
        </div>
      </div>

      {/* 名前 */}
      <Input
        label={oshiType === "individual" ? "名前 *" : "グループ名 *"}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={oshiType === "individual" ? "推しの名前" : "グループ・ユニット名"}
        required
      />

      {/* ジャンル */}
      <Select
        label="ジャンル"
        options={genreOptions}
        value={genre}
        onChange={(e) => setGenre(e.target.value as OshiGenre)}
      />

      {/* 個人の場合: 所属グループ名 */}
      {oshiType === "individual" && (
        <Input
          label="所属グループ"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          placeholder="所属グループ・ユニット"
        />
      )}

      {/* グループの場合: メンバー */}
      {oshiType === "group" && (
        <div className="space-y-1">
          <label className="block text-sm font-medium text-sub">メンバー</label>
          <textarea
            value={members}
            onChange={(e) => setMembers(e.target.value)}
            placeholder={"メンバー名を入力（任意）\n例: 田中太郎、鈴木花子、佐藤次郎"}
            rows={2}
            className="w-full rounded-xl border border-input bg-[var(--bg-input)] px-4 py-2.5 text-body placeholder-[var(--text-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] focus:outline-none transition-colors resize-none"
          />
        </div>
      )}

      {/* 誕生日 */}
      <div className="space-y-2">
        <Input
          label="誕生日"
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
        />
        {birthday && (
          <label className="flex items-center gap-2 cursor-pointer">
            <div
              className={`relative w-10 h-[22px] rounded-full transition-colors ${
                showBirthday ? "bg-[var(--color-primary)]" : "bg-gray-300"
              }`}
              onClick={() => setShowBirthday(!showBirthday)}
            >
              <div
                className={`absolute top-[2px] w-[18px] h-[18px] rounded-full bg-white shadow transition-transform ${
                  showBirthday ? "translate-x-[20px]" : "translate-x-[2px]"
                }`}
              />
            </div>
            <span className="text-sm text-sub">プロフィールに誕生日を表示</span>
          </label>
        )}
      </div>

      {/* テーマカラー */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-sub">
          テーマカラー
        </label>
        <div className="flex flex-wrap gap-2">
          {THEME_PRESETS.map((preset) => (
            <button
              key={preset.color}
              type="button"
              onClick={() =>
                setThemeColor(themeColor === preset.color ? "" : preset.color)
              }
              className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
              style={{
                backgroundColor: preset.color,
                borderColor:
                  themeColor === preset.color ? preset.color : "transparent",
                boxShadow:
                  themeColor === preset.color
                    ? `0 0 0 2px white, 0 0 0 4px ${preset.color}`
                    : "none",
              }}
              title={preset.name}
            />
          ))}
        </div>
        {/* カスタムカラーピッカー */}
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={themeColor || "#ec4899"}
            onChange={(e) => setThemeColor(e.target.value)}
            className="w-8 h-8 rounded border-0 cursor-pointer"
          />
          <span className="text-xs text-dim">カスタムカラー</span>
          {themeColor && (
            <button
              type="button"
              onClick={() => setThemeColor("")}
              className="text-xs text-dim hover:text-sub ml-auto"
            >
              リセット
            </button>
          )}
        </div>
      </div>

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

      {/* SNSリンク */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-sub">
            SNSリンク
          </label>
          <button
            type="button"
            onClick={handleAddSns}
            className="text-sm text-[var(--color-primary)] hover:opacity-80"
          >
            + 追加
          </button>
        </div>
        {snsLinks.map((link, index) => (
          <div key={index} className="space-y-2 p-3 bg-[var(--bg-input)] rounded-xl">
            <div className="flex items-center gap-2">
              <Select
                options={snsOptions}
                value={link.platform}
                onChange={(e) =>
                  handleSnsChange(index, "platform", e.target.value)
                }
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => handleRemoveSns(index)}
                className="text-dim hover:text-red-500 text-xl leading-none p-1"
                aria-label="削除"
              >
                &times;
              </button>
            </div>
            <Input
              value={link.url}
              onChange={(e) => handleSnsChange(index, "url", e.target.value)}
              placeholder="https://..."
              type="url"
            />
            <Input
              value={link.label ?? ""}
              onChange={(e) => handleSnsChange(index, "label", e.target.value)}
              placeholder="表示ラベル（任意）"
            />
          </div>
        ))}
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
