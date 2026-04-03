"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { signOut } from "@/lib/supabase-auth";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  action?: React.ReactNode;
}

export function Header({ title, showBack, action }: HeaderProps) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session?.user);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsLoggedIn(!!session?.user);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
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

  return (
    <header className="sticky top-0 z-30 bg-header border-b border-divider" style={{ backdropFilter: "var(--backdrop-blur)" }}>
      <div className="max-w-lg mx-auto flex items-center h-14 px-4">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="mr-2"
            style={{ color: "var(--header-text)", opacity: 0.7 }}
            aria-label="戻る"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <h1 className="text-lg font-bold flex-1" style={{ color: "var(--header-text)" }}>{title}</h1>
        <div className="flex items-center gap-2">
          {action && <div>{action}</div>}
          {/* Auth button */}
          {isLoggedIn ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: "var(--color-primary)", color: "#fff" }}
                aria-label="ユーザーメニュー"
              >
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </button>
              {showMenu && (
                <div className="absolute right-0 top-10 w-36 bg-card rounded-xl shadow-lg border border-card overflow-hidden z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-sm text-left text-body hover:bg-black/5 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4 text-sub" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                    ログアウト
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors"
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
          )}
        </div>
      </div>
    </header>
  );
}
