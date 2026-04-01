"use client";

import type { Expense } from "@/types";
import { Card } from "@/components/ui/Card";
import { formatYen, getToday } from "@/lib/utils";

interface QuickStatsProps {
  expenses: Expense[];
  budget?: number;
}

export function QuickStats({ expenses, budget }: QuickStatsProps) {
  const today = getToday();
  const currentMonth = today.slice(0, 7); // "YYYY-MM"

  const monthlyExpenses = expenses.filter((e) => e.date.startsWith(currentMonth));
  const total = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

  const ratio = budget && budget > 0 ? Math.min((total / budget) * 100, 100) : 0;
  const isOver = budget ? total > budget : false;

  return (
    <section>
      <h2 className="text-base font-bold text-heading mb-3">💰 今月の出費</h2>
      <Card>
        <div className="text-center py-2">
          <p className="text-xs text-dim mb-1">
            {parseInt(today.slice(5, 7))}月の合計
          </p>
          <p
            className="text-3xl font-bold"
            style={{ color: isOver ? "#ef4444" : "var(--color-primary)" }}
          >
            {formatYen(total)}
          </p>
        </div>

        {budget != null && budget > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-sub mb-1.5">
              <span>予算 {formatYen(budget)}</span>
              <span
                className={isOver ? "text-red-500 font-semibold" : ""}
              >
                {Math.round(ratio)}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-[var(--bg-skeleton)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${ratio}%`,
                  backgroundColor: isOver ? "#ef4444" : "var(--color-primary)",
                }}
              />
            </div>
            {isOver && (
              <p className="text-xs text-red-500 mt-1.5 text-center">
                予算を {formatYen(total - budget)} オーバーしています
              </p>
            )}
          </div>
        )}
      </Card>
    </section>
  );
}
