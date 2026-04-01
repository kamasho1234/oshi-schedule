// === 推しプロフィール ===
export type OshiType = "individual" | "group";
export type OshiGenre = "idol" | "vtuber" | "anime" | "band" | "actor" | "other";

export type SnsPlatform = "twitter" | "youtube" | "instagram" | "tiktok" | "other";

export interface SnsLink {
  platform: SnsPlatform;
  url: string;
  label?: string;
}

export interface Oshi {
  id: string;
  name: string;
  oshiType?: OshiType; // "individual" | "group" (default: "individual")
  image?: string;
  images?: OshiImage[];
  birthday?: string;
  showBirthday?: boolean; // default: true
  genre: OshiGenre;
  group?: string; // individual: 所属グループ名, group: 未使用
  members?: string; // group: メンバー（自由入力）
  snsLinks: SnsLink[];
  memo: string;
  themeColor?: string;
  createdAt: string;
  updatedAt: string;
}

// === イベント ===
export type EventCategory =
  | "live"
  | "streaming"
  | "broadcast"
  | "goods_sale"
  | "release"
  | "birthday"
  | "other";

export interface OshiEvent {
  id: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  category: EventCategory;
  oshiId?: string;
  location?: string;
  url?: string;
  memo: string;
  isAllDay: boolean;
  createdAt: string;
  updatedAt: string;
}

// === グッズ ===
export type GoodsCategory =
  | "penlight"
  | "towel"
  | "tshirt"
  | "acrylic"
  | "photo"
  | "cd_dvd"
  | "book"
  | "plush"
  | "other";

export interface Goods {
  id: string;
  name: string;
  image?: string;
  category: GoodsCategory;
  price?: number;
  purchaseDate?: string;
  oshiId?: string;
  memo: string;
  createdAt: string;
  updatedAt: string;
}

// === 出費 ===
export type ExpenseCategory =
  | "ticket"
  | "goods"
  | "transport"
  | "accommodation"
  | "food"
  | "streaming_sub"
  | "other";

export interface Expense {
  id: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
  oshiId?: string;
  goodsId?: string;
  memo: string;
  createdAt: string;
  updatedAt: string;
}

// === 推し画像（複数） ===
export interface OshiImage {
  id: string;
  data: string;
  caption?: string;
  createdAt: string;
}

// === デザインテーマ ===
export type DesignThemeId = "default" | "girly" | "korean" | "cyber" | "natural";

export interface DesignTheme {
  id: DesignThemeId;
  name: string;
  description: string;
  preview: { bg: string; card: string; accent: string };
  variables: Record<string, string>;
  bodyClass?: string;
  usesPageGradient?: boolean;
  pageGradient?: string;
}

// === ダッシュボード背景設定 ===
export interface DashboardBgConfig {
  enabled: boolean;
  oshiId: string;
  layout: "tile" | "collage" | "single";
  opacity: number;
  brightness: number;
}

// === アプリ設定 ===
export interface AppSettings {
  themeColor: string;
  designTheme: DesignThemeId;
  monthlyBudget?: number;
  dashboardBg?: DashboardBgConfig;
}

// === ストレージ抽象化 ===
export interface IStorageAdapter {
  getAll<T>(collection: string): Promise<T[]>;
  getById<T>(collection: string, id: string): Promise<T | null>;
  create<T extends { id: string }>(collection: string, item: T): Promise<T>;
  update<T extends { id: string }>(collection: string, item: T): Promise<T>;
  delete(collection: string, id: string): Promise<void>;
  exportAll(): Promise<string>;
  importAll(json: string): Promise<void>;
}
