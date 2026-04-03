"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Header } from "@/components/layout/Header";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const ADMIN_USER_ID = ""; // 後でSupabaseのuser_idを設定

interface BugReport {
  id: string;
  user_id: string;
  category: string;
  description: string;
  page_url: string | null;
  created_at: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  bug: "バグ・不具合",
  feature: "機能リクエスト",
  ui: "デザイン・表示",
  other: "その他",
};

const CATEGORY_COLORS: Record<string, string> = {
  bug: "bg-red-100 text-red-700",
  feature: "bg-blue-100 text-blue-700",
  ui: "bg-purple-100 text-purple-700",
  other: "bg-gray-100 text-gray-700",
};

export default function AdminBugsPage() {
  const [reports, setReports] = useState<BugReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  const checkAuthAndLoad = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    // ADMIN_USER_IDが空の場合は最初のアクセスユーザーを管理者として扱う
    if (ADMIN_USER_ID && user.id !== ADMIN_USER_ID) {
      setLoading(false);
      return;
    }

    setAuthorized(true);
    await loadReports();
  };

  const loadReports = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bug_reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setReports(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("この報告を削除しますか？")) return;
    const { error } = await supabase.from("bug_reports").delete().eq("id", id);
    if (!error) {
      setReports((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const filtered = filter === "all" ? reports : reports.filter((r) => r.category === filter);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <>
        <Header title="バグ報告管理" showBack />
        <PageContainer>
          <p className="text-center text-sub py-12">読み込み中...</p>
        </PageContainer>
      </>
    );
  }

  if (!authorized) {
    return (
      <>
        <Header title="バグ報告管理" showBack />
        <PageContainer>
          <Card>
            <p className="text-center text-sub py-8">管理者権限が必要です</p>
          </Card>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <Header title="バグ報告管理" showBack />
      <PageContainer>
        <div className="space-y-4">
          {/* 統計 */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { key: "all", label: "全件", count: reports.length },
              { key: "bug", label: "バグ", count: reports.filter((r) => r.category === "bug").length },
              { key: "feature", label: "要望", count: reports.filter((r) => r.category === "feature").length },
              { key: "ui", label: "UI", count: reports.filter((r) => r.category === "ui").length },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key)}
                className={`rounded-xl p-2 text-center transition-all ${
                  filter === item.key
                    ? "bg-[var(--color-primary)] text-white shadow-md"
                    : "bg-card border border-card text-sub"
                }`}
              >
                <div className="text-lg font-bold">{item.count}</div>
                <div className="text-[10px]">{item.label}</div>
              </button>
            ))}
          </div>

          {/* リスト */}
          {filtered.length === 0 ? (
            <Card>
              <p className="text-center text-sub py-8">報告はまだありません</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {filtered.map((report) => (
                <Card key={report.id}>
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          CATEGORY_COLORS[report.category] || CATEGORY_COLORS.other
                        }`}
                      >
                        {CATEGORY_LABELS[report.category] || report.category}
                      </span>
                      <span className="text-[10px] text-dim whitespace-nowrap">
                        {formatDate(report.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-body whitespace-pre-wrap">{report.description}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-dim truncate max-w-[200px]">
                        ID: {report.user_id.slice(0, 8)}...
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(report.id)}
                        className="text-red-400 hover:text-red-600 !px-2 !py-1"
                      >
                        削除
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </PageContainer>
    </>
  );
}
