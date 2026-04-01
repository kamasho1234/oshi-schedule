"use client";

import { useCollection } from "./useStorage";
import type { OshiEvent } from "@/types";

export function useEvents() {
  return useCollection<OshiEvent>("events");
}
