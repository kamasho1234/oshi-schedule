import { LocalStorageAdapter } from "./local-storage";
import { SupabaseStorageAdapter } from "./supabase-storage";
import type { IStorageAdapter } from "@/types";

let localAdapter: IStorageAdapter | null = null;
let supabaseAdapter: IStorageAdapter | null = null;
let currentUserId: string | null = null;

export function getStorage(): IStorageAdapter {
  // ログイン済みユーザーがいる場合はSupabase
  if (currentUserId && supabaseAdapter) {
    return supabaseAdapter;
  }
  // 未ログインはlocalStorage
  if (!localAdapter) {
    localAdapter = new LocalStorageAdapter();
  }
  return localAdapter;
}

export function setSupabaseUser(userId: string | null) {
  if (userId) {
    currentUserId = userId;
    supabaseAdapter = new SupabaseStorageAdapter(userId);
  } else {
    currentUserId = null;
    supabaseAdapter = null;
  }
}

export function isSupabaseActive(): boolean {
  return currentUserId !== null;
}
