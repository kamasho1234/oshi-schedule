"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { setSupabaseUser } from "@/lib/storage";
import { syncLocalToSupabase } from "@/lib/sync";

export function AuthInitializer() {
  useEffect(() => {
    // 起動時にセッション復元
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSupabaseUser(session.user.id);
        localStorage.setItem("oshi-schedule-registered", "true");
        localStorage.setItem("oshi-schedule-user-id", session.user.id);
      }
    });

    // 認証状態の変化を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setSupabaseUser(session.user.id);
        localStorage.setItem("oshi-schedule-registered", "true");
        localStorage.setItem("oshi-schedule-user-id", session.user.id);

        // 初回ログイン時にlocalStorageデータをSupabaseに同期
        if (event === "SIGNED_IN") {
          syncLocalToSupabase(session.user.id);
        }
      } else {
        setSupabaseUser(null);
        localStorage.removeItem("oshi-schedule-registered");
        localStorage.removeItem("oshi-schedule-user-id");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return null;
}
