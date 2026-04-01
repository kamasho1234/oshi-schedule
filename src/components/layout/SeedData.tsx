"use client";

import { useEffect } from "react";

const RESET_KEY = "oshi-schedule-reset-v1";

export function SeedData() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(RESET_KEY)) return;

    // 全データクリア（初期状態にリセット）
    const keys = Object.keys(localStorage).filter(k => k.startsWith("oshi-schedule"));
    keys.forEach(k => localStorage.removeItem(k));

    localStorage.setItem(RESET_KEY, "1");
    window.location.reload();
  }, []);

  return null;
}
