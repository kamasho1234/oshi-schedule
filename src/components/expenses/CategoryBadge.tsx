"use client";

import { Badge } from "@/components/ui/Badge";
import { EXPENSE_CATEGORY_LABELS, EXPENSE_CATEGORY_COLORS } from "@/lib/constants";
import type { ExpenseCategory } from "@/types";

interface CategoryBadgeProps {
  category: ExpenseCategory;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <Badge color={EXPENSE_CATEGORY_COLORS[category]}>
      {EXPENSE_CATEGORY_LABELS[category]}
    </Badge>
  );
}
