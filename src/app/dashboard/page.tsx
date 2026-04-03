"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useEvents } from "@/hooks/useEvents";
import { useOshi } from "@/hooks/useOshi";
import { useGoods } from "@/hooks/useGoods";
import { useExpenses } from "@/hooks/useExpenses";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { ShareCard } from "@/components/share/ShareCard";
import { getToday } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { signOut } from "@/lib/supabase-auth";

function SkeletonCard() {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/30 p-4 animate-pulse">
      <div className="h-4 bg-white/40 rounded w-1/3 mb-3" />
      <div className="h-3 bg-white/40 rounded w-full mb-2" />
      <div className="h-3 bg-white/40 rounded w-2/3" />
    </div>
  );
}

export default function DashboardPage() {
  const { items: events, loading: eventsLoading } = useEvents();
  const { items: oshiList, loading: oshiLoading } = useOshi();
  const { items: goodsList } = useGoods();
  const { items: expenses } = useExpenses();
  const isLoading = eventsLoading || oshiLoading;
  const [showShare, setShowShare] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

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
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    if (showUserMenu) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserMenu]);

  const handleLogin = () => {
    window.dispatchEvent(new CustomEvent("oshi-register-prompt"));
  };

  const handleLogout = async () => {
    setShowUserMenu(false);
    await signOut();
    window.location.reload();
  };

  const shareData = useMemo(() => {
    const now = new Date();
    const currentMonth = getToday().slice(0, 7);
    const monthlyExpenses = expenses.filter(e => e.date.startsWith(currentMonth));
    const monthlyExpense = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalExpenseAllTime = expenses.reduce((sum, e) => sum + e.amount, 0);

    // 今月いちばん貢いだ推し
    const expenseByOshi: Record<string, number> = {};
    for (const e of monthlyExpenses) {
      if (e.oshiId) expenseByOshi[e.oshiId] = (expenseByOshi[e.oshiId] || 0) + e.amount;
    }
    const topOshiId = Object.entries(expenseByOshi).sort(([,a],[,b]) => b - a)[0]?.[0];
    const topOshi = topOshiId ? oshiList.find(o => o.id === topOshiId) : null;

    return {
      oshiNames: oshiList.map(o => o.name),
      eventCount: events.filter(e => e.date >= getToday()).length,
      goodsCount: goodsList.length,
      monthlyExpense,
      themeColor: oshiList[0]?.themeColor || "#ec4899",
      month: `${now.getFullYear()}年${now.getMonth() + 1}月`,
      topOshiName: topOshi?.name || "",
      topOshiExpense: topOshiId ? expenseByOshi[topOshiId] : 0,
      totalExpenseAllTime,
      oshiCount: oshiList.length,
    };
  }, [oshiList, events, goodsList, expenses]);


  // Collect all oshi images for photo wall background
  const allImages = useMemo(() => {
    const imgs: string[] = [];
    for (const oshi of oshiList) {
      if (oshi.image) imgs.push(oshi.image);
      if (oshi.images) {
        for (const img of oshi.images) {
          imgs.push(img.data);
        }
      }
    }
    return imgs;
  }, [oshiList]);


  return (
    <div className="h-[100dvh] relative flex flex-col overflow-hidden pb-20">
      {/* Photo wall background - fixed to viewport, repeats to fill */}
      {allImages.length > 0 && (
        <div className="fixed inset-0 opacity-80 z-0 overflow-hidden">
          <div className="grid grid-cols-3 gap-0" style={{ minHeight: "200vh" }}>
            {(() => {
              const tiles: string[] = [];
              while (tiles.length < 60) {
                tiles.push(...allImages);
              }
              return tiles.slice(0, 60).map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="w-full block"
                  draggable={false}
                />
              ));
            })()}
          </div>
        </div>
      )}

      {/* Fallback bg when no images */}
      {allImages.length === 0 && (
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "linear-gradient(180deg, var(--color-primary-light, #fce7f3) 0%, var(--bg-page, #fff) 100%)",
          }}
        />
      )}

      {/* Fixed overlay to prevent raw background showing */}
      <div className="fixed inset-0 z-[1]" style={{ background: "rgba(0,0,0,0.15)", pointerEvents: "none" }} />

      {/* Content layer */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <header
          className="shrink-0 backdrop-blur-md border-b border-white/20"
          style={{ background: "var(--bg-header)" }}
        >
          <div className="max-w-lg mx-auto flex items-center h-10 px-4">
            <div className="flex-1 flex justify-start">
              {isLoggedIn ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                    style={{ backgroundColor: "rgba(255,255,255,0.25)", color: "var(--header-text)" }}
                    aria-label="ユーザーメニュー"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </button>
                  {showUserMenu && (
                    <div className="absolute left-0 top-9 w-36 bg-card rounded-xl shadow-lg border border-card overflow-hidden z-50">
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
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-colors"
                  style={{
                    color: "var(--header-text)",
                    opacity: 0.85,
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
            <h1 className="text-lg font-bold text-center" style={{ color: "var(--header-text)" }}>
              推し活スケジュール帳
            </h1>
            <div className="flex-1 flex justify-end gap-2">
              <button onClick={() => setShowShare(true)} style={{ color: "var(--header-text)", opacity: 0.8 }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>
              </button>
              <Link href="/settings" style={{ color: "var(--header-text)", opacity: 0.8 }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7 7 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a7 7 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a7 7 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a7 7 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Link>
            </div>
          </div>
        </header>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
            {isLoading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : (
              <UpcomingEvents events={events} oshiList={oshiList} />
            )}
          </div>
        </div>

      </div>

      {showShare && (
        <ShareCard data={shareData} onClose={() => setShowShare(false)} />
      )}
    </div>
  );
}
