"use client";

import { Card } from "@/components/ui/Card";
import { CategoryBadge } from "@/components/expenses/CategoryBadge";
import { formatDate, formatYen } from "@/lib/utils";
import type { Expense } from "@/types";

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
}

export function ExpenseList({ expenses, onEdit }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 text-dim">
        出費の記録はありません
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {expenses.map((expense) => (
        <Card key={expense.id} onClick={() => onEdit(expense)}>
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-dim">
                  {formatDate(expense.date)}
                </span>
                <CategoryBadge category={expense.category} />
              </div>
              {expense.memo && (
                <p className="text-sm text-sub truncate">{expense.memo}</p>
              )}
            </div>
            <div className="text-right shrink-0">
              <span className="text-base font-bold text-heading">
                {formatYen(expense.amount)}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
