"use client";

import { useEffect } from "react";
import { applyTheme, loadTheme, applyDesignTheme, loadDesignTheme } from "@/lib/theme";

export function ThemeInitializer() {
  useEffect(() => {
    const designId = loadDesignTheme();
    applyDesignTheme(designId);
    applyTheme(loadTheme());
  }, []);
  return null;
}
