"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { CategoryBadge } from "@/components/expenses/CategoryBadge";
import { useExpenses } from "@/hooks/useExpenses";
import { useOshi } from "@/hooks/useOshi";
import { AuthButton } from "@/components/layout/AuthButton";
import { formatDate, formatYen } from "@/lib/utils";
import { EXPENSE_CATEGORY_LABELS, EXPENSE_CATEGORY_COLORS } from "@/lib/constants";
import type { Expense, ExpenseCategory } from "@/types";

export default function ExpensesPage() {
  return (
    <Suspense>
      <ExpensesContent />
    </Suspense>
  );
}

function ExpensesContent() {
  const { items: expenses, add, edit, remove } = useExpenses();
  const { items: oshiList } = useOshi();

  const searchParams = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterOshiId, setFilterOshiId] = useState("");

  // ?add=1 で自動的に追加モーダルを開く
  useEffect(() => {
    if (searchParams.get("add") === "1") {
      setEditingExpense(null);
      setModalOpen(true);
    }
  }, [searchParams]);

  // Month selector
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); // 0-indexed

  const goToPrevMonth = () => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else {
      setMonth((m) => m + 1);
    }
  };

  // Filter expenses for selected month (descending by date)
  const monthlyExpenses = useMemo(() => {
    const prefix = `${year}-${String(month + 1).padStart(2, "0")}`;
    return expenses
      .filter((e) => e.date.startsWith(prefix))
      .sort((a, b) => (a.date > b.date ? -1 : 1));
  }, [expenses, year, month]);

  // Monthly total and category breakdown
  const total = useMemo(
    () => monthlyExpenses.reduce((sum, e) => sum + e.amount, 0),
    [monthlyExpenses]
  );

  const categoryBreakdown = useMemo(() => {
    const byCategory = monthlyExpenses.reduce<Record<string, number>>((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});
    return Object.entries(byCategory).sort(([, a], [, b]) => b - a);
  }, [monthlyExpenses]);

  // Collect all oshi images for photo wall background
  const allImages = useMemo(() => {
    const imgs: string[] = [];
    for (const oshi of oshiList) {
      if (oshi.image) imgs.push(oshi.image);
      if (oshi.images) {
        for (const img of oshi.images) {
          imgs.push(img.data);
        }
      }
    }
    return imgs;
  }, [oshiList]);

  const handleSave = async (expense: Expense) => {
    if (editingExpense) {
      await edit(expense);
    } else {
      await add(expense);
    }
    closeModal();
  };

  const handleDelete = async (id: string) => {
    await remove(id);
    closeModal();
  };

  const openAddModal = () => {
    setEditingExpense(null);
    setModalOpen(true);
  };

  const openEditModal = (expense: Expense) => {
    setEditingExpense(expense);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingExpense(null);
  };

  return (
    <div className="h-[100dvh] relative flex flex-col overflow-hidden pb-20">
      {/* Photo wall background */}
      {allImages.length > 0 && (
        <div className="fixed inset-0 opacity-80 z-0 overflow-hidden"><div className="grid grid-cols-3 gap-0" style={{ minHeight: "200vh" }}>
          {allImages.concat(allImages).concat(allImages).concat(allImages).concat(allImages).concat(allImages).slice(0, 60).map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="w-full block"
              style={{ objectFit: "cover" }}
              draggable={false}
            />
          ))}
          </div>
        </div>
      )}

      {/* Fallback bg when no images */}
      {allImages.length === 0 && (
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "linear-gradient(180deg, var(--color-primary-light, #fce7f3) 0%, var(--bg-page, #fff) 100%)",
          }}
        />
      )}

      {/* Fixed overlay */}
      <div className="fixed inset-0 z-[1]" style={{ background: "rgba(0,0,0,0.15)", pointerEvents: "none" }} />

      {/* Content layer */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Gradient header - semi-transparent */}
        <header
          className="shrink-0 backdrop-blur-md border-b border-white/20"
          style={{ background: "var(--bg-header)" }}
        >
          <div className="max-w-lg mx-auto flex items-center h-10 px-4">
            <div className="flex-1 flex justify-start">
              <AuthButton compact />
            </div>
            <h1 className="text-lg font-bold text-center" style={{ color: "var(--header-text)" }}>出費管理</h1>
            <div className="flex-1 flex justify-end">
            <button
              onClick={openAddModal}
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "var(--header-accent-bg)" }}
            >
              <svg
                className="w-5 h-5"
                style={{ color: "var(--header-text)" }}
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
            </div>
          </div>
        </header>

        {/* Scrollable content area */}
        <div
          className="flex-1 overflow-y-auto"
          
        >
          <div className="max-w-lg mx-auto px-4 py-3 space-y-3">
            {/* Month selector - compact */}
            <div className="bg-card backdrop-blur-sm rounded-xl border border-card px-3 py-1.5">
              <div className="flex items-center justify-center gap-3">
                <button onClick={goToPrevMonth} className="p-1 text-heading">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-sm font-bold text-heading">{year}年{month + 1}月</span>
                <button onClick={goToNextMonth} className="p-1 text-heading">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 推しタブ + 合計金額 */}
            <div className="bg-card backdrop-blur-sm rounded-xl border border-card px-3 py-2">
              <div className="flex gap-1.5 overflow-x-auto mb-2" style={{ scrollbarWidth: "none" }}>
                <button
                  onClick={() => setFilterOshiId("")}
                  className="shrink-0 px-3 py-0.5 rounded-full text-[11px] font-bold transition-all"
                  style={{
                    backgroundColor: filterOshiId === "" ? "var(--color-primary)" : "rgba(0,0,0,0.08)",
                    color: filterOshiId === "" ? "#fff" : "var(--text-secondary)",
                  }}
                >
                  全体
                </button>
                {oshiList.map((oshi) => {
                  const isActive = filterOshiId === oshi.id;
                  return (
                    <button
                      key={oshi.id}
                      onClick={() => setFilterOshiId(oshi.id)}
                      className="shrink-0 px-3 py-0.5 rounded-full text-[11px] font-bold transition-all"
                      style={{
                        backgroundColor: isActive ? (oshi.themeColor || "var(--text-heading)") : "rgba(0,0,0,0.08)",
                        color: isActive ? "#fff" : "var(--text-secondary)",
                      }}
                    >
                      {oshi.name}
                    </button>
                  );
                })}
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-heading">
                  {formatYen(
                    filterOshiId
                      ? monthlyExpenses.filter((e) => e.oshiId === filterOshiId).reduce((s, e) => s + e.amount, 0)
                      : total
                  )}
                </p>
              </div>
            </div>

            {/* Expense list */}
            {(() => {
              const displayed = filterOshiId
                ? monthlyExpenses.filter((e) => e.oshiId === filterOshiId)
                : monthlyExpenses;
              return displayed.length === 0 ? (
                <div className="bg-card backdrop-blur-sm rounded-xl border border-card py-6 text-center text-sub text-sm">
                  出費の記録はありません
                </div>
              ) : (
                <div className="space-y-1.5">
                  {displayed.map((expense) => {
                    const isExpanded = expandedId === expense.id;
                    const oshiName = expense.oshiId ? oshiList.find((o) => o.id === expense.oshiId)?.name : undefined;
                    return (
                      <div key={expense.id} className="bg-card backdrop-blur-sm rounded-xl border border-card overflow-hidden">
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : expense.id)}
                          className="w-full text-left px-3 py-2"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] text-sub">{formatDate(expense.date)}</span>
                                <CategoryBadge category={expense.category} />
                              </div>
                              {expense.memo && <p className="text-xs text-heading truncate mt-0.5">{expense.memo}</p>}
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <span className="text-sm font-bold text-heading">{formatYen(expense.amount)}</span>
                              <svg className="w-3 h-3 text-sub transition-transform" style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </button>
                        {isExpanded && (
                          <div className="px-3 pb-2 space-y-1 border-t border-white/20 pt-2">
                            {oshiName && <p className="text-xs text-heading font-medium">{oshiName}</p>}
                            <p className="text-xs text-sub">{formatYen(expense.amount)} / {EXPENSE_CATEGORY_LABELS[expense.category]}</p>
                            {expense.memo && <p className="text-xs text-sub">{expense.memo}</p>}
                            <button
                              onClick={(e) => { e.stopPropagation(); openEditModal(expense); }}
                              className="text-xs font-medium px-3 py-1 rounded-full"
                              style={{ background: "var(--text-heading)", color: "#fff" }}
                            >
                              編集
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Add/Edit modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingExpense ? "出費を編集" : "出費を追加"}
      >
        <ExpenseForm
          expense={editingExpense}
          oshiList={oshiList}
          onSave={handleSave}
          onDelete={editingExpense ? handleDelete : undefined}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
}
