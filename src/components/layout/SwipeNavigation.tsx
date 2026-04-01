"use client";

import { useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

const PAGES = ["/dashboard", "/calendar", "/goods", "/expenses", "/oshi"];
const SWIPE_THRESHOLD = 80;

export function SwipeNavigation({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;

    // 横スワイプが縦スワイプより大きい場合のみ
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;

    const currentIndex = PAGES.indexOf(pathname);
    if (currentIndex === -1) return;

    if (dx < 0 && currentIndex < PAGES.length - 1) {
      // 左スワイプ → 次のページ
      router.push(PAGES[currentIndex + 1]);
    } else if (dx > 0 && currentIndex > 0) {
      // 右スワイプ → 前のページ
      router.push(PAGES[currentIndex - 1]);
    }
  }, [pathname, router]);

  // LPでは無効
  if (pathname === "/") return <>{children}</>;

  return (
    <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {children}
    </div>
  );
}
