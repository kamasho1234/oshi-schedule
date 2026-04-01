import { supabase } from "@/lib/supabase";
import type { IStorageAdapter } from "@/types";

// フロントのキー名 → Supabaseテーブル名のマッピング
const TABLE_MAP: Record<string, string> = {
  oshi: "oshis",
  events: "events",
  goods: "goods",
  expenses: "expenses",
};

// フロントのフィールド名 → DBカラム名の変換
function toDbRecord(collection: string, item: Record<string, unknown>, userId: string): Record<string, unknown> {
  const record: Record<string, unknown> = { user_id: userId };

  for (const [key, value] of Object.entries(item)) {
    if (key === "createdAt") record.created_at = value;
    else if (key === "updatedAt") record.updated_at = value;
    else if (key === "oshiType") record.oshi_type = value;
    else if (key === "showBirthday") record.show_birthday = value;
    else if (key === "snsLinks") record.sns_links = value;
    else if (key === "themeColor") record.theme_color = value;
    else if (key === "startTime") record.start_time = value;
    else if (key === "endTime") record.end_time = value;
    else if (key === "oshiId") record.oshi_id = value;
    else if (key === "isAllDay") record.is_all_day = value;
    else if (key === "purchaseDate") record.purchase_date = value;
    else if (key === "goodsId") record.goods_id = value;
    else if (key === "group") record['"group"'] = value;
    else record[key] = value;
  }

  return record;
}

// DBレコード → フロントのオブジェクトに変換
function fromDbRecord(record: Record<string, unknown>): Record<string, unknown> {
  const item: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(record)) {
    if (key === "user_id") continue;
    if (key === "created_at") item.createdAt = value;
    else if (key === "updated_at") item.updatedAt = value;
    else if (key === "oshi_type") item.oshiType = value;
    else if (key === "show_birthday") item.showBirthday = value;
    else if (key === "sns_links") item.snsLinks = value;
    else if (key === "theme_color") item.themeColor = value;
    else if (key === "start_time") item.startTime = value;
    else if (key === "end_time") item.endTime = value;
    else if (key === "oshi_id") item.oshiId = value;
    else if (key === "is_all_day") item.isAllDay = value;
    else if (key === "purchase_date") item.purchaseDate = value;
    else if (key === "goods_id") item.goodsId = value;
    else if (key === "group") item.group = value;
    else item[key] = value;
  }

  return item;
}

export class SupabaseStorageAdapter implements IStorageAdapter {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  async getAll<T>(collection: string): Promise<T[]> {
    const table = TABLE_MAP[collection];
    if (!table) return [];

    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("user_id", this.userId)
      .order("created_at", { ascending: false });

    if (error) { console.error("getAll error:", error); return []; }
    return (data || []).map((r) => fromDbRecord(r) as T);
  }

  async getById<T>(collection: string, id: string): Promise<T | null> {
    const table = TABLE_MAP[collection];
    if (!table) return null;

    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("id", id)
      .eq("user_id", this.userId)
      .single();

    if (error || !data) return null;
    return fromDbRecord(data) as T;
  }

  async create<T extends { id: string }>(collection: string, item: T): Promise<T> {
    const table = TABLE_MAP[collection];
    if (!table) return item;

    const record = toDbRecord(collection, item as Record<string, unknown>, this.userId);
    // group is a reserved word, handle specially
    if ("group" in item) {
      delete record['"group"'];
      record["group"] = (item as Record<string, unknown>).group;
    }

    const { error } = await supabase.from(table).insert(record);
    if (error) console.error("create error:", error);
    return item;
  }

  async update<T extends { id: string }>(collection: string, item: T): Promise<T> {
    const table = TABLE_MAP[collection];
    if (!table) return item;

    const record = toDbRecord(collection, item as Record<string, unknown>, this.userId);
    if ("group" in item) {
      delete record['"group"'];
      record["group"] = (item as Record<string, unknown>).group;
    }
    delete record.user_id; // user_idは更新しない

    const { error } = await supabase
      .from(table)
      .update(record)
      .eq("id", item.id)
      .eq("user_id", this.userId);

    if (error) console.error("update error:", error);
    return item;
  }

  async delete(collection: string, id: string): Promise<void> {
    const table = TABLE_MAP[collection];
    if (!table) return;

    const { error } = await supabase
      .from(table)
      .delete()
      .eq("id", id)
      .eq("user_id", this.userId);

    if (error) console.error("delete error:", error);
  }

  async exportAll(): Promise<string> {
    const result: Record<string, unknown[]> = {};
    for (const col of Object.keys(TABLE_MAP)) {
      result[col] = await this.getAll(col);
    }
    return JSON.stringify(result);
  }

  async importAll(_json: string): Promise<void> {
    // TODO
  }
}
