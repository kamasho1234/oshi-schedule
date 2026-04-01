"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { setSupabaseUser } from "@/lib/storage";

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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setSupabaseUser(session.user.id);
        localStorage.setItem("oshi-schedule-registered", "true");
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
