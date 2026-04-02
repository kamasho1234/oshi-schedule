"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const DISMISSED_KEY = "oshi-schedule-a2hs-dismissed";
const INTERVAL = 12000; // 12秒ごと

function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches
    || ("standalone" in navigator && (navigator as unknown as { standalone: boolean }).standalone);
}

function isIOS(): boolean {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function AddToHomePrompt() {
  const [show, setShow] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!isMobile()) return;
    if (isStandalone()) return;
    if (localStorage.getItem(DISMISSED_KEY)) return;
    if (pathname === "/") return;

    const timer = setInterval(() => {
      if (localStorage.getItem(DISMISSED_KEY)) { clearInterval(timer); return; }
      if (isStandalone()) { clearInterval(timer); return; }
      setShow(true);
    }, INTERVAL);

    return () => clearInterval(timer);
  }, [pathname]);

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "1");
    setShow(false);
  };

  const handleShowGuide = () => {
    setShow(false);
    setShowGuide(true);
  };

  if (pathname === "/") return null;

  return (
    <>
      {/* メインポップアップ */}
      {show && (
        <>
          <div className="fixed inset-0 z-[90] bg-black/30" onClick={() => setShow(false)} />
          <div className="fixed bottom-24 left-4 right-4 z-[100] max-w-sm mx-auto animate-slide-up">
            <div className="bg-white rounded-2xl shadow-xl p-5" style={{ borderTop: "3px solid #ec4899" }}>
              <p className="text-sm font-bold text-gray-900 mb-1">
                ホーム画面に追加しましたか？
              </p>
              <p className="text-xs text-gray-500 mb-4">
                ホーム画面に追加すると、アプリのようにすぐ起動できます
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleDismiss}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  追加済み
                </button>
                <button
                  onClick={handleShowGuide}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-colors"
                  style={{ backgroundColor: "#ec4899" }}
                >
                  今すぐ追加する
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 追加手順ガイド */}
      {showGuide && (
        <>
          <div className="fixed inset-0 z-[90] bg-black/40" onClick={() => setShowGuide(false)} />
          <div className="fixed inset-x-4 top-[12%] z-[100] max-w-sm mx-auto animate-slide-up">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-5" style={{ background: "linear-gradient(135deg, #ec4899, #8b5cf6)" }}>
                <p className="text-white text-lg font-bold">ホーム画面に追加する方法</p>
                <p className="text-white/70 text-xs mt-1">たった3ステップで完了</p>
              </div>

              <div className="p-5 space-y-4">
                {isIOS() ? (
                  /* iOS手順 */
                  <>
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-sm font-bold shrink-0">1</div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">画面下の共有ボタンをタップ</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Safariの下部にある
                          <svg className="inline w-4 h-4 mx-0.5 -mt-0.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3v11.25" />
                          </svg>
                          をタップ
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold shrink-0">2</div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">「ホーム画面に追加」を選択</p>
                        <p className="text-xs text-gray-500 mt-0.5">メニューを下にスクロールすると見つかります</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold shrink-0">3</div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">「追加」をタップして完了</p>
                        <p className="text-xs text-gray-500 mt-0.5">ホーム画面にアイコンが追加されます</p>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Android手順 */
                  <>
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-sm font-bold shrink-0">1</div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">ブラウザのメニューを開く</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Chromeの右上にある
                          <svg className="inline w-4 h-4 mx-0.5 -mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" />
                          </svg>
                          をタップ
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold shrink-0">2</div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">「ホーム画面に追加」をタップ</p>
                        <p className="text-xs text-gray-500 mt-0.5">メニューの中から選択してください</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold shrink-0">3</div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">「追加」をタップして完了</p>
                        <p className="text-xs text-gray-500 mt-0.5">ホーム画面にアイコンが追加されます</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="px-5 pb-5">
                <button
                  onClick={() => { setShowGuide(false); handleDismiss(); }}
                  className="w-full py-2.5 rounded-xl text-sm font-bold text-white"
                  style={{ backgroundColor: "#ec4899" }}
                >
                  わかりました
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
