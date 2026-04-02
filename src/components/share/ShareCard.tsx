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

  const downloadImage = async (): Promise<string | null> => {
    const blob = await generateImage();
    if (!blob) return null;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "oshi-katsu-summary.png";
    a.click();
    return url;
  };

  const shareText = `${data.month}の推し活まとめ｜${level.title}\n推し活費: ${fmt(data.monthlyExpense)}\n#推し活 #推し活スケジュール帳\nhttps://my-oshi.com`;

  const handleX = async () => {
    setSharing(true);
    await downloadImage();
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank");
    setSharing(false);
  };

  const handleLine = async () => {
    setSharing(true);
    await downloadImage();
    window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent("https://my-oshi.com")}&text=${encodeURIComponent(shareText)}`, "_blank");
    setSharing(false);
  };

  const handleInstagram = async () => {
    setSharing(true);
    await downloadImage();
    alert("画像をダウンロードしました。Instagramアプリで画像を選択して投稿してください。");
    setSharing(false);
  };

  const handleDownload = async () => {
    setSharing(true);
    await downloadImage();
    setSharing(false);
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

        {/* SNS Buttons */}
        <div className="mt-3 space-y-2">
          <div className="flex gap-2">
            {/* X (Twitter) */}
            <button
              onClick={handleX}
              disabled={sharing}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50"
              style={{ backgroundColor: "#000000" }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              X
            </button>
            {/* LINE */}
            <button
              onClick={handleLine}
              disabled={sharing}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50"
              style={{ backgroundColor: "#06C755" }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
              </svg>
              LINE
            </button>
            {/* Instagram */}
            <button
              onClick={handleInstagram}
              disabled={sharing}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50"
              style={{ background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)" }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
              Insta
            </button>
          </div>
          <div className="flex gap-2">
            {/* Download */}
            <button
              onClick={handleDownload}
              disabled={sharing}
              className="flex-1 py-2 rounded-xl text-xs font-bold border border-white/20 text-white/60 disabled:opacity-50"
            >
              画像を保存
            </button>
            {/* Close */}
            <button onClick={onClose} className="flex-1 py-2 rounded-xl text-xs font-bold border border-white/20 text-white/60">
              閉じる
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
