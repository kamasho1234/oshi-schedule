import { LocalStorageAdapter } from "./local-storage";
import { SupabaseStorageAdapter } from "./supabase-storage";
import type { IStorageAdapter } from "@/types";
import { supabase } from "@/lib/supabase";

let localAdapter: IStorageAdapter | null = null;
let supabaseAdapter: IStorageAdapter | null = null;
let currentUserId: string | null = null;

export function getStorage(): IStorageAdapter {
  if (currentUserId && supabaseAdapter) {
    return supabaseAdapter;
  }
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

/**
 * Supabaseセッションからユーザー認証状態を検証
 * localStorageではなくサーバー側のセッションに基づく
 */
export async function verifyAuthState(): Promise<string | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setSupabaseUser(session.user.id);
      return session.user.id;
    }
  } catch { /* ignore */ }
  setSupabaseUser(null);
  return null;
}
