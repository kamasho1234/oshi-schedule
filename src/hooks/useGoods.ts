"use client";

import { useCollection } from "./useStorage";
import type { Goods } from "@/types";

export function useGoods() {
  return useCollection<Goods>("goods");
}
