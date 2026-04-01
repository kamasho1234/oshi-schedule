"use client";

import { supabase } from "./supabase";

const PREFIX = "oshi-schedule-";

/**
 * ユーザー登録/ログイン後にlocalStorageのデータをSupabaseに同期
 */
export async function syncLocalToSupabase(userId: string) {
  const collections = [
    { local: "oshi", table: "oshis", transform: transformOshi },
    { local: "events", table: "events", transform: transformEvent },
    { local: "goods", table: "goods", transform: transformGoods },
    { local: "expenses", table: "expenses", transform: transformExpense },
  ];

  for (const col of collections) {
    const raw = localStorage.getItem(PREFIX + col.local);
    if (!raw) continue;

    try {
      const items = JSON.parse(raw);
      if (!Array.isArray(items) || items.length === 0) continue;

      // 既存データがあるかチェック
      const { count } = await supabase
        .from(col.table)
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      // 既にデータがある場合はスキップ（重複防止）
      if (count && count > 0) continue;

      const records = items.map((item: Record<string, unknown>) => col.transform(item, userId));

      const { error } = await supabase.from(col.table).insert(records);
      if (error) console.error(`Sync ${col.table} error:`, error);
    } catch (e) {
      console.error(`Sync ${col.local} parse error:`, e);
    }
  }

  // 設定も同期
  try {
    const settings = localStorage.getItem(PREFIX + "settings");
    if (settings) {
      const parsed = JSON.parse(settings);
      await supabase.from("user_settings").upsert({
        user_id: userId,
        theme_color: localStorage.getItem(PREFIX + "theme-color") || "#ec4899",
        design_theme: localStorage.getItem(PREFIX + "design-theme") || "default",
        monthly_budget: parsed.monthlyBudget || null,
        settings: parsed,
      });
    }
  } catch { /* ignore */ }
}

function transformOshi(item: Record<string, unknown>, userId: string) {
  return {
    id: item.id,
    user_id: userId,
    name: item.name,
    oshi_type: item.oshiType || "individual",
    image: item.image || null,
    images: item.images || [],
    birthday: item.birthday || null,
    show_birthday: item.showBirthday !== false,
    genre: item.genre,
    group: item.group || null,
    members: item.members || null,
    sns_links: item.snsLinks || [],
    memo: item.memo || "",
    theme_color: item.themeColor || null,
    created_at: item.createdAt || new Date().toISOString(),
    updated_at: item.updatedAt || new Date().toISOString(),
  };
}

function transformEvent(item: Record<string, unknown>, userId: string) {
  return {
    id: item.id,
    user_id: userId,
    title: item.title,
    date: item.date,
    start_time: item.startTime || null,
    end_time: item.endTime || null,
    category: item.category,
    oshi_id: item.oshiId || null,
    location: item.location || null,
    url: item.url || null,
    memo: item.memo || "",
    is_all_day: item.isAllDay || false,
    created_at: item.createdAt || new Date().toISOString(),
    updated_at: item.updatedAt || new Date().toISOString(),
  };
}

function transformGoods(item: Record<string, unknown>, userId: string) {
  return {
    id: item.id,
    user_id: userId,
    name: item.name,
    image: item.image || null,
    category: item.category,
    price: item.price || null,
    purchase_date: item.purchaseDate || null,
    oshi_id: item.oshiId || null,
    memo: item.memo || "",
    created_at: item.createdAt || new Date().toISOString(),
    updated_at: item.updatedAt || new Date().toISOString(),
  };
}

function transformExpense(item: Record<string, unknown>, userId: string) {
  return {
    id: item.id,
    user_id: userId,
    amount: item.amount,
    date: item.date,
    category: item.category,
    oshi_id: item.oshiId || null,
    goods_id: item.goodsId || null,
    memo: item.memo || "",
    created_at: item.createdAt || new Date().toISOString(),
    updated_at: item.updatedAt || new Date().toISOString(),
  };
}
