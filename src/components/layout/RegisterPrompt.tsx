"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";

interface RegisterPromptContextValue {
  showRegisterPrompt: () => void;
}

const RegisterPromptCtx = createContext<RegisterPromptContextValue>({
  showRegisterPrompt: () => {},
});

export function useRegisterPrompt() {
  return useContext(RegisterPromptCtx).showRegisterPrompt;
}

const REGISTERED_KEY = "oshi-schedule-registered";

export function isRegistered(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(REGISTERED_KEY) === "true";
}

export function RegisterPromptProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const showRegisterPrompt = useCallback(() => {
    if (isRegistered()) return; // 登録済みならスキップ
    setIsOpen(true);
  }, []);

  // useStorageからのイベントをリッスン
  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener("oshi-register-prompt", handler);
    return () => window.removeEventListener("oshi-register-prompt", handler);
  }, []);

  return (
    <RegisterPromptCtx.Provider value={{ showRegisterPrompt }}>
      {children}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[90] bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="fixed inset-x-4 top-1/4 z-[100] max-w-sm mx-auto animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-6">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🔐</div>
                <h2 className="text-lg font-bold text-gray-900">
                  ユーザー登録をお願いします
                </h2>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                  データを保存するにはユーザー登録が必要です。<br />
                  登録は無料で、30秒で完了します。
                </p>
              </div>

              <div className="space-y-2.5">
                {/* Google登録 */}
                <button
                  onClick={() => {
                    // TODO: Firebase Auth Google連携
                    alert("Google連携は本番環境構築後に有効になります");
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Googleで登録
                </button>

                {/* メール登録 */}
                <button
                  onClick={() => {
                    // TODO: Firebase Auth メール登録
                    alert("メール登録は本番環境構築後に有効になります");
                  }}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white transition-colors"
                  style={{ backgroundColor: "#ec4899" }}
                >
                  メールアドレスで登録
                </button>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-full mt-3 py-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                あとで登録する
              </button>
            </div>
          </div>
        </>
      )}
    </RegisterPromptCtx.Provider>
  );
}
