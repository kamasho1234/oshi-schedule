export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

export function formatYen(amount: number): string {
  return `¥${amount.toLocaleString()}`;
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function getNow(): string {
  return new Date().toISOString();
}

export function getToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function getDaysBetween(dateStr: string): number {
  const target = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function getNextBirthday(mmdd: string): string {
  const [mm, dd] = mmdd.includes("-")
    ? mmdd.split("-").slice(-2)
    : [mmdd.slice(0, 2), mmdd.slice(2)];
  const now = new Date();
  const year = now.getFullYear();
  const thisYear = new Date(year, parseInt(mm) - 1, parseInt(dd));
  thisYear.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  if (thisYear.getTime() < now.getTime()) {
    return `${year + 1}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  }
  return `${year}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
}

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h: h * 360, s, l };
}

export function sanitizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") return trimmed;
    return "";
  } catch {
    // 相対URLやプロトコルなしの場合
    if (trimmed.startsWith("/")) return trimmed;
    return "";
  }
}
