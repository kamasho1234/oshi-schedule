import type { Metadata } from "next";
import Link from "next/link";

interface SharePageProps {
  searchParams: Promise<{ d?: string }>;
}

interface ShareData {
  m?: string;
  e?: number;
  o?: number;
  v?: number;
  g?: number;
  t?: string;
  x?: number;
  n?: string;
  c?: string;
}

function decodeData(encoded: string | undefined): ShareData {
  if (!encoded) return {};
  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    return JSON.parse(json);
  } catch {
    return {};
  }
}

function getLevel(expense: number): string {
  if (expense >= 100000) return "推しに人生捧げし者";
  if (expense >= 50000) return "推し活の覇者";
  if (expense >= 30000) return "推し活ガチ勢";
  if (expense >= 10000) return "推し活エンジョイ勢";
  if (expense > 0) return "推し活ビギナー";
  return "推し活はじめました";
}

export async function generateMetadata({ searchParams }: SharePageProps): Promise<Metadata> {
  const sp = await searchParams;
  const d = decodeData(sp.d);
  const expense = d.e || 0;
  const month = d.m || "";
  const level = getLevel(expense);

  const title = expense > 0
    ? `${month}の推し活レポート｜${level}`
    : "推し活スケジュール帳";
  const description = expense > 0
    ? `推し活費 ¥${expense.toLocaleString()} - 推し活スケジュール帳 my-oshi.com`
    : "推しのスケジュール・グッズ・出費をまとめて管理 - my-oshi.com";

  const ogParams = new URLSearchParams();
  if (d.m) ogParams.set("month", d.m);
  if (d.e) ogParams.set("expense", String(d.e));
  if (d.o) ogParams.set("oshiCount", String(d.o));
  if (d.v) ogParams.set("eventCount", String(d.v));
  if (d.g) ogParams.set("goodsCount", String(d.g));
  if (d.t) ogParams.set("topOshi", d.t);
  if (d.x) ogParams.set("topExpense", String(d.x));
  if (d.n) ogParams.set("names", d.n);
  if (d.c) ogParams.set("color", d.c);

  const ogImageUrl = `https://my-oshi.com/og?${ogParams.toString()}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function SharePage({ searchParams }: SharePageProps) {
  const sp = await searchParams;
  const d = decodeData(sp.d);
  const expense = d.e || 0;
  const month = d.m || "";
  const level = getLevel(expense);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 px-4 py-12">
      <div className="text-center max-w-md">
        {month && <p className="text-white/50 text-sm mb-2">{month}</p>}
        <h1 className="text-2xl font-bold text-white mb-2">推し活レポート</h1>
        <p className="text-lg font-bold text-pink-400 mb-1">{level}</p>
        {expense > 0 && (
          <p className="text-3xl font-extrabold text-white mb-6">¥{expense.toLocaleString()}</p>
        )}
        <Link
          href="/"
          className="inline-block bg-pink-500 text-white font-bold px-8 py-3 rounded-xl text-sm hover:bg-pink-600 transition-colors"
        >
          推し活スケジュール帳を始める
        </Link>
        <p className="text-white/30 text-xs mt-6">my-oshi.com</p>
      </div>
    </div>
  );
}
