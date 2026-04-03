"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/lib/supabase";
import { signOut } from "@/lib/supabase-auth";

interface AuthButtonProps {
  /** ダッシュボード等の小さいヘッダー用 */
  compact?: boolean;
}

export function AuthButton({ compact }: AuthButtonProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(target) && btnRef.current && !btnRef.current.contains(target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  const handleLogin = () => {
    window.dispatchEvent(new CustomEvent("oshi-register-prompt"));
  };

  const handleLogout = async () => {
    setShowMenu(false);
    await signOut();
    window.location.reload();
  };

  const size = compact ? "w-7 h-7" : "w-8 h-8";
  const iconSize = compact ? "w-3.5 h-3.5" : "w-4 h-4";

  if (isLoggedIn) {
    return (
      <>
        <button
          ref={btnRef}
          onClick={() => setShowMenu(!showMenu)}
          className={`${size} rounded-full flex items-center justify-center transition-colors overflow-hidden`}
          style={avatarUrl ? undefined : { backgroundColor: "var(--color-primary)", color: "#fff" }}
          aria-label="ユーザーメニュー"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <svg className={iconSize} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          )}
        </button>
        {showMenu && mounted && createPortal(
          <div
            ref={menuRef}
            className="fixed left-4 top-12 w-36 rounded-xl shadow-lg overflow-hidden"
            style={{ zIndex: 99999, backgroundColor: "var(--bg-card, #fff)", border: "1px solid var(--border-card, #e5e7eb)" }}
          >
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 text-sm text-left hover:bg-black/5 transition-colors flex items-center gap-2"
              style={{ color: "var(--text-body, #333)" }}
            >
              <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              ログアウト
            </button>
          </div>,
          document.body
        )}
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
