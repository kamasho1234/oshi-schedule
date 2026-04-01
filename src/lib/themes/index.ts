import type { DesignTheme } from "@/types";
import { defaultTheme } from "./default";
import { girlyTheme } from "./girly";
import { koreanTheme } from "./korean";
import { cyberTheme } from "./cyber";
import { naturalTheme } from "./natural";

export const DESIGN_THEMES: DesignTheme[] = [
  defaultTheme,
  girlyTheme,
  koreanTheme,
  cyberTheme,
  naturalTheme,
];

export function getDesignTheme(id: string): DesignTheme {
  return DESIGN_THEMES.find((t) => t.id === id) ?? defaultTheme;
}
