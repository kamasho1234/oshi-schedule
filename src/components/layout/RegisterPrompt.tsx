"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { signUpWithEmail, signInWithEmail, signInWithGoogle, resetPassword } from "@/lib/supabase-auth";
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
  const [mode, setMode] = useState<"register" | "login" | "reset">("register");
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
    if (mode === "reset") {
      if (!email) { setError("メールアドレスを入力してください"); return; }
      setLoading(true);
      setError("");
      try {
        await resetPassword(email);
        setSuccess("パスワードリセットのメールを送信しました。メールのリンクから再設定してください。");
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "エラーが発生しました");
      } finally {
        setLoading(false);
      }
      return;
    }
    if (!email || !password) { setError("メールアドレスとパスワードを入力してください"); return; }
    if (password.length < 8) { setError("パスワードは8文字以上にしてください"); return; }
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) { setError("パスワードには英字と数字の両方を含めてください"); return; }

    setLoading(true);
    setError("");
    try {
      if (mode === "register") {
        const data = await signUpWithEmail(email, password);
        if (data.user) {
          setSupabaseUser(data.user.id);
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
          setIsOpen(false);
          window.location.reload();
        }
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "";
      if (msg.includes("already registered") || msg.includes("already been registered")) setError("このメールアドレスは既に登録されています");
      else if (msg.includes("Invalid login") || msg.includes("invalid_credentials")) setError("メールアドレスまたはパスワードが正しくありません");
      else if (msg.includes("weak_password")) setError("パスワードが弱すぎます。英字と数字を含む8文字以上にしてください");
      else if (msg.includes("rate_limit")) setError("しばらく時間をおいてから再度お試しください");
      else setError("エラーが発生しました。しばらくしてから再度お試しください");
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
                  {mode === "register" ? "ユーザー登録" : mode === "login" ? "ログイン" : "パスワードをリセット"}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {mode === "register"
                    ? "データを保存するにはユーザー登録が必要です"
                    : mode === "login"
                      ? "登録済みのアカウントでログイン"
                      : "登録したメールアドレスにリセットリンクを送信します"}
                </p>
              </div>

              {error && (
                <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">{error}</div>
              )}
              {success && (
                <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-lg text-xs text-green-600">{success}</div>
              )}

              <div className="space-y-3">
                {/* Google login */}
                <button
                  onClick={async () => {
                    try { await signInWithGoogle(); } catch { setError("Google認証に失敗しました"); }
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Googleで{mode === "register" ? "登録" : "ログイン"}
                </button>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-[11px] text-gray-400">または</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="メールアドレス"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                />
                {mode !== "reset" && (
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="パスワード（英字+数字で8文字以上）"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  />
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white transition-colors disabled:opacity-50"
                  style={{ backgroundColor: "#ec4899" }}
                >
                  {loading ? "処理中..." : mode === "register" ? "登録する" : mode === "login" ? "ログインする" : "リセットメールを送信"}
                </button>
              </div>

              <div className="mt-4 text-center space-y-1">
                {mode === "reset" ? (
                  <button
                    onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    ログインに戻る
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => { setMode(mode === "register" ? "login" : "register"); setError(""); }}
                      className="text-xs text-gray-500 hover:text-gray-700 block mx-auto"
                    >
                      {mode === "register" ? "アカウントをお持ちの方はこちら" : "新規登録はこちら"}
                    </button>
                    {mode === "login" && (
                      <button
                        onClick={() => { setMode("reset"); setError(""); setSuccess(""); }}
                        className="text-xs text-pink-400 hover:text-pink-600 block mx-auto"
                      >
                        パスワードを忘れた方
                      </button>
                    )}
                  </>
                )}
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
