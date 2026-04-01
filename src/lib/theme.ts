import { DEFAULT_THEME_COLOR } from "./constants";
import { hexToHsl } from "./utils";
import { getDesignTheme } from "./themes";
import type { DesignThemeId } from "@/types";

export function applyTheme(hex: string): void {
  if (typeof document === "undefined") return;
  const { h, s, l } = hexToHsl(hex);
  const root = document.documentElement;
  root.style.setProperty("--color-primary", hex);
  root.style.setProperty(
    "--color-primary-light",
    `hsl(${h}, ${Math.round(s * 100)}%, ${Math.min(Math.round(l * 100) + 25, 95)}%)`
  );
  root.style.setProperty(
    "--color-primary-dark",
    `hsl(${h}, ${Math.round(s * 100)}%, ${Math.max(Math.round(l * 100) - 15, 10)}%)`
  );
  root.style.setProperty("--color-primary-h", String(Math.round(h)));
  root.style.setProperty("--color-primary-s", `${Math.round(s * 100)}%`);
  root.style.setProperty("--color-primary-l", `${Math.round(l * 100)}%`);

  // サイバーテーマのネオン色用RGB値
  const nr = parseInt(hex.slice(1, 3), 16);
  const ng = parseInt(hex.slice(3, 5), 16);
  const nb = parseInt(hex.slice(5, 7), 16);
  root.style.setProperty("--neon-r", String(nr));
  root.style.setProperty("--neon-g", String(ng));
  root.style.setProperty("--neon-b", String(nb));
}

export function applyDesignTheme(themeId: DesignThemeId): void {
  if (typeof document === "undefined") return;
  const theme = getDesignTheme(themeId);
  const root = document.documentElement;

  for (const [key, value] of Object.entries(theme.variables)) {
    root.style.setProperty(key, value);
  }

  const body = document.body;
  body.classList.remove(
    "theme-default",
    "theme-girly",
    "theme-korean",
    "theme-cyber",
    "theme-natural"
  );
  body.classList.add(`theme-${themeId}`);

  if (theme.usesPageGradient && theme.pageGradient) {
    body.style.background = theme.pageGradient;
    body.style.backgroundAttachment = "fixed";
  } else {
    body.style.background = `var(--bg-page)`;
    body.style.backgroundAttachment = "";
  }
}

export function loadTheme(): string {
  if (typeof window === "undefined") return DEFAULT_THEME_COLOR;
  return localStorage.getItem("oshi-schedule-theme-color") || DEFAULT_THEME_COLOR;
}

export function saveTheme(hex: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("oshi-schedule-theme-color", hex);
  applyTheme(hex);
}

export function loadDesignTheme(): DesignThemeId {
  if (typeof window === "undefined") return "default";
  return (
    (localStorage.getItem("oshi-schedule-design-theme") as DesignThemeId) ||
    "default"
  );
}

export function saveDesignTheme(id: DesignThemeId): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("oshi-schedule-design-theme", id);
  applyDesignTheme(id);
}
