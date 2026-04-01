"use client";

import { useState } from "react";
import type { OshiEvent, Oshi, EventCategory } from "@/types";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { EVENT_CATEGORY_LABELS } from "@/lib/constants";
import { generateId, getNow } from "@/lib/utils";

interface EventFormProps {
  event?: OshiEvent;
  oshiList: Oshi[];
  onSave: (event: OshiEvent) => void;
  onCancel: () => void;
  defaultDate?: string;
}

const categoryOptions = (
  Object.entries(EVENT_CATEGORY_LABELS) as [EventCategory, string][]
).map(([value, label]) => ({ value, label }));

export function EventForm({
  event,
  oshiList,
  onSave,
  onCancel,
  defaultDate,
}: EventFormProps) {
  const isEdit = !!event;

  const [title, setTitle] = useState(event?.title ?? "");
  const [date, setDate] = useState(event?.date ?? defaultDate ?? "");
  const [isAllDay, setIsAllDay] = useState(event?.isAllDay ?? false);
  const [startTime, setStartTime] = useState(event?.startTime ?? "");
  const [endTime, setEndTime] = useState(event?.endTime ?? "");
  const [category, setCategory] = useState<EventCategory>(
    event?.category ?? "live"
  );
  const [oshiId, setOshiId] = useState(event?.oshiId ?? "");
  const [location, setLocation] = useState(event?.location ?? "");
  const [url, setUrl] = useState(event?.url ?? "");
  const [memo, setMemo] = useState(event?.memo ?? "");

  const oshiOptions = [
    { value: "", label: "選択なし" },
    ...oshiList.map((o) => ({ value: o.id, label: o.name })),
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !date) return;

    const now = getNow();
    const saved: OshiEvent = {
      id: event?.id ?? generateId(),
      title: title.trim(),
      date,
      isAllDay,
      startTime: isAllDay ? undefined : startTime || undefined,
      endTime: isAllDay ? undefined : endTime || undefined,
      category,
      oshiId: oshiId || undefined,
      location: location.trim() || undefined,
      url: url.trim() || undefined,
      memo: memo.trim(),
      createdAt: event?.createdAt ?? now,
      updatedAt: now,
    };

    onSave(saved);
  }

  const isValid = title.trim().length > 0 && date.length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="タイトル"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="ライブ名、イベント名など"
        required
      />

      <Input
        label="日付"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isAllDay"
          checked={isAllDay}
          onChange={(e) => setIsAllDay(e.target.checked)}
          className="w-4 h-4 rounded border-input text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
        />
        <label htmlFor="isAllDay" className="text-sm text-sub">
          終日
        </label>
      </div>

      {!isAllDay && (
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="開始時間"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <Input
            label="終了時間"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      )}

      <Select
        label="カテゴリ"
        options={categoryOptions}
        value={category}
        onChange={(e) => setCategory(e.target.value as EventCategory)}
      />

      <Select
        label="推し"
        options={oshiOptions}
        value={oshiId}
        onChange={(e) => setOshiId(e.target.value)}
      />

      <Input
        label="場所"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="会場名・住所"
      />

      <Input
        label="URL"
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://..."
      />

      <div className="space-y-1">
        <label
          htmlFor="event-memo"
          className="block text-sm font-medium text-sub"
        >
          メモ
        </label>
        <textarea
          id="event-memo"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={3}
          placeholder="チケット番号、持ち物など"
          className="w-full rounded-xl border border-input bg-[var(--bg-input)] px-4 py-2.5 text-body placeholder-[var(--text-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] focus:outline-none transition-colors resize-none"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="flex-1"
        >
          キャンセル
        </Button>
        <Button type="submit" disabled={!isValid} className="flex-1">
          {isEdit ? "更新" : "保存"}
        </Button>
      </div>
    </form>
  );
}
