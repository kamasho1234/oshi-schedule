"use client";

import { useState, useRef, useCallback } from "react";
import html2canvas from "html2canvas";

interface ShareCardData {
  oshiNames: string[];
  eventCount: number;
  goodsCount: number;
  monthlyExpense: number;
  themeColor: string;
  month: string;
  topOshiName: string;
  topOshiExpense: number;
  totalExpenseAllTime: number;
  oshiCount: number;
}

interface ShareCardProps {
  data: ShareCardData;
  onClose: () => void;
}

function getOshiLevel(expense: number): { title: string; next: string } {
  if (expense >= 100000) return { title: "推しに人生捧げし者", next: "" };
  if (expense >= 50000) return { title: "推し活の覇者", next: `あと${(100000 - expense).toLocaleString()}円で最高ランク` };
  if (expense >= 30000) return { title: "推し活ガチ勢", next: `あと${(50000 - expense).toLocaleString()}円で覇者` };
  if (expense >= 10000) return { title: "推し活エンジョイ勢", next: `あと${(30000 - expense).toLocaleString()}円でガチ勢` };
  return { title: "推し活ビギナー", next: `あと${(10000 - expense).toLocaleString()}円でエンジョイ勢` };
}

function getOneWord(expense: number): string {
  if (expense >= 100000) return "推しのために生きている。後悔はない。";
  if (expense >= 50000) return "財布が軽い。でも心は満たされている。";
  if (expense >= 30000) return "推しが元気なら、それでいい。";
  if (expense >= 10000) return "推し活は最高の自己投資。";
  if (expense > 0) return "推し活、始めました。";
  return "これから推しに出会う予感。";
}

export function ShareCard({ data, onClose }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [sharing, setSharing] = useState(false);

  const generateImage = useCallback(async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    const canvas = await html2canvas(cardRef.current, {
      scale: 2,
      backgroundColor: null,
      useCORS: true,
    });
    return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  }, []);

  const handleShare = async () => {
    setSharing(true);
    try {
      const blob = await generateImage();
      if (!blob) return;
      const file = new File([blob], "oshi-katsu-summary.png", { type: "image/png" });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "推し活サマリー",
          text: `${data.month}の推し活まとめ #推し活 #推し活スケジュール帳 my-oshi.com`,
          files: [file],
        });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "oshi-katsu-summary.png";
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch { /* cancel */ } finally { setSharing(false); }
  };

  const fmt = (n: number) => "¥" + n.toLocaleString();
  const level = getOshiLevel(data.monthlyExpense);
  const oneWord = getOneWord(data.monthlyExpense);
  const dailyAvg = data.monthlyExpense > 0 ? Math.round(data.monthlyExpense / 30) : 0;

  return (
    <>
      <div className="fixed inset-0 z-[90] bg-black/50" onClick={onClose} />
      <div className="fixed inset-x-4 top-[8%] z-[100] max-w-sm mx-auto animate-fade-in">
        <div
          ref={cardRef}
          className="rounded-2xl overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${data.themeColor}ee, ${data.themeColor}88, #1a1a2e)` }}
        >
          <div className="p-5">
            {/* Header */}
            <div className="text-center mb-4">
              <p className="text-white/50 text-[10px] tracking-widest">{data.month}</p>
              <p className="text-white text-base font-bold mt-0.5">推し活レポート</p>
            </div>

            {/* Level badge */}
            <div className="text-center mb-4">
              <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                {level.title}
              </span>
              {level.next && (
                <p className="text-white/40 text-[9px] mt-1.5">{level.next}</p>
              )}
            </div>

            {/* Main expense */}
            <div className="bg-white/10 rounded-xl p-4 text-center mb-3">
              <p className="text-white/50 text-[10px] mb-1">今月の推し活費</p>
              <p className="text-white text-3xl font-extrabold">{fmt(data.monthlyExpense)}</p>
              <p className="text-white/40 text-[10px] mt-1">1日あたり {fmt(dailyAvg)}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-white/10 rounded-xl p-2.5 text-center">
                <p className="text-white/50 text-[9px]">推し</p>
                <p className="text-white text-lg font-bold">{data.oshiCount}</p>
                <p className="text-white/40 text-[9px]">人</p>
              </div>
              <div className="bg-white/10 rounded-xl p-2.5 text-center">
                <p className="text-white/50 text-[9px]">イベント</p>
                <p className="text-white text-lg font-bold">{data.eventCount}</p>
                <p className="text-white/40 text-[9px]">件</p>
              </div>
              <div className="bg-white/10 rounded-xl p-2.5 text-center">
                <p className="text-white/50 text-[9px]">グッズ</p>
                <p className="text-white text-lg font-bold">{data.goodsCount}</p>
                <p className="text-white/40 text-[9px]">点</p>
              </div>
            </div>

            {/* Top oshi */}
            {data.topOshiName && data.topOshiExpense > 0 && (
              <div className="bg-white/10 rounded-xl p-3 mb-3">
                <p className="text-white/50 text-[9px] mb-1">今月いちばん貢いだ推し</p>
                <div className="flex items-center justify-between">
                  <p className="text-white text-sm font-bold">{data.topOshiName}</p>
                  <p className="text-white text-sm font-bold">{fmt(data.topOshiExpense)}</p>
                </div>
              </div>
            )}

            {/* One word */}
            <div className="text-center py-2">
              <p className="text-white/70 text-xs italic leading-relaxed">
                「{oneWord}」
              </p>
            </div>

            {/* Oshi names */}
            <div className="flex flex-wrap justify-center gap-1 mb-3">
              {data.oshiNames.map((name, i) => (
                <span key={i} className="bg-white/15 text-white text-[10px] px-2 py-0.5 rounded-full">
                  {name}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div className="text-center pt-2 border-t border-white/10">
              <p className="text-white/30 text-[9px]">my-oshi.com</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-bold border border-white/20 text-white/70">
            閉じる
          </button>
          <button
            onClick={handleShare}
            disabled={sharing}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50"
            style={{ backgroundColor: data.themeColor }}
          >
            {sharing ? "処理中..." : "シェアする"}
          </button>
        </div>
      </div>
    </>
  );
}
