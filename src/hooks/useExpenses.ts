"use client";

import { useCollection } from "./useStorage";
import type { Expense } from "@/types";

export function useExpenses() {
  return useCollection<Expense>("expenses");
}
