"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

/* ─── 画像プール ─── */
const BAND_IMAGES = [
  "/img/idol1.jpg", "/img/band2.jpg", "/img/band3.jpg", "/img/band4.jpg", "/img/band5.jpg",
  "/img/band6.jpg", "/img/band7.jpg", "/img/band8.jpg", "/img/band9.jpg", "/img/band10.jpg",
];
const MIDOL_IMAGES = [
  "/img/midol1.jpg", "/img/midol2.jpg", "/img/midol3.jpg", "/img/midol4.jpg", "/img/midol5.jpg",
  "/img/midol6.jpg", "/img/midol7.jpg", "/img/midol8.jpg", "/img/midol9.jpg",
];
const IDOL_IMAGES = [
  "/img/band1.jpg", "/img/idol2.jpg", "/img/idol3.jpg", "/img/idol4.jpg", "/img/idol5.jpg",
  "/img/idol6.jpg", "/img/idol7.jpg", "/img/idol8.jpg", "/img/idol9.jpg", "/img/idol10.jpg",
];
const ANIME_IMAGES = [
  "/img/anime-battle.jpg", "/img/anime-girl-city.jpg", "/img/anime-3.jpg", "/img/anime-4.jpg",
  "/img/anime5.jpg", "/img/anime6.jpg", "/img/anime7.jpg", "/img/anime8.jpg",
];
const ALL_IMAGES = [...BAND_IMAGES, ...MIDOL_IMAGES, ...IDOL_IMAGES, ...ANIME_IMAGES];

const GOODS_IMAGES: Record<string, string[]> = {
  penlight: ["/img/penlight1.jpg", "/img/penlight2.jpg", "/img/penlight3.jpg"],
  towel: ["/img/towel1.jpg", "/img/towel2.jpg", "/img/towel3.jpg"],
  acrylic: ["/img/acrylic1.jpg", "/img/acrylic2.jpg", "/img/acrylic3.jpg", "/img/acrylic4.jpg", "/img/acrylic5.jpg"],
  tshirt: ["/img/tshirt1.jpg", "/img/tshirt2.jpg", "/img/tshirt3.jpg", "/img/tshirt4.jpg"],
  plush: ["/img/plush1.jpg", "/img/plush2.jpg", "/img/plush3.jpg", "/img/plush4.jpg"],
  cd_dvd: ["/img/cddvd1.jpg", "/img/cddvd2.jpg", "/img/cddvd3.jpg", "/img/cddvd4.jpg", "/img/cddvd5.jpg"],
};

// シャッフル関数（Fisher-Yates）
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// N枚をランダムに取得（重複なし）
function pickRandom(pool: string[], n: number): string[] {
  const shuffled = shuffle(pool);
  return shuffled.slice(0, n);
}

// 画像の焦点位置（ライブ写真は人物が下寄りなので bottom）
function getObjectPosition(src: string): string {
  if (src.includes("/band") || src.includes("/idol")) return "center 70%";
  return "center center";
}

// 4ジャンルから均等にランダム取得
function pickMixed(n: number): string[] {
  const pools = [BAND_IMAGES, MIDOL_IMAGES, IDOL_IMAGES, ANIME_IMAGES];
  const perPool = Math.ceil(n / pools.length);
  const picked: string[] = [];
  pools.forEach(pool => {
    picked.push(...shuffle(pool).slice(0, perPool));
  });
  return shuffle(picked).slice(0, n);
}

/* ─── IntersectionObserver フェードインフック ─── */
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(32px)";
    el.style.transition = "opacity 0.7s ease, transform 0.7s ease";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

/* ─── セクションラッパー ─── */
function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useFadeIn();
  return (
    <section ref={ref} className={`px-4 py-12 max-w-lg mx-auto ${className}`}>
      {children}
    </section>
  );
}

/* ─── セクション見出し ─── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-xl font-bold mb-6 text-center"
      style={{ color: "var(--text-heading)" }}
    >
      {children}
    </h2>
  );
}

/* ─── CTA ボタン ─── */
function CTAButton({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <Link
      href="/dashboard"
      className={`inline-block font-bold text-center py-4 px-10 text-lg shadow-lg active:scale-95 transition-transform ${className}`}
      style={{
        background: "#ffffff",
        color: "var(--color-primary)",
        borderRadius: "var(--radius-button)",
        animation: "bounce-subtle 2.5s ease-in-out infinite",
      }}
    >
      {children}
    </Link>
  );
}

/* ─── スマホモックフレーム ─── */
function PhoneMock({ children, scale = 1 }: { children: React.ReactNode; scale?: number }) {
  return (
    <div
      className="relative mx-auto"
      style={{
        width: 280 * scale,
        height: 560 * scale,
        borderRadius: 36 * scale,
        border: `${6 * scale}px solid #1f2937`,
        overflow: "hidden",
        boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
        background: "#000",
      }}
    >
      {/* ノッチ */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 120 * scale,
          height: 24 * scale,
          background: "#1f2937",
          borderRadius: `0 0 ${16 * scale}px ${16 * scale}px`,
          zIndex: 10,
        }}
      />
      <div className="w-full h-full overflow-hidden relative">
        {children}
      </div>
    </div>
  );
}

/* ================================================================
   セクション1: ファーストビュー
   ================================================================ */
const HERO_BG_IMAGES = [
  "/img/hero-band.jpg",
  "/img/hero-idol.jpg",
  "/img/hero-arena.jpg",
  "/img/hero-anime-boy.jpg",
  "/img/hero-anime-girl.jpg",
];

function HeroSection({ theme, onThemeChange }: { theme: MockThemeId; onThemeChange: (t: MockThemeId) => void }) {
  const ref = useFadeIn();
  const [heroBgIdx, setHeroBgIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroBgIdx((prev) => (prev + 1) % HERO_BG_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const heroScreens = [
    { label: "ホーム", content: <MockHome theme={theme} /> },
    { label: "カレンダー", content: <MockCalendar theme={theme} /> },
    { label: "グッズ", content: <MockGoods theme={theme} /> },
    { label: "出費", content: <MockExpenses theme={theme} /> },
    { label: "推し", content: <MockOshiList theme={theme} /> },
  ];

  const themeButtons: { id: MockThemeId; name: string }[] = [
    { id: "default", name: "基本" },
    { id: "girly", name: "ガーリー" },
    { id: "cyber", name: "サイバー" },
    { id: "korean", name: "ミニマル" },
    { id: "natural", name: "カフェ" },
  ];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden pt-12 pb-16"
    >
      {/* スライドショー背景 */}
      <div className="absolute inset-0">
        {HERO_BG_IMAGES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
            style={{ objectPosition: "center 40%", opacity: i === heroBgIdx ? 1 : 0 }}
          />
        ))}
      </div>
      {/* グラデーションオーバーレイ */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(190,24,93,0.7) 40%, rgba(124,58,237,0.85) 100%)",
      }} />
      {/* ライト演出 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 left-1/4 w-40 h-80 rotate-12 opacity-15" style={{ background: "linear-gradient(180deg, #ec4899, transparent)", filter: "blur(30px)" }} />
        <div className="absolute -top-10 right-1/4 w-32 h-60 -rotate-12 opacity-10" style={{ background: "linear-gradient(180deg, #8b5cf6, transparent)", filter: "blur(25px)" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-72 opacity-10" style={{ background: "linear-gradient(180deg, #06b6d4, transparent)", filter: "blur(20px)" }} />
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Reggae+One&display=swap');
        @keyframes bounce-subtle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
      `}</style>

      {/* 装飾 */}
      <svg className="absolute top-6 left-6 w-8 h-8 text-white/20 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      <svg className="absolute bottom-12 right-8 w-6 h-6 text-white/15 animate-pulse" style={{ animationDelay: "1s" }} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>

      <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center px-4">
        {/* コピー */}
        <h1 className="text-[2rem] sm:text-5xl font-black text-white whitespace-nowrap mb-3 leading-tight" style={{ paddingLeft: "1rem", fontFamily: "'Reggae One', cursive" }}>
          推しで、埋め尽くせ。
        </h1>
        <p className="text-xs sm:text-sm text-white/80 text-center mb-6 leading-relaxed whitespace-nowrap">
          予定・出費・グッズを管理、推し活のすべてをあなた色に
        </p>
      </div>

      {/* 横スクロール ショーケース */}
      <div
        className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", paddingLeft: "calc(50% - 112px)", paddingRight: "calc(50% - 112px)" }}
      >
        {heroScreens.map((s, i) => (
          <div key={i} className="shrink-0 snap-center flex flex-col items-center">
            <PhoneMock scale={0.8}>
              {s.content}
            </PhoneMock>
            <p className="text-xs font-bold mt-2 text-white/80">{s.label}</p>
          </div>
        ))}
      </div>

      {/* テーマ選択 */}
      <div className="relative z-10 max-w-lg mx-auto px-4 mt-4">
        <p className="text-[10px] text-white/50 text-center mb-2">テーマを切り替え</p>
        <div className="flex justify-center gap-2">
          {themeButtons.map((t) => (
            <button
              key={t.id}
              onClick={() => onThemeChange(t.id)}
              className="px-3 py-1.5 rounded-full text-[11px] font-bold transition-all"
              style={{
                background: theme === t.id ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.15)",
                color: theme === t.id ? "#be185d" : "rgba(255,255,255,0.8)",
              }}
            >
              {t.name}
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <CTAButton>今すぐ始める -- 無料</CTAButton>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   セクション2: アプリ画面ショーケース（横スクロール）
   ================================================================ */

/* --- テーマスタイル定義 --- */
type MockThemeId = "default" | "girly" | "cyber" | "korean" | "natural";

interface MockThemeStyle {
  headerBg: string;
  headerText: string;
  pageBg: string;
  cardBg: string;
  cardText: string;
  cardTextSub: string;
  accent: string;
  borderColor: string;
  borderRadius: string;
  fontFamily: string;
  footerBg: string;
  photoWallBg: string;
  photoWallTitle: string;
  tabActiveBg: string;
  tabInactiveBg: string;
  tabInactiveText: string;
}

const MOCK_THEMES: Record<MockThemeId, MockThemeStyle> = {
  default: {
    headerBg: "rgba(0,0,0,0.8)",
    headerText: "#ffffff",
    pageBg: "#f5f5f5",
    cardBg: "rgba(255,255,255,0.55)",
    cardText: "#000000",
    cardTextSub: "#4b5563",
    accent: "#000000",
    borderColor: "#f3f4f6",
    borderRadius: "1rem",
    fontFamily: "sans-serif",
    footerBg: "rgba(0,0,0,0.75)",
    photoWallBg: "#0a0a0a",
    photoWallTitle: "#ffffff",
    tabActiveBg: "",
    tabInactiveBg: "rgba(255,255,255,0.2)",
    tabInactiveText: "rgba(255,255,255,0.45)",
  },
  girly: {
    headerBg: "rgba(236,72,153,0.88)",
    headerText: "#ffffff",
    pageBg: "linear-gradient(180deg, #fce4ec 0%, #f3e5f5 50%, #e8eaf6 100%)",
    cardBg: "rgba(255,255,255,0.55)",
    cardText: "#4a2040",
    cardTextSub: "#6b3a5c",
    accent: "#ec4899",
    borderColor: "rgba(236,72,153,0.3)",
    borderRadius: "1.5rem",
    fontFamily: "'Zen Maru Gothic', sans-serif",
    footerBg: "rgba(219,39,119,0.78)",
    photoWallBg: "#fdf2f8",
    photoWallTitle: "#c22d7a",
    tabActiveBg: "",
    tabInactiveBg: "rgba(255,255,255,0.3)",
    tabInactiveText: "rgba(255,255,255,0.6)",
  },
  cyber: {
    headerBg: "rgba(10,10,15,0.8)",
    headerText: "#00ffaa",
    pageBg: "#0a0a0f",
    cardBg: "rgba(255,255,255,0.22)",
    cardText: "#f0f0f0",
    cardTextSub: "#aaaaaa",
    accent: "#00ffaa",
    borderColor: "rgba(0,255,170,0.35)",
    borderRadius: "0.5rem",
    fontFamily: "'JetBrains Mono', monospace",
    footerBg: "rgba(5,5,10,0.85)",
    photoWallBg: "#0a0a0f",
    photoWallTitle: "#00ffaa",
    tabActiveBg: "",
    tabInactiveBg: "rgba(255,255,255,0.10)",
    tabInactiveText: "#9ca3af",
  },
  korean: {
    headerBg: "#ffffff",
    headerText: "#0a0a0a",
    pageBg: "#fafafa",
    cardBg: "rgba(255,255,255,0.55)",
    cardText: "#1a1a1a",
    cardTextSub: "#555555",
    accent: "#0a0a0a",
    borderColor: "#e0e0e0",
    borderRadius: "0.25rem",
    fontFamily: "'Noto Serif JP', serif",
    footerBg: "#f5f5f5",
    photoWallBg: "#f0f0f0",
    photoWallTitle: "#1a1a1a",
    tabActiveBg: "",
    tabInactiveBg: "#f0f0f0",
    tabInactiveText: "#999999",
  },
  natural: {
    headerBg: "rgba(90,60,30,0.85)",
    headerText: "#ffffff",
    pageBg: "#faf5ef",
    cardBg: "rgba(255,251,245,0.55)",
    cardText: "#4a3728",
    cardTextSub: "#6b5540",
    accent: "#8b6914",
    borderColor: "#e8dcc8",
    borderRadius: "1rem",
    fontFamily: "'Zen Maru Gothic', sans-serif",
    footerBg: "rgba(70,45,20,0.8)",
    photoWallBg: "#3d2b1f",
    photoWallTitle: "#e8c8a0",
    tabActiveBg: "",
    tabInactiveBg: "rgba(245,230,208,0.2)",
    tabInactiveText: "rgba(255,255,255,0.55)",
  },
};

/* --- 画面1: ホーム --- */
function MockHome({ theme = "default" }: { theme?: MockThemeId }) {
  const t = MOCK_THEMES[theme];
  const tiles = useMemo(() => pickMixed(12), []);
  const events = [
    { dot: "#ec4899", title: 'VOID CHROME Solo Live "Starlight"', sub: "04/15 / 横浜アリーナ 18:00〜", countdown: "あと2日!" },
    { dot: "#8b5cf6", title: "VOID CHROME 生配信", sub: "04/18 / YouTube 21:00〜", countdown: "あと5日!" },
    { dot: "#f97316", title: "蒼穹のアリア 2期 第4話", sub: "04/20 / TOKYO MX 23:30〜", countdown: "あと7日!" },
    { dot: "#eab308", title: "PRISM∞NOVA バースデーイベント", sub: "04/22 / Zepp DiverCity 14:00〜", countdown: "あと9日!" },
  ];
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);
  const [footerVisible, setFooterVisible] = useState(true);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const st = el.scrollTop;
    setFooterVisible(st <= lastScrollTop.current || st <= 0);
    lastScrollTop.current = st;
  };

  const navTabs = ["ホーム", "カレンダー", "グッズ", "出費", "推し"];

  return (
    <div className="h-full relative" style={{ fontFamily: t.fontFamily }}>
      <div className="absolute inset-0 grid grid-cols-3 gap-0 overflow-hidden opacity-90" style={{ gridAutoRows: "min-content" }}>
        {tiles.map((src, i) => (
          <img key={i} src={src} alt="" className="w-full block" style={{ objectPosition: getObjectPosition(src), display: "block", lineHeight: 0 }} />
        ))}
      </div>
      <div className="relative z-10 flex flex-col h-full">
        <div className="pt-8 px-3 pb-2" style={{ background: t.headerBg }}>
          <p className="text-[10px] font-bold text-center tracking-wider" style={{ color: t.headerText }}>推し活スケジュール帳</p>
        </div>
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto"
        >
          {events.map((e, i) => (
            <div key={i} className="p-2 flex items-center gap-2" style={{ background: t.cardBg, borderRadius: "0.5rem", border: `1px solid ${t.borderColor}` }}>
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: e.dot }} />
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-bold truncate" style={{ color: t.cardText }}>{e.title}</p>
                <p className="text-[7px]" style={{ color: t.cardTextSub }}>{e.sub}</p>
              </div>
              <span className="text-[8px] font-bold shrink-0" style={{ color: t.cardText }}>{e.countdown}</span>
            </div>
          ))}
        </div>
        {/* Expense bar */}
        <div className="px-3 py-1" style={{ background: t.footerBg }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[6px] leading-tight" style={{ color: theme === "korean" ? t.cardTextSub : "rgba(255,255,255,0.5)" }}>今月の推し活出費</p>
              <p className="text-[9px] font-bold leading-tight" style={{ color: theme === "korean" ? t.accent : "#ffffff" }}>¥32,580</p>
            </div>
            <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: theme === "korean" ? t.accent : "rgba(255,255,255,0.2)" }}>
              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
          </div>
        </div>
        {/* Tab bar */}
        <div className="flex" style={{ background: theme === "cyber" ? "rgba(5,5,10,0.85)" : theme === "korean" ? "#f5f5f5" : t.footerBg }}>
          {navTabs.map((tab, i) => (
            <div
              key={tab}
              className="flex-1 text-center py-1"
              style={{ color: i === 0 ? (theme === "cyber" ? "#00ffaa" : theme === "korean" ? "#0a0a0a" : "#ffffff") : (theme === "korean" ? "#999" : "rgba(255,255,255,0.45)"), fontSize: "7px", fontWeight: i === 0 ? 700 : 500 }}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* --- 画面2: カレンダー --- */
function MockCalendar({ theme = "default" }: { theme?: MockThemeId }) {
  const t = MOCK_THEMES[theme];
  const calBg = useMemo(() => pickMixed(12), []);
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  const dotDays = [5, 12, 15, 20, 22, 25];
  const dotColors: Record<number, string> = { 5: "#ec4899", 12: "#8b5cf6", 15: "#ec4899", 20: "#8b5cf6", 22: "#f59e0b", 25: "#f97316" };
  return (
    <div className="h-full relative" style={{ fontFamily: t.fontFamily }}>
      <div className="absolute inset-0 grid grid-cols-3 gap-0 overflow-hidden opacity-90" style={{ gridAutoRows: "min-content" }}>
        {calBg.map((src, i) => (
          <img key={i} src={src} alt="" className="w-full block" style={{ objectPosition: getObjectPosition(src), display: "block", lineHeight: 0 }} />
        ))}
      </div>
      <div className="relative z-10 flex flex-col h-full">
        <div className="pt-8 px-3 pb-2" style={{ background: t.headerBg }}>
          <p className="text-[10px] font-bold text-center tracking-wider" style={{ color: t.headerText }}>カレンダー</p>
        </div>
        <div className="px-2 py-2 flex-1">
          <div className="p-2 mb-2" style={{ background: t.cardBg, borderRadius: "0.5rem", border: `1px solid ${t.borderColor}` }}>
            <div className="flex items-center justify-between mb-1.5 px-1">
              <span className="text-[8px]" style={{ color: t.cardTextSub }}>◀</span>
              <p className="text-[10px] font-bold" style={{ color: t.cardText }}>2026年4月</p>
              <span className="text-[8px]" style={{ color: t.cardTextSub }}>▶</span>
            </div>
            <div className="grid grid-cols-7 gap-0.5 text-center mb-1 px-1">
              {days.map((d, i) => <div key={d} className="text-[7px]" style={{ color: i === 0 ? "#f87171" : i === 6 ? "#60a5fa" : t.cardTextSub }}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-0.5 text-center px-1">
              {/* 2026年4月1日=水曜 → 日曜始まりで3つ空白 */}
              {Array.from({ length: 3 }, (_, i) => <div key={`e${i}`} className="py-1" />)}
              {Array.from({ length: 30 }, (_, i) => {
                const day = i + 1;
                const hasDot = dotDays.includes(day);
                const isSelected = day === 15;
                const cellIdx = (i + 3) % 7; // 日曜=0, 土曜=6
                return (
                  <div
                    key={i}
                    className="text-[8px] py-1 rounded relative font-medium"
                    style={isSelected ? { background: t.accent, color: "#fff", fontWeight: 700, borderRadius: "9999px" } : { color: cellIdx === 0 ? "#f87171" : cellIdx === 6 ? "#60a5fa" : t.cardText }}
                  >
                    {day}
                    {hasDot && !isSelected && (
                      <div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                        style={{ background: dotColors[day] || t.accent }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="p-2" style={{ background: t.cardBg, borderRadius: "0.5rem", border: `1px solid ${t.borderColor}` }}>
            <p className="text-[8px] font-bold" style={{ color: t.accent }}>4/15 (土)</p>
            <p className="text-[8px]" style={{ color: t.cardText }}>VOID CHROME Solo Live &quot;Starlight&quot; 18:00</p>
            <p className="text-[7px]" style={{ color: t.cardTextSub }}>横浜アリーナ</p>
          </div>
        </div>
        {/* Expense bar */}
        <div className="px-3 py-1" style={{ background: t.footerBg }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[6px] leading-tight" style={{ color: theme === "korean" ? t.cardTextSub : "rgba(255,255,255,0.5)" }}>今月の推し活出費</p>
              <p className="text-[9px] font-bold leading-tight" style={{ color: theme === "korean" ? t.accent : "#ffffff" }}>¥32,580</p>
            </div>
            <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: theme === "korean" ? t.accent : "rgba(255,255,255,0.2)" }}>
              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
          </div>
        </div>
        {/* Tab bar */}
        <div className="flex" style={{ background: theme === "cyber" ? "rgba(5,5,10,0.85)" : theme === "korean" ? "#f5f5f5" : t.footerBg }}>
          {["ホーム", "カレンダー", "グッズ", "出費", "推し"].map((tab, i) => (
            <div key={tab} className="flex-1 text-center py-1" style={{ color: i === 1 ? (theme === "cyber" ? "#00ffaa" : theme === "korean" ? "#0a0a0a" : "#ffffff") : (theme === "korean" ? "#999" : "rgba(255,255,255,0.45)"), fontSize: "7px", fontWeight: i === 1 ? 700 : 500 }}>{tab}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* --- 画面3: 出費管理 --- */
const SNS_ICONS: Record<string, { label: string; icon: React.ReactNode }> = {
  X: { label: "X (Twitter)", icon: <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  YouTube: { label: "YouTube", icon: <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
  Instagram: { label: "Instagram", icon: <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> },
  TikTok: { label: "TikTok", icon: <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg> },
};

const PROFILE_DATA = [
  { name: "SHO", group: "VOID CHROME", birthday: "7/15", color: "#ef4444", sns: ["X", "YouTube"], images: BAND_IMAGES },
  { name: "HARUKI", group: "PRISM∞NOVA", birthday: "3/22", color: "#8b5cf6", sns: ["X", "YouTube", "Instagram"], images: MIDOL_IMAGES },
  { name: "HINA", group: "Lumi☆Fleur", birthday: "11/3", color: "#ec4899", sns: ["X", "Instagram", "TikTok"], images: IDOL_IMAGES },
  { name: "天城アリア", group: "蒼穹のアリア", birthday: "1/8", color: "#06b6d4", sns: ["X", "YouTube"], images: ANIME_IMAGES },
];

/* --- 画面3: 出費管理 --- */
function MockExpenses({ theme = "default" }: { theme?: MockThemeId }) {
  const t = MOCK_THEMES[theme];
  const [activeOshi, setActiveOshi] = useState(0);
  const oshiTabs = [
    { name: "全体", color: t.accent },
    ...PROFILE_DATA.slice(0, 3).map(p => ({ name: p.name, color: p.color })),
  ];
  const expenses = [
    { date: "2026/03/28", category: "チケット", memo: "ライブチケット", amount: "¥8,500", color: "#ec4899" },
    { date: "2026/03/15", category: "グッズ", memo: "ペンライト購入", amount: "¥3,500", color: "#8b5cf6" },
    { date: "2026/03/10", category: "交通費", memo: "会場往復", amount: "¥2,400", color: "#f97316" },
    { date: "2026/03/05", category: "配信", memo: "FC月額", amount: "¥550", color: "#06b6d4" },
  ];
  const tiles = useMemo(() => pickMixed(12), []);
  return (
    <div className="h-full relative" style={{ fontFamily: t.fontFamily }}>
      <div className="absolute inset-0 grid grid-cols-3 gap-0 overflow-hidden opacity-90" style={{ gridAutoRows: "min-content" }}>
        {tiles.map((src, i) => (
          <img key={i} src={src} alt="" className="w-full block" style={{ objectPosition: getObjectPosition(src), display: "block", lineHeight: 0 }} />
        ))}
      </div>
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="pt-8 px-3 pb-2" style={{ background: t.headerBg }}>
          <p className="text-[10px] font-bold text-center tracking-wider" style={{ color: t.headerText }}>出費管理</p>
        </div>
        <div className="flex-1 px-2 py-2 space-y-1.5 overflow-y-auto">
          {/* Month selector */}
          <div className="px-2 py-1.5" style={{ background: t.cardBg, borderRadius: "0.5rem", border: `1px solid ${t.borderColor}` }}>
            <div className="flex items-center justify-center gap-3">
              <span className="text-[8px]" style={{ color: t.cardTextSub }}>◀</span>
              <p className="text-[9px] font-bold" style={{ color: t.cardText }}>2026年3月</p>
              <span className="text-[8px]" style={{ color: t.cardTextSub }}>▶</span>
            </div>
          </div>
          {/* Oshi tabs + total */}
          <div className="px-2 py-1.5" style={{ background: t.cardBg, borderRadius: "0.5rem", border: `1px solid ${t.borderColor}` }}>
            <div className="flex gap-1 mb-1.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              {oshiTabs.map((tab, i) => (
                <button
                  key={i}
                  onClick={() => setActiveOshi(i)}
                  className="px-2 py-0.5 rounded-full text-[7px] font-bold shrink-0"
                  style={{ backgroundColor: activeOshi === i ? tab.color : "rgba(0,0,0,0.08)", color: activeOshi === i ? "#fff" : t.cardTextSub }}
                >
                  {tab.name}
                </button>
              ))}
            </div>
            <p className="text-center text-sm font-extrabold" style={{ color: t.cardText }}>¥14,950</p>
          </div>
          {/* Expense list */}
          {expenses.map((e, i) => (
            <div key={i} className="p-2 flex items-center gap-2" style={{ background: t.cardBg, borderRadius: "0.5rem", border: `1px solid ${t.borderColor}` }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[7px]" style={{ color: t.cardTextSub }}>{e.date}</span>
                  <span className="text-[7px] font-bold px-1 py-0.5 rounded" style={{ color: e.color, background: `${e.color}18` }}>{e.category}</span>
                </div>
                {e.memo && <p className="text-[8px] mt-0.5" style={{ color: t.cardText }}>{e.memo}</p>}
              </div>
              <span className="text-[9px] font-bold shrink-0" style={{ color: t.cardText }}>{e.amount} ∨</span>
            </div>
          ))}
        </div>
        {/* Expense bar */}
        <div className="px-3 py-1" style={{ background: t.footerBg }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[6px] leading-tight" style={{ color: theme === "korean" ? t.cardTextSub : "rgba(255,255,255,0.5)" }}>今月の推し活出費</p>
              <p className="text-[9px] font-bold leading-tight" style={{ color: theme === "korean" ? t.accent : "#ffffff" }}>¥14,950</p>
            </div>
            <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: theme === "korean" ? t.accent : "rgba(255,255,255,0.2)" }}>
              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
          </div>
        </div>
        {/* Tab bar */}
        <div className="flex" style={{ background: theme === "cyber" ? "rgba(5,5,10,0.85)" : theme === "korean" ? "#f5f5f5" : t.footerBg }}>
          {["ホーム", "カレンダー", "グッズ", "出費", "推し"].map((tab, i) => (
            <div key={tab} className="flex-1 text-center py-1" style={{ color: i === 3 ? (theme === "cyber" ? "#00ffaa" : theme === "korean" ? "#0a0a0a" : "#ffffff") : (theme === "korean" ? "#999" : "rgba(255,255,255,0.45)"), fontSize: "7px", fontWeight: i === 3 ? 700 : 500 }}>{tab}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* --- 画面4: 推し一覧 --- */
function MockOshiList({ theme = "default" }: { theme?: MockThemeId }) {
  const t = MOCK_THEMES[theme];
  const oshiData = useMemo(() => PROFILE_DATA.slice(0, 4).map(p => ({
    name: p.name, group: p.group, color: p.color,
    img: pickRandom(p.images, 1)[0],
  })), []);
  const tiles = useMemo(() => pickMixed(12), []);
  return (
    <div className="h-full relative" style={{ fontFamily: t.fontFamily }}>
      <div className="absolute inset-0 grid grid-cols-3 gap-0 overflow-hidden opacity-90" style={{ gridAutoRows: "min-content" }}>
        {tiles.map((src, i) => (
          <img key={i} src={src} alt="" className="w-full block" style={{ objectPosition: getObjectPosition(src), display: "block", lineHeight: 0 }} />
        ))}
      </div>
      <div className="relative z-10 flex flex-col h-full">
        <div className="pt-8 px-3 pb-2" style={{ background: t.headerBg }}>
          <p className="text-[10px] font-bold text-center tracking-wider" style={{ color: t.headerText }}>推し</p>
        </div>
        <div className="flex-1 px-2 py-2 overflow-y-auto">
          <div className="grid grid-cols-2 gap-1.5">
            {oshiData.map((o, i) => (
              <div key={i} className="overflow-hidden" style={{ borderRadius: "0.5rem", border: `1px solid ${t.borderColor}` }}>
                <div className="relative h-20">
                  <img src={o.img} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-1.5 left-2">
                    <p className="text-[9px] font-bold text-white drop-shadow">{o.name}</p>
                    <p className="text-[7px] text-white/70">{o.group}</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: o.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Expense bar */}
        <div className="px-3 py-1" style={{ background: t.footerBg }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[6px] leading-tight" style={{ color: theme === "korean" ? t.cardTextSub : "rgba(255,255,255,0.5)" }}>今月の推し活出費</p>
              <p className="text-[9px] font-bold leading-tight" style={{ color: theme === "korean" ? t.accent : "#ffffff" }}>¥32,580</p>
            </div>
            <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: theme === "korean" ? t.accent : "rgba(255,255,255,0.2)" }}>
              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
          </div>
        </div>
        {/* Tab bar */}
        <div className="flex" style={{ background: theme === "cyber" ? "rgba(5,5,10,0.85)" : theme === "korean" ? "#f5f5f5" : t.footerBg }}>
          {["ホーム", "カレンダー", "グッズ", "出費", "推し"].map((tab, i) => (
            <div key={tab} className="flex-1 text-center py-1" style={{ color: i === 4 ? (theme === "cyber" ? "#00ffaa" : theme === "korean" ? "#0a0a0a" : "#ffffff") : (theme === "korean" ? "#999" : "rgba(255,255,255,0.45)"), fontSize: "7px", fontWeight: i === 4 ? 700 : 500 }}>{tab}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* --- 画面5: グッズコレクション --- */
const GOODS_BY_GROUP: Record<string, { name: string; images: string[] }[]> = {
  "VOID CHROME": [
    { name: "ペンライト", images: ["/img/vc_penlight1.jpg"] },
    { name: "推しタオル", images: ["/img/vc_towel1.jpg"] },
    { name: "Tシャツ", images: ["/img/vc_tshirt1.jpg"] },
    { name: "ぬいぐるみ", images: ["/img/vc_plush1.jpg"] },
    { name: "LIVE DVD", images: ["/img/vc_cddvd1.jpg"] },
  ],
  "PRISM∞NOVA": [
    { name: "ペンライト", images: ["/img/penlight2.jpg", "/img/penlight3.jpg"] },
    { name: "推しタオル", images: ["/img/towel2.jpg", "/img/towel1.jpg"] },
    { name: "アクスタ", images: ["/img/acrylic3.jpg", "/img/pn_acrylic1.jpg", "/img/acrylic5.jpg"] },
    { name: "Tシャツ", images: ["/img/pn_tshirt1.jpg"] },
    { name: "DVD", images: ["/img/cddvd4.jpg"] },
    { name: "ぬいぐるみ", images: ["/img/pn_plush1.jpg", "/img/pn_plush2.jpg"] },
  ],
  "Lumi☆Fleur": [
    { name: "ペンライト", images: ["/img/lf_penlight1.jpg"] },
    { name: "推しタオル", images: ["/img/lf_towel1.jpg", "/img/lf_towel2.jpg"] },
    { name: "アクスタ", images: ["/img/lf_acrylic1.jpg", "/img/lf_acrylic2.jpg"] },
    { name: "ぬいぐるみ", images: ["/img/lf_plush1.jpg"] },
    { name: "DVD-BOX", images: ["/img/lf_cddvd1.jpg"] },
  ],
};

function MockGoods({ theme = "default" }: { theme?: MockThemeId }) {
  const t = MOCK_THEMES[theme];
  const [activeTab, setActiveTab] = useState(0);
  const tiles = useMemo(() => pickMixed(12), []);
  const tabs = [
    { name: "ALL", color: t.accent },
    ...PROFILE_DATA.filter(p => GOODS_BY_GROUP[p.group]).map(p => ({ name: p.group, color: p.color })),
  ];

  const displayGoods = useMemo(() => {
    if (activeTab === 0) {
      return Object.entries(GOODS_BY_GROUP).flatMap(([, items]) =>
        items.slice(0, 2).map(g => ({ name: g.name, src: pickRandom(g.images, 1)[0] }))
      );
    }
    const groupName = tabs[activeTab]?.name;
    const items = groupName ? GOODS_BY_GROUP[groupName] : [];
    return (items || []).map(g => ({ name: g.name, src: pickRandom(g.images, 1)[0] }));
  }, [activeTab]);

  return (
    <div className="h-full relative" style={{ fontFamily: t.fontFamily }}>
      {/* Background tiles */}
      <div className="absolute inset-0 grid grid-cols-3 gap-0 overflow-hidden opacity-90" style={{ gridAutoRows: "min-content" }}>
        {tiles.map((src, i) => (
          <img key={i} src={src} alt="" className="w-full block" style={{ objectPosition: getObjectPosition(src), display: "block", lineHeight: 0 }} />
        ))}
      </div>
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="pt-8 px-3 pb-2" style={{ background: t.headerBg }}>
          <p className="text-[10px] font-bold text-center tracking-wider" style={{ color: t.headerText }}>グッズコレクション</p>
        </div>
        {/* Content */}
        <div className="flex-1 px-2 py-2 overflow-y-auto">
          {/* Oshi tabs */}
          <div className="flex gap-1 px-1 mb-1.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {tabs.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className="px-2 py-0.5 rounded-full text-[7px] font-bold transition-all shrink-0"
                style={{
                  backgroundColor: activeTab === i ? tab.color : t.tabInactiveBg,
                  color: activeTab === i ? "#fff" : t.tabInactiveText,
                }}
              >
                {tab.name}
              </button>
            ))}
          </div>
          {/* Goods grid */}
          <div className="grid grid-cols-2 gap-1.5">
            {displayGoods.map((g, i) => (
              <div key={i} className="overflow-hidden" style={{ borderRadius: "0.5rem", border: `1px solid ${t.borderColor}`, background: t.cardBg }}>
                <img src={g.src} alt="" className="w-full h-12 object-cover" />
                <div className="p-1" style={{ background: t.cardBg }}>
                  <p className="text-[8px] font-bold" style={{ color: t.cardText }}>{g.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Expense bar */}
        <div className="px-3 py-1" style={{ background: t.footerBg }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[6px] leading-tight" style={{ color: theme === "korean" ? t.cardTextSub : "rgba(255,255,255,0.5)" }}>今月の推し活出費</p>
              <p className="text-[9px] font-bold leading-tight" style={{ color: theme === "korean" ? t.accent : "#ffffff" }}>¥32,580</p>
            </div>
            <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: theme === "korean" ? t.accent : "rgba(255,255,255,0.2)" }}>
              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
          </div>
        </div>
        {/* Tab bar */}
        <div className="flex" style={{ background: theme === "cyber" ? "rgba(5,5,10,0.85)" : theme === "korean" ? "#f5f5f5" : t.footerBg }}>
          {["ホーム", "カレンダー", "グッズ", "出費", "推し"].map((tab, i) => (
            <div key={tab} className="flex-1 text-center py-1" style={{ color: i === 2 ? (theme === "cyber" ? "#00ffaa" : theme === "korean" ? "#0a0a0a" : "#ffffff") : (theme === "korean" ? "#999" : "rgba(255,255,255,0.45)"), fontSize: "7px", fontWeight: i === 2 ? 700 : 500 }}>{tab}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ShowcaseSection() {
  const ref = useFadeIn();
  const screens = [
    { label: "ホーム", src: "/img/screen-home.png" },
    { label: "カレンダー", src: "/img/screen-calendar.png" },
    { label: "グッズ", src: "/img/screen-goods.png" },
    { label: "出費", src: "/img/screen-expenses.png" },
    { label: "推し", src: "/img/screen-oshi.png" },
  ];

  return (
    <section ref={ref} className="py-12">
      <h2
        className="text-xl font-bold mb-6 text-center px-4"
        style={{ color: "var(--text-heading)" }}
      >
        こんなアプリです
      </h2>
      <div
        className="flex gap-5 overflow-x-auto pb-4 px-6 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none" }}
      >
        {screens.map((s, i) => (
          <div key={i} className="shrink-0 snap-center flex flex-col items-center">
            <PhoneMock scale={0.7}>
              <img src={s.src} alt={s.label} className="w-full h-full object-cover object-top" />
            </PhoneMock>
            <p
              className="text-xs font-bold mt-3"
              style={{ color: "var(--text-heading)" }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================================================================
   セクション3: 「推しで染める」ビジュアルセクション
   ================================================================ */
function ThemeShowcase({ activeTheme, onThemeChange }: { activeTheme: MockThemeId; onThemeChange: (t: MockThemeId) => void }) {
  const ref = useFadeIn();
  const themes: { id: MockThemeId; name: string; bg: string; accent: string; dark?: boolean }[] = [
    { id: "default", name: "基本スタイル", bg: "linear-gradient(135deg, #1a1a1a, #2d2d2d)", accent: "#ffffff", dark: true },
    { id: "girly", name: "ガーリー", bg: "linear-gradient(135deg, #fce7f3, #fdf2f8)", accent: "#ec4899" },
    { id: "cyber", name: "サイバー", bg: "linear-gradient(135deg, #0f172a, #1e293b)", accent: "#06b6d4", dark: true },
    { id: "korean", name: "ミニマル", bg: "linear-gradient(135deg, #f5f5f4, #ffffff)", accent: "#78716c" },
    { id: "natural", name: "カフェ", bg: "linear-gradient(135deg, #fef3c7, #fffbeb)", accent: "#a16207" },
  ];

  return (
    <section ref={ref} className="py-8 px-4">
      <div className="max-w-lg mx-auto">
        <h2 className="text-xl font-bold mb-2 text-center" style={{ color: "var(--text-heading)" }}>
          推しで染める4つのテーマ
        </h2>
        <p className="text-sm text-center mb-5" style={{ color: "var(--text-secondary)" }}>
          タップで上のプレビューが切り替わります
        </p>
        {/* 1行目: 基本スタイル */}
        <div className="mb-3">
          {(() => {
            const t = themes[0];
            const isActive = activeTheme === t.id;
            return (
              <button
                onClick={() => onThemeChange(t.id)}
                className="relative rounded-xl overflow-hidden py-4 transition-all w-full"
                style={{
                  background: t.bg,
                  outline: isActive ? `2.5px solid ${t.accent}` : `1px solid rgba(0,0,0,0.08)`,
                  outlineOffset: isActive ? "2px" : "0",
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: t.accent }} />
                <p className="text-sm font-bold text-center" style={{ color: isActive ? t.accent : t.accent }}>
                  {isActive ? `✓ ${t.name}` : t.name}
                </p>
              </button>
            );
          })()}
        </div>
        {/* 2行目: ガーリー, サイバー */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {themes.slice(1, 3).map((t) => {
            const isActive = activeTheme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onThemeChange(t.id)}
                className="relative rounded-xl overflow-hidden py-4 transition-all"
                style={{
                  background: t.bg,
                  outline: isActive ? `2.5px solid ${t.accent}` : `1px solid ${t.dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
                  outlineOffset: isActive ? "2px" : "0",
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: t.accent }} />
                <p className="text-sm font-bold text-center" style={{ color: isActive ? t.accent : t.dark ? "#e0e0e0" : t.accent }}>
                  {isActive ? `✓ ${t.name}` : t.name}
                </p>
              </button>
            );
          })}
        </div>
        {/* 3行目: ミニマル, カフェ */}
        <div className="grid grid-cols-2 gap-3">
          {themes.slice(3, 5).map((t) => {
            const isActive = activeTheme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onThemeChange(t.id)}
                className="relative rounded-xl overflow-hidden py-4 transition-all"
                style={{
                  background: t.bg,
                  outline: isActive ? `2.5px solid ${t.accent}` : `1px solid ${t.dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
                  outlineOffset: isActive ? "2px" : "0",
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: t.accent }} />
                <p className="text-sm font-bold text-center" style={{ color: isActive ? t.accent : t.dark ? "#e0e0e0" : t.accent }}>
                  {isActive ? `✓ ${t.name}` : t.name}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   セクション4: 機能一覧（コンパクト）
   ================================================================ */
function FeatureList() {
  const features = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      ),
      title: "カレンダー管理",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      ),
      title: "推しプロフィール",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      ),
      title: "グッズコレクション",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "出費見える化",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25a1.5 1.5 0 001.5 1.5z" />
        </svg>
      ),
      title: "フォトウォール",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
        </svg>
      ),
      title: "テーマカスタマイズ",
    },
  ];

  return (
    <Section>
      <SectionTitle>できること</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        {features.map((f, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 p-3 rounded-xl border border-divider"
            style={{ background: "var(--bg-card, #fff)" }}
          >
            <div
              className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white"
              style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark, #be185d))" }}
            >
              {f.icon}
            </div>
            <p className="text-xs font-bold" style={{ color: "var(--text-heading)" }}>
              {f.title}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ================================================================
   セクション5: 安心ポイント
   ================================================================ */
function SafetySection() {
  const points = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "完全無料・登録不要",
      desc: "メールアドレスもパスワードも不要。開いたらすぐ使える",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      ),
      title: "データはスマホに保存",
      desc: "外部送信なし。バックアップ・復元もかんたん",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3" />
        </svg>
      ),
      title: "ホーム画面に追加でアプリに",
      desc: "PWA対応。アプリストア不要でアプリ感覚",
    },
  ];

  return (
    <Section>
      <SectionTitle>安心ポイント</SectionTitle>
      <div className="space-y-3">
        {points.map((p, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-4 rounded-xl border border-divider"
            style={{ background: "var(--bg-card, #fff)" }}
          >
            <div
              className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white mt-0.5"
              style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark, #be185d))" }}
            >
              {p.icon}
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: "var(--text-heading)" }}>
                {p.title}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                {p.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ================================================================
   セクション6: CTA フッター
   ================================================================ */
function CTAFooter() {
  const ref = useFadeIn();
  return (
    <section
      ref={ref}
      className="px-4 py-16 text-center"
      style={{
        background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark, #be185d), #7c3aed)",
      }}
    >
      <div className="max-w-lg mx-auto">
        <h2 className="text-xl font-bold text-white mb-3">
          さあ、推し活を始めよう。
        </h2>
        <p className="text-white/70 text-sm mb-8">
          推しとの毎日を、もっと特別に。
        </p>
        <CTAButton>今すぐ始める -- 無料</CTAButton>
        <p className="text-white/50 text-xs mt-4">
          ※ 30秒で始められます
        </p>
      </div>
    </section>
  );
}

/* ================================================================
   メインページ
   ================================================================ */
export default function LandingPage() {
  const [mockTheme, setMockTheme] = useState<MockThemeId>("default");
  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--bg-page)", fontFamily: "var(--font-family)" }}
    >
      <HeroSection theme={mockTheme} onThemeChange={setMockTheme} />
      <FeatureList />
      <SafetySection />
      <CTAFooter />
    </div>
  );
}
