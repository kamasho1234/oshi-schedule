import type {
  OshiGenre,
  OshiType,
  EventCategory,
  GoodsCategory,
  ExpenseCategory,
  SnsPlatform,
} from "@/types";

export const OSHI_TYPE_LABELS: Record<OshiType, string> = {
  individual: "個人",
  group: "グループ",
};

export const OSHI_GENRE_LABELS: Record<OshiGenre, string> = {
  idol: "アイドル",
  vtuber: "VTuber",
  anime: "アニメ",
  band: "バンド",
  actor: "俳優・声優",
  other: "その他",
};

export const EVENT_CATEGORY_LABELS: Record<EventCategory, string> = {
  live: "ライブ",
  streaming: "配信",
  broadcast: "放送",
  goods_sale: "グッズ販売",
  release: "リリース",
  birthday: "誕生日",
  other: "その他",
};

export const EVENT_CATEGORY_COLORS: Record<EventCategory, string> = {
  live: "#ef4444",
  streaming: "#8b5cf6",
  broadcast: "#3b82f6",
  goods_sale: "#f59e0b",
  release: "#10b981",
  birthday: "#ec4899",
  other: "#6b7280",
};

export const GOODS_CATEGORY_LABELS: Record<GoodsCategory, string> = {
  penlight: "ペンライト",
  towel: "タオル",
  tshirt: "Tシャツ",
  acrylic: "アクリル",
  photo: "写真・ブロマイド",
  cd_dvd: "CD/DVD",
  book: "書籍・雑誌",
  plush: "ぬいぐるみ",
  other: "その他",
};

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  ticket: "チケット",
  goods: "グッズ",
  transport: "交通費",
  accommodation: "宿泊費",
  food: "飲食費",
  streaming_sub: "サブスク",
  other: "その他",
};

export const EXPENSE_CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  ticket: "#ef4444",
  goods: "#f59e0b",
  transport: "#3b82f6",
  accommodation: "#8b5cf6",
  food: "#10b981",
  streaming_sub: "#ec4899",
  other: "#6b7280",
};

export const SNS_PLATFORM_LABELS: Record<SnsPlatform, string> = {
  twitter: "X (Twitter)",
  youtube: "YouTube",
  instagram: "Instagram",
  tiktok: "TikTok",
  other: "その他",
};

export const THEME_PRESETS = [
  { name: "ピンク", color: "#ec4899" },
  { name: "パープル", color: "#8b5cf6" },
  { name: "水色", color: "#06b6d4" },
  { name: "レッド", color: "#ef4444" },
  { name: "オレンジ", color: "#f97316" },
  { name: "イエロー", color: "#eab308" },
  { name: "グリーン", color: "#22c55e" },
  { name: "ブルー", color: "#3b82f6" },
  { name: "ネイビー", color: "#1e3a5f" },
  { name: "ブラック", color: "#1f2937" },
] as const;

export const DEFAULT_THEME_COLOR = "#ec4899";
