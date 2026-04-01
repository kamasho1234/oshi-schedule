"use client";

import { Card } from "@/components/ui/Card";
import { EXPENSE_CATEGORY_LABELS, EXPENSE_CATEGORY_COLORS } from "@/lib/constants";
import { formatYen } from "@/lib/utils";
import type { Expense, ExpenseCategory } from "@/types";

interface MonthlySummaryProps {
  expenses: Expense[];
}

export function MonthlySummary({ expenses }: MonthlySummaryProps) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  // カテゴリ別集計
  const byCategory = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  // 金額降順にソート
  const sorted = Object.entries(byCategory).sort(([, a], [, b]) => b - a);

  return (
    <Card className="space-y-4">
      <div className="text-center">
        <p className="text-sm text-sub">今月の合計</p>
        <p className="text-3xl font-bold text-heading">{formatYen(total)}</p>
      </div>

      {sorted.length > 0 && (
        <div className="space-y-2">
          {sorted.map(([cat, amount]) => {
            const category = cat as ExpenseCategory;
            const ratio = total > 0 ? (amount / total) * 100 : 0;
            return (
              <div key={cat} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-sub">
                    {EXPENSE_CATEGORY_LABELS[category]}
                  </span>
                  <span className="font-medium text-body">
                    {formatYen(amount)}
                  </span>
                </div>
                <div className="h-2 bg-[var(--bg-skeleton)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${ratio}%`,
                      backgroundColor: EXPENSE_CATEGORY_COLORS[category],
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
