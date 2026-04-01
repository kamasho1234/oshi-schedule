"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useExpenses } from "@/hooks/useExpenses";
import { formatYen, getToday } from "@/lib/utils";

const SETTINGS_KEY = "oshi-schedule-settings";

const tabs = [
  { href: "/dashboard", label: "ホーム" },
  { href: "/calendar", label: "カレンダー" },
  { href: "/goods", label: "グッズ" },
  { href: "/expenses", label: "出費" },
  { href: "/oshi", label: "推し" },
];

export function BottomNav() {
  const pathname = usePathname();
  const { items: expenses } = useExpenses();

  const [showExpense, setShowExpense] = useState(true);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s.showExpenseOnHome === false) setShowExpense(false);
      }
    } catch { /* ignore */ }
  }, []);

  const monthlyTotal = useMemo(() => {
    const currentMonth = getToday().slice(0, 7);
    return expenses
      .filter((e) => e.date.startsWith(currentMonth))
      .reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  if (pathname === "/") return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 safe-area-pb" style={{ backdropFilter: "blur(10px)" }}>
      {/* 出費表示 */}
      {showExpense && (
        <div style={{ background: "var(--nav-bg, rgba(0,0,0,0.75))" }} className="px-4 py-1.5">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <div>
              <p className="text-[10px]" style={{ color: "var(--nav-text-inactive, rgba(255,255,255,0.5))" }}>今月の推し活出費</p>
              <p className="text-sm font-bold" style={{ color: "var(--nav-text, #ffffff)" }}>{formatYen(monthlyTotal)}</p>
            </div>
            <Link href="/expenses?add=1">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: "var(--nav-accent-bg, rgba(255,255,255,0.2))" }}
              >
                <svg className="w-4 h-4" style={{ color: "var(--nav-text, #ffffff)" }} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      )}
      {/* ナビバー */}
      <nav style={{ background: "var(--nav-tab-bg, rgba(0,0,0,0.6))" }}>
        <div className="max-w-lg mx-auto flex h-9">
          {tabs.map((tab) => {
            const isActive =
              tab.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex-1 flex items-center justify-center text-[11px] font-medium transition-colors"
                style={{ color: isActive ? "var(--nav-text, #ffffff)" : "var(--nav-text-inactive, rgba(255,255,255,0.45))" }}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
