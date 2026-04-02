"use client";

import { useState, useRef, useCallback } from "react";
import html2canvas from "html2canvas";

interface ShareCardData {
  oshiNames: string[];
  eventCount: number;
  goodsCount: number;
  monthlyExpense: number;
  themeColor: string;
  month: string; // "2026年4月"
}

interface ShareCardProps {
  data: ShareCardData;
  onClose: () => void;
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
        // Web Share API非対応の場合はダウンロード
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "oshi-katsu-summary.png";
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      // ユーザーがシェアをキャンセルした場合
    } finally {
      setSharing(false);
    }
  };

  const formatYen = (n: number) => "¥" + n.toLocaleString();

  return (
    <>
      <div className="fixed inset-0 z-[90] bg-black/50" onClick={onClose} />
      <div className="fixed inset-x-4 top-[10%] z-[100] max-w-sm mx-auto animate-fade-in">
        {/* カード本体（キャプチャ対象） */}
        <div
          ref={cardRef}
          className="rounded-2xl overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${data.themeColor}dd, ${data.themeColor}88, #1a1a2e)` }}
        >
          <div className="p-6">
            {/* Header */}
            <div className="text-center mb-5">
              <p className="text-white/60 text-xs tracking-widest mb-1">MY OSHI ACTIVITY</p>
              <p className="text-white text-lg font-bold">{data.month}の推し活まとめ</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
                <p className="text-white/60 text-[10px] mb-1">イベント</p>
                <p className="text-white text-2xl font-extrabold">{data.eventCount}</p>
                <p className="text-white/50 text-[10px]">件</p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
                <p className="text-white/60 text-[10px] mb-1">グッズ</p>
                <p className="text-white text-2xl font-extrabold">{data.goodsCount}</p>
                <p className="text-white/50 text-[10px]">点</p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center col-span-2">
                <p className="text-white/60 text-[10px] mb-1">推し活費</p>
                <p className="text-white text-3xl font-extrabold">{formatYen(data.monthlyExpense)}</p>
              </div>
            </div>

            {/* Oshi names */}
            <div className="text-center mb-4">
              <p className="text-white/50 text-[10px] mb-1.5">応援中</p>
              <div className="flex flex-wrap justify-center gap-1.5">
                {data.oshiNames.map((name, i) => (
                  <span key={i} className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                    {name}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-3 border-t border-white/10">
              <p className="text-white/40 text-[10px]">my-oshi.com</p>
            </div>
          </div>
        </div>

        {/* Actions（キャプチャ対象外） */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold border border-white/20 text-white/70"
          >
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
