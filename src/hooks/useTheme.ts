"use client";

import { useState, useEffect } from "react";
import {
  applyTheme,
  loadTheme,
  saveTheme,
  applyDesignTheme,
  loadDesignTheme,
  saveDesignTheme,
} from "@/lib/theme";
import type { DesignThemeId } from "@/types";

export function useTheme() {
  const [color, setColor] = useState("#ec4899");
  const [designTheme, setDesignTheme] = useState<DesignThemeId>("default");

  useEffect(() => {
    const savedColor = loadTheme();
    const savedDesign = loadDesignTheme();
    setColor(savedColor);
    setDesignTheme(savedDesign);
    applyDesignTheme(savedDesign);
    applyTheme(savedColor);
  }, []);

  const changeTheme = (hex: string) => {
    setColor(hex);
    saveTheme(hex);
  };

  const changeDesignTheme = (id: DesignThemeId) => {
    setDesignTheme(id);
    saveDesignTheme(id);
    applyTheme(color);
  };

  return { color, changeTheme, designTheme, changeDesignTheme };
}
