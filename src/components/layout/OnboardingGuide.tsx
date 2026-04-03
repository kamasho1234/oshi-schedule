"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

const ONBOARDING_KEY = "oshi-schedule-onboarded";

interface Step {
  page: string;
  title: string;
  description: string;
  color: string;
  highlightSelector?: string;
  buttonText: string;
}

const STEPS: Step[] = [
  {
    page: "/dashboard",
    title: "推し活スケジュール帳へようこそ！",
    description: "こちらがホーム画面です。\n登録したイベントが近い順に表示され、\nカウントダウンで確認できます。",
    color: "#ec4899",
    buttonText: "次へ",
  },
  {
    page: "/calendar",
    title: "カレンダー機能",
    description: "ライブ・配信・リリースなどの予定を\nカレンダーで一括管理できます。\n推しごとに色分けして表示されます。",
    color: "#8b5cf6",
    buttonText: "次へ",
  },
  {
    page: "/goods",
    title: "グッズコレクション機能",
    description: "ペンライト・タオル・アクスタなど\n推しグッズを写真付きで記録できます。\n推し別に整理されたコレクションに。",
    color: "#f59e0b",
    buttonText: "次へ",
  },
  {
    page: "/expenses",
    title: "出費管理機能",
    description: "チケット代・グッズ代・交通費など\n推し活にかかった出費を記録できます。\n月別・推し別に集計して把握できます。",
    color: "#06b6d4",
    buttonText: "次へ",
  },
  {
    page: "/settings",
    title: "この説明をもう一度見たいときは",
    description: "設定画面の「使い方ガイドを再表示」から\nいつでもこの説明を見ることができます。",
    color: "#6b7280",
    highlightSelector: "[data-onboarding-replay]",
    buttonText: "次へ",
  },
  {
    page: "/oshi",
    title: "まずはこちらから推し登録を始めましょう！",
    description: "右上の「＋」ボタンから推しを追加できます。\n名前・グループ・テーマカラーを設定して、\nあなただけの推し活手帳を作りましょう。",
    color: "#ec4899",
    highlightSelector: "header button:last-child",
    buttonText: "始める！",
  },
];

export function OnboardingGuide() {
  const [step, setStep] = useState(-1);
  const [visible, setVisible] = useState(false);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);
  const [navigating, setNavigating] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // 初回起動チェック
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(ONBOARDING_KEY)) return;
    if (pathname === "/dashboard" && step === -1) {
      const t = setTimeout(() => { setStep(0); setVisible(true); }, 800);
      return () => clearTimeout(t);
    }
  }, [pathname, step]);

  // ページ遷移完了を検知
  useEffect(() => {
    if (step >= 0 && step < STEPS.length && navigating) {
      const s = STEPS[step];
      if (pathname === s.page) {
        setNavigating(false);
        const t = setTimeout(() => setVisible(true), 400);
        return () => clearTimeout(t);
      }
    }
  }, [pathname, step, navigating]);

  // ハイライト要素の位置取得
  const updateHighlight = useCallback(() => {
    if (step < 0 || step >= STEPS.length || !visible) { setHighlightRect(null); return; }
    const s = STEPS[step];
    if (s.highlightSelector) {
      setTimeout(() => {
        const el = document.querySelector(s.highlightSelector!);
        if (el) setHighlightRect(el.getBoundingClientRect());
        else setHighlightRect(null);
      }, 100);
    } else {
      setHighlightRect(null);
    }
  }, [step, visible]);

  useEffect(() => {
    updateHighlight();
    window.addEventListener("resize", updateHighlight);
    return () => window.removeEventListener("resize", updateHighlight);
  }, [updateHighlight]);

  if (step < 0 || step >= STEPS.length) return null;
  if (typeof window !== "undefined" && localStorage.getItem(ONBOARDING_KEY)) return null;

  const s = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const total = STEPS.length;

  const handleNext = () => {
    setVisible(false);
    setHighlightRect(null);

    if (isLast) {
      localStorage.setItem(ONBOARDING_KEY, "1");
      setStep(-1);
      return; // 推し一覧にそのまま留まる
    }

    const next = step + 1;
    const nextStep = STEPS[next];
    setStep(next);

    if (nextStep.page !== pathname) {
      setNavigating(true);
      router.push(nextStep.page);
    } else {
      setTimeout(() => setVisible(true), 200);
    }
  };

  const pad = 8;

  // ナビ中は全操作をブロック（overlay + pointer-events）
  return (
    <>
      {/* 全画面ブロック overlay with spotlight */}
      {visible && (
        <div className="fixed inset-0 z-[70]" style={{ pointerEvents: "auto" }}>
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <mask id="spotlight-mask">
                <rect width="100%" height="100%" fill="white" />
                {highlightRect && (
                  <rect
                    x={highlightRect.left - pad}
                    y={highlightRect.top - pad}
                    width={highlightRect.width + pad * 2}
                    height={highlightRect.height + pad * 2}
                    rx="12"
                    fill="black"
                  />
                )}
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="rgba(0,0,0,0.45)"
              mask="url(#spotlight-mask)"
            />
          </svg>
        </div>
      )}

      {/* Highlight ring */}
      {visible && highlightRect && (
        <>
          <div
            className="fixed z-[75] pointer-events-none rounded-xl"
            style={{
              left: highlightRect.left - pad,
              top: highlightRect.top - pad,
              width: highlightRect.width + pad * 2,
              height: highlightRect.height + pad * 2,
              border: `2px solid ${s.color}`,
              boxShadow: `0 0 0 4px ${s.color}30, 0 0 20px ${s.color}40`,
            }}
          />
          <style>{`
            @keyframes guide-pulse {
              0%, 100% { box-shadow: 0 0 0 4px ${s.color}30, 0 0 20px ${s.color}40; }
              50% { box-shadow: 0 0 0 6px ${s.color}50, 0 0 30px ${s.color}60; }
            }
          `}</style>
        </>
      )}

      {/* Guide card - 操作可能 */}
      {visible && (
        <div className="fixed bottom-20 left-4 right-4 z-[80] max-w-sm mx-auto animate-slide-up">
          <div className="bg-white rounded-2xl shadow-xl p-5" style={{ borderTop: `3px solid ${s.color}` }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold" style={{ color: s.color }}>
                {step + 1} / {total}
              </span>
            </div>

            <h3 className="text-base font-bold text-gray-900 mb-1.5">{s.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line mb-4">{s.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {Array.from({ length: total }).map((_, i) => (
                  <div
                    key={i}
                    className="h-1 rounded-full transition-all"
                    style={{
                      width: i === step ? "14px" : "6px",
                      backgroundColor: i <= step ? s.color : "#e5e7eb",
                    }}
                  />
                ))}
              </div>
              <button
                onClick={handleNext}
                className="px-5 py-2 rounded-xl text-sm font-bold text-white active:scale-[0.97] transition-transform"
                style={{ backgroundColor: s.color }}
              >
                {s.buttonText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
