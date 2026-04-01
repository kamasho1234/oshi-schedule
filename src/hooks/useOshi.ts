"use client";

import { useCollection } from "./useStorage";
import type { Oshi } from "@/types";

export function useOshi() {
  return useCollection<Oshi>("oshi");
}
