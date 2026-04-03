"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/lib/supabase";
import { signOut } from "@/lib/supabase-auth";

interface AuthButtonProps {
  compact?: boolean;
}

export function AuthButton({ compact }: AuthButtonProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const updateUser = (session: { user: { id: string; user_metadata?: Record<string, unknown> } } | null) => {
      setIsLoggedIn(!!session?.user);
      const meta = session?.user?.user_metadata;
      setAvatarUrl((meta?.avatar_url as string) || (meta?.picture as string) || null);
    };

    supabase.auth.getSession().then(({ data: { session } }) => updateUser(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => updateUser(session));
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = () => {
    window.dispatchEvent(new CustomEvent("oshi-register-prompt"));
  };

  const handleLogout = async () => {
    setShowConfirm(false);
    await signOut();
    window.location.reload();
  };

  const size = compact ? "w-7 h-7" : "w-8 h-8";
  const iconSize = compact ? "w-3.5 h-3.5" : "w-4 h-4";

  const confirmDialog = showConfirm && mounted ? createPortal(
    <div
      style={{ position: "fixed", inset: 0, zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={() => setShowConfirm(false)}
    >
      <div
        style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "24px", width: "280px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <p style={{ fontSize: "16px", fontWeight: 700, color: "#1a1a1a", textAlign: "center", marginBottom: "20px" }}>
          ログアウトしますか？
        </p>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setShowConfirm(false)}
            style={{ flex: 1, padding: "10px", borderRadius: "10px", fontSize: "14px", fontWeight: 600, color: "#666", backgroundColor: "#f0f0f0", border: "none", cursor: "pointer" }}
          >
            キャンセル
          </button>
          <button
            onClick={handleLogout}
            style={{ flex: 1, padding: "10px", borderRadius: "10px", fontSize: "14px", fontWeight: 600, color: "#fff", backgroundColor: "#ef4444", border: "none", cursor: "pointer" }}
          >
            ログアウト
          </button>
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  if (isLoggedIn) {
    return (
      <>
        <button
          onClick={() => setShowConfirm(true)}
          className={`${size} rounded-full flex items-center justify-center transition-colors overflow-hidden`}
          style={avatarUrl ? undefined : { backgroundColor: "var(--color-primary)", color: "#fff" }}
          aria-label="ログアウト"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <svg className={iconSize} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          )}
        </button>
        {confirmDialog}
      </>
    );
  }

  return (
    <button
      onClick={handleLogin}
      className={`flex items-center gap-1 rounded-lg font-bold transition-colors ${compact ? "px-2 py-1 text-[10px]" : "px-2.5 py-1.5 text-xs"}`}
      style={{
        color: "var(--header-text)",
        backgroundColor: "rgba(255,255,255,0.2)",
      }}
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
      ログイン
    </button>
  );
}
