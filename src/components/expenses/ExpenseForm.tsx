"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { EXPENSE_CATEGORY_LABELS } from "@/lib/constants";
import { generateId, getNow, getToday } from "@/lib/utils";
import type { Expense, ExpenseCategory, Oshi } from "@/types";

interface ExpenseFormProps {
  expense?: Expense | null;
  oshiList: Oshi[];
  onSave: (expense: Expense) => void;
  onDelete?: (id: string) => void;
  onCancel: () => void;
}

const categoryOptions = (Object.keys(EXPENSE_CATEGORY_LABELS) as ExpenseCategory[]).map(
  (key) => ({ value: key, label: EXPENSE_CATEGORY_LABELS[key] })
);

export function ExpenseForm({
  expense,
  oshiList,
  onSave,
  onDelete,
  onCancel,
}: ExpenseFormProps) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(getToday());
  const [category, setCategory] = useState<ExpenseCategory>("ticket");
  const [oshiId, setOshiId] = useState("");
  const [memo, setMemo] = useState("");

  useEffect(() => {
    if (expense) {
      setAmount(String(expense.amount));
      setDate(expense.date);
      setCategory(expense.category);
      setOshiId(expense.oshiId || "");
      setMemo(expense.memo);
    }
  }, [expense]);

  const oshiOptions = [
    { value: "", label: "-- 選択なし --" },
    ...oshiList.map((o) => ({ value: o.id, label: o.name })),
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseInt(amount, 10);
    if (!parsedAmount || parsedAmount <= 0 || !date) return;

    const now = getNow();
    const saved: Expense = {
      id: expense?.id || generateId(),
      amount: parsedAmount,
      date,
      category,
      oshiId: oshiId || undefined,
      memo,
      createdAt: expense?.createdAt || now,
      updatedAt: now,
    };
    onSave(saved);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="金額"
        type="number"
        placeholder="0"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        min={1}
      />
      <Input
        label="日付"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <Select
        label="カテゴリ"
        options={categoryOptions}
        value={category}
        onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
      />
      <Select
        label="推し"
        options={oshiOptions}
        value={oshiId}
        onChange={(e) => setOshiId(e.target.value)}
      />
      <div className="space-y-1">
        <label className="block text-sm font-medium text-sub">メモ</label>
        <textarea
          className="w-full rounded-xl border border-input bg-[var(--bg-input)] px-4 py-2.5 text-body placeholder-[var(--text-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] focus:outline-none transition-colors resize-none"
          rows={3}
          placeholder="メモを入力..."
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          キャンセル
        </Button>
        <Button type="submit" className="flex-1">
          {expense ? "更新" : "追加"}
        </Button>
      </div>

      {expense && onDelete && (
        <Button
          type="button"
          variant="danger"
          className="w-full"
          onClick={() => onDelete(expense.id)}
        >
          この出費を削除
        </Button>
      )}
    </form>
  );
}
