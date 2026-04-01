"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { signUpWithEmail, signInWithEmail } from "@/lib/supabase-auth";
import { setSupabaseUser } from "@/lib/storage";

interface RegisterPromptContextValue {
  showRegisterPrompt: () => void;
}

const RegisterPromptCtx = createContext<RegisterPromptContextValue>({
  showRegisterPrompt: () => {},
});

export function useRegisterPrompt() {
  return useContext(RegisterPromptCtx).showRegisterPrompt;
}

export function RegisterPromptProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"register" | "login">("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const showRegisterPrompt = useCallback(() => {
    setIsOpen(true);
    setError("");
    setSuccess("");
    setEmail("");
    setPassword("");
  }, []);

  // useStorageからのイベントをリッスン
  useEffect(() => {
    const handler = () => {
      setIsOpen(true);
      setError("");
      setSuccess("");
    };
    window.addEventListener("oshi-register-prompt", handler);
    return () => window.removeEventListener("oshi-register-prompt", handler);
  }, []);

  const handleSubmit = async () => {
    if (!email || !password) { setError("メールアドレスとパスワードを入力してください"); return; }
    if (password.length < 6) { setError("パスワードは6文字以上にしてください"); return; }

    setLoading(true);
    setError("");
    try {
      if (mode === "register") {
        const data = await signUpWithEmail(email, password);
        if (data.user) {
          setSupabaseUser(data.user.id);
          localStorage.setItem("oshi-schedule-registered", "true");
          localStorage.setItem("oshi-schedule-user-id", data.user.id);
          setSuccess("登録完了！確認メールを送信しました。");
          setTimeout(() => {
            setIsOpen(false);
            window.location.reload();
          }, 2000);
        }
      } else {
        const data = await signInWithEmail(email, password);
        if (data.user) {
          setSupabaseUser(data.user.id);
          localStorage.setItem("oshi-schedule-registered", "true");
          localStorage.setItem("oshi-schedule-user-id", data.user.id);
          setIsOpen(false);
          window.location.reload();
        }
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "エラーが発生しました";
      if (msg.includes("already registered")) setError("このメールアドレスは既に登録されています");
      else if (msg.includes("Invalid login")) setError("メールアドレスまたはパスワードが正しくありません");
      else setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterPromptCtx.Provider value={{ showRegisterPrompt }}>
      {children}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[90] bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="fixed inset-x-4 top-[20%] z-[100] max-w-sm mx-auto animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-6">
              <div className="text-center mb-5">
                <h2 className="text-lg font-bold text-gray-900">
                  {mode === "register" ? "ユーザー登録" : "ログイン"}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {mode === "register"
                    ? "データを保存するにはユーザー登録が必要です"
                    : "登録済みのアカウントでログイン"}
                </p>
              </div>

              {error && (
                <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">{error}</div>
              )}
              {success && (
                <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-lg text-xs text-green-600">{success}</div>
              )}

              <div className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="メールアドレス"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="パスワード（6文字以上）"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                />

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white transition-colors disabled:opacity-50"
                  style={{ backgroundColor: "#ec4899" }}
                >
                  {loading ? "処理中..." : mode === "register" ? "登録する" : "ログインする"}
                </button>
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={() => { setMode(mode === "register" ? "login" : "register"); setError(""); }}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  {mode === "register" ? "アカウントをお持ちの方はこちら" : "新規登録はこちら"}
                </button>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-full mt-2 py-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
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
