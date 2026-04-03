"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useTheme } from "@/hooks/useTheme";
import { THEME_PRESETS } from "@/lib/constants";
import { DESIGN_THEMES } from "@/lib/themes";
import { getStorage } from "@/lib/storage";
import { EVENT_CATEGORY_LABELS } from "@/lib/constants";
import { supabase } from "@/lib/supabase";
import type { OshiEvent } from "@/types";

const SETTINGS_KEY = "oshi-schedule-settings";

function loadSettings(): { monthlyBudget?: number; showExpenseOnHome?: boolean } {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveSettings(settings: { monthlyBudget?: number; showExpenseOnHome?: boolean }) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function formatDateJa(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

export default function SettingsPage() {
  const { color, changeTheme, designTheme, changeDesignTheme } = useTheme();
  const [budget, setBudget] = useState("");
  const [budgetSaved, setBudgetSaved] = useState(false);
  const [showExpenseOnHome, setShowExpenseOnHome] = useState(true);

  // スケジュール表示
  const [exportFrom, setExportFrom] = useState("");
  const [exportTo, setExportTo] = useState("");
  const [exportResult, setExportResult] = useState<string | null>(null);

  // 指定期間データ削除
  const [deleteFrom, setDeleteFrom] = useState("");
  const [deleteTo, setDeleteTo] = useState("");
  const [deleteTargetCount, setDeleteTargetCount] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // バグ報告
  const [bugCategory, setBugCategory] = useState("bug");
  const [bugDescription, setBugDescription] = useState("");
  const [bugSubmitting, setBugSubmitting] = useState(false);
  const [bugSubmitted, setBugSubmitted] = useState(false);

  useEffect(() => {
    const settings = loadSettings();
    if (settings.monthlyBudget != null) {
      setBudget(String(settings.monthlyBudget));
    }
    if (settings.showExpenseOnHome === false) {
      setShowExpenseOnHome(false);
    }
  }, []);

  const handleSaveBudget = () => {
    const value = budget ? Number(budget) : undefined;
    saveSettings({ ...loadSettings(), monthlyBudget: value });
    setBudgetSaved(true);
    setTimeout(() => setBudgetSaved(false), 2000);
  };

  const handleToggleExpense = () => {
    const next = !showExpenseOnHome;
    setShowExpenseOnHome(next);
    saveSettings({ ...loadSettings(), showExpenseOnHome: next });
  };

  const handleExportSchedule = async () => {
    if (!exportFrom || !exportTo) {
      alert("開始日と終了日を指定してください");
      return;
    }
    if (exportFrom > exportTo) {
      alert("開始日は終了日より前に設定してください");
      return;
    }
    const storage = getStorage();
    const events = await storage.getAll<OshiEvent>("events");
    const filtered = events
      .filter((e) => e.date >= exportFrom && e.date <= exportTo)
      .sort((a, b) => a.date.localeCompare(b.date) || (a.startTime || "").localeCompare(b.startTime || ""));

    if (filtered.length === 0) {
      setExportResult("該当期間のスケジュールはありません");
      return;
    }

    const lines = filtered.map((e) => {
      const date = formatDateJa(e.date);
      const time = e.isAllDay
        ? "終日"
        : [e.startTime, e.endTime].filter(Boolean).join("〜") || "時間未定";
      const cat = EVENT_CATEGORY_LABELS[e.category] || e.category;
      const parts = [`${date} ${time}`, `[${cat}] ${e.title}`];
      if (e.location) parts.push(`場所: ${e.location}`);
      if (e.memo) parts.push(`メモ: ${e.memo}`);
      return parts.join("\n");
    });

    setExportResult(lines.join("\n\n"));
  };

  const handleCopyExport = () => {
    if (exportResult) {
      navigator.clipboard.writeText(exportResult);
    }
  };

  const handleCheckDeleteTarget = async () => {
    if (!deleteFrom || !deleteTo) {
      alert("開始日と終了日を指定してください");
      return;
    }
    if (deleteFrom > deleteTo) {
      alert("開始日は終了日より前に設定してください");
      return;
    }
    const storage = getStorage();
    const events = await storage.getAll<OshiEvent>("events");
    const count = events.filter((e) => e.date >= deleteFrom && e.date <= deleteTo).length;
    setDeleteTargetCount(count);
    if (count > 0) {
      setShowDeleteConfirm(true);
    }
  };

  const handleDeleteByPeriod = async () => {
    const storage = getStorage();
    const events = await storage.getAll<OshiEvent>("events");
    const targets = events.filter((e) => e.date >= deleteFrom && e.date <= deleteTo);
    for (const ev of targets) {
      await storage.delete("events", ev.id);
    }
    setShowDeleteConfirm(false);
    setDeleteTargetCount(null);
    setDeleteFrom("");
    setDeleteTo("");
    alert(`${targets.length}件のスケジュールを削除しました`);
  };

  const handleBugReport = async () => {
    if (!bugDescription.trim()) {
      alert("内容を入力してください");
      return;
    }
    setBugSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("バグ報告にはログインが必要です");
        return;
      }
      const { error } = await supabase.from("bug_reports").insert({
        user_id: user.id,
        category: bugCategory,
        description: bugDescription.trim(),
        page_url: window.location.href,
      });
      if (error) throw error;
      setBugDescription("");
      setBugSubmitted(true);
      setTimeout(() => setBugSubmitted(false), 3000);
    } catch {
      alert("送信に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setBugSubmitting(false);
    }
  };

  return (
    <>
      <Header title="設定" showBack />
      <PageContainer>
        <div className="space-y-6">
          {/* デザインテーマ */}
          <Card>
            <h2 className="text-base font-bold text-heading mb-3">デザインテーマ</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
              {DESIGN_THEMES.map((theme) => {
                const isSelected = designTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => changeDesignTheme(theme.id)}
                    className="flex-shrink-0 flex flex-col items-center gap-1.5 focus:outline-none"
                  >
                    <div
                      className="relative w-20 h-24 rounded-xl overflow-hidden border-2 transition-all duration-150"
                      style={{
                        borderColor: isSelected ? theme.preview.accent : "transparent",
                        boxShadow: isSelected
                          ? `0 0 0 2px ${theme.preview.accent}33`
                          : "none",
                      }}
                    >
                      {/* 背景プレビュー */}
                      <div
                        className="absolute inset-0"
                        style={{ backgroundColor: theme.preview.bg }}
                      />
                      {/* カードプレビュー */}
                      <div
                        className="absolute left-2.5 right-2.5 top-4 h-8 rounded-md shadow-sm"
                        style={{ backgroundColor: theme.preview.card }}
                      />
                      {/* アクセントプレビュー */}
                      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: theme.preview.accent }}
                        />
                        <div
                          className="w-2 h-2 rounded-full opacity-50"
                          style={{ backgroundColor: theme.preview.accent }}
                        />
                        <div
                          className="w-2 h-2 rounded-full opacity-25"
                          style={{ backgroundColor: theme.preview.accent }}
                        />
                      </div>
                      {/* 選択チェックマーク */}
                      {isSelected && (
                        <div
                          className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: theme.preview.accent }}
                        >
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        isSelected ? "text-heading" : "text-sub"
                      }`}
                    >
                      {theme.name}
                    </span>
                    <span className="text-[10px] text-dim leading-tight text-center max-w-20">
                      {theme.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* 月間予算 */}
          <Card>
            <h2 className="text-base font-bold text-heading mb-3">月間予算</h2>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Input
                  label="予算金額（円）"
                  type="number"
                  min={0}
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="例: 30000"
                />
              </div>
              <Button onClick={handleSaveBudget} size="md">
                保存
              </Button>
            </div>
            {budgetSaved && (
              <p className="text-sm text-green-600 mt-2">保存しました</p>
            )}
          </Card>

          {/* ホーム表示設定 */}
          <Card>
            <h2 className="text-base font-bold text-heading mb-3">ホーム表示</h2>
            <div className="flex items-center justify-between">
              <span className="text-sm text-body">出費をホームに表示</span>
              <button
                onClick={handleToggleExpense}
                className="relative w-12 h-7 rounded-full transition-colors"
                style={{ background: showExpenseOnHome ? "var(--color-primary)" : "#d1d5db" }}
              >
                <div
                  className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform"
                  style={{ transform: showExpenseOnHome ? "translateX(22px)" : "translateX(2px)" }}
                />
              </button>
            </div>
          </Card>

          {/* スケジュールデータ管理 */}
          <Card>
            <h2 className="text-base font-bold text-heading mb-4">スケジュールデータ管理</h2>

            {/* スケジュール表示 */}
            <div className="space-y-3 mb-6">
              <h3 className="text-sm font-bold text-heading">スケジュール表示</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-sub">開始日</label>
                  <input
                    type="date"
                    value={exportFrom}
                    onChange={(e) => setExportFrom(e.target.value)}
                    className="w-full min-w-0 radius-input border border-input bg-input px-0 py-0 text-[9px] text-body focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-sub">終了日</label>
                  <input
                    type="date"
                    value={exportTo}
                    onChange={(e) => setExportTo(e.target.value)}
                    className="w-full min-w-0 radius-input border border-input bg-input px-0 py-0 text-[9px] text-body focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <button
                className="w-full px-4 py-2 text-base font-medium rounded-xl border-2 border-green-500 bg-green-500 text-white hover:bg-green-600 hover:border-green-600 active:bg-green-700 transition-all duration-150"
                onClick={handleExportSchedule}
              >
                スケジュールを表示
              </button>
              {exportResult !== null && (
                <div className="space-y-2">
                  <pre className="text-xs text-body bg-black/5 rounded-lg p-3 whitespace-pre-wrap max-h-60 overflow-y-auto">
                    {exportResult}
                  </pre>
                  {exportResult && exportResult !== "該当期間のスケジュールはありません" && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={handleCopyExport}
                    >
                      コピー
                    </Button>
                  )}
                </div>
              )}
            </div>

            <hr className="border-border mb-6" />

            {/* 指定期間データ削除 */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-heading">指定期間のデータ削除</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-sub">開始日</label>
                  <input
                    type="date"
                    value={deleteFrom}
                    onChange={(e) => { setDeleteFrom(e.target.value); setShowDeleteConfirm(false); setDeleteTargetCount(null); }}
                    className="w-full min-w-0 radius-input border border-input bg-input px-0 py-0 text-[9px] text-body focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-sub">終了日</label>
                  <input
                    type="date"
                    value={deleteTo}
                    onChange={(e) => { setDeleteTo(e.target.value); setShowDeleteConfirm(false); setDeleteTargetCount(null); }}
                    className="w-full min-w-0 radius-input border border-input bg-input px-0 py-0 text-[9px] text-body focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] focus:outline-none transition-colors"
                  />
                </div>
              </div>
              {!showDeleteConfirm ? (
                <Button
                  variant="danger"
                  className="w-full"
                  onClick={handleCheckDeleteTarget}
                >
                  削除データ確認
                </Button>
              ) : (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 space-y-2">
                  {deleteTargetCount === 0 ? (
                    <p className="text-sm text-sub">該当期間のスケジュールはありません</p>
                  ) : (
                    <>
                      <p className="text-sm text-red-700">
                        {deleteTargetCount}件のスケジュールが見つかりました。削除しますか？
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="danger"
                          size="sm"
                          className="flex-1"
                          onClick={handleDeleteByPeriod}
                        >
                          削除する
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="flex-1"
                          onClick={() => { setShowDeleteConfirm(false); setDeleteTargetCount(null); }}
                        >
                          キャンセル
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* 使い方ガイド */}
          <Card>
            <button
              data-onboarding-replay
              onClick={() => {
                localStorage.removeItem("oshi-schedule-onboarded");
                window.location.href = "/dashboard";
              }}
              className="w-full flex items-center gap-3 text-left"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--color-primary)", color: "#fff" }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-heading">使い方ガイドを再表示</p>
                <p className="text-xs text-sub">初回ナビゲーションをもう一度見る</p>
              </div>
            </button>
          </Card>

          {/* バグ報告 */}
          <Card>
            <h2 className="text-base font-bold text-heading mb-3">バグ・要望を報告</h2>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-sub">種類</label>
                <select
                  value={bugCategory}
                  onChange={(e) => setBugCategory(e.target.value)}
                  className="w-full radius-input border border-input bg-input px-3 py-2 text-sm text-body focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] focus:outline-none transition-colors"
                >
                  <option value="bug">バグ・不具合</option>
                  <option value="feature">機能リクエスト</option>
                  <option value="ui">デザイン・表示の問題</option>
                  <option value="other">その他</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-sub">内容</label>
                <textarea
                  value={bugDescription}
                  onChange={(e) => setBugDescription(e.target.value)}
                  placeholder="どんな問題が起きましたか？&#10;どんな機能が欲しいですか？"
                  rows={4}
                  className="w-full radius-input border border-input bg-input px-3 py-2 text-sm text-body placeholder:text-dim focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] focus:outline-none transition-colors resize-none"
                />
              </div>
              <Button
                onClick={handleBugReport}
                disabled={bugSubmitting}
                className="w-full"
              >
                {bugSubmitting ? "送信中..." : "送信する"}
              </Button>
              {bugSubmitted && (
                <p className="text-sm text-green-600 text-center">ありがとうございます！報告を受け付けました。</p>
              )}
            </div>
          </Card>
        </div>
      </PageContainer>
    </>
  );
}
