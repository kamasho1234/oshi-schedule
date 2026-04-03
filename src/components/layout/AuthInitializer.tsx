"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { setSupabaseUser } from "@/lib/storage";
import { syncLocalToSupabase } from "@/lib/sync";

export function AuthInitializer() {
  useEffect(() => {
    // 起動時にセッション復元（サーバー側で検証）
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSupabaseUser(session.user.id);
      }
      // 認証状態が確定したことを全コンポーネントに通知
      window.dispatchEvent(new CustomEvent("oshi-auth-ready"));
    });

    // 認証状態の変化を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setSupabaseUser(session.user.id);
        // 初回ログイン時にlocalStorageデータをSupabaseに同期
        if (event === "SIGNED_IN") {
          syncLocalToSupabase(session.user.id);
        }
      } else {
        setSupabaseUser(null);
      }
      // ストレージ切替を通知→全useCollectionがリロード
      window.dispatchEvent(new CustomEvent("oshi-storage-changed"));
    });

    return () => subscription.unsubscribe();
  }, []);

  return null;
}
