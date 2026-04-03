import type { Metadata } from "next";
import Link from "next/link";

interface SharePageProps {
  searchParams: Promise<{
    month?: string;
    expense?: string;
    oshiCount?: string;
    eventCount?: string;
    goodsCount?: string;
    topOshi?: string;
    topExpense?: string;
    names?: string;
    color?: string;
  }>;
}

function getLevel(expense: number): string {
  if (expense >= 100000) return "推しに人生捧げし者";
  if (expense >= 50000) return "推し活の覇者";
  if (expense >= 30000) return "推し活ガチ勢";
  if (expense >= 10000) return "推し活エンジョイ勢";
  return "推し活ビギナー";
}

export async function generateMetadata({ searchParams }: SharePageProps): Promise<Metadata> {
  const sp = await searchParams;
  const expense = parseInt(sp.expense || "0", 10);
  const month = sp.month || "";
  const level = getLevel(expense);

  const title = `${month}の推し活レポート｜${level}`;
  const description = `推し活費 ¥${expense.toLocaleString()} - 推し活スケジュール帳 my-oshi.com`;

  const ogParams = new URLSearchParams();
  if (sp.month) ogParams.set("month", sp.month);
  if (sp.expense) ogParams.set("expense", sp.expense);
  if (sp.oshiCount) ogParams.set("oshiCount", sp.oshiCount);
  if (sp.eventCount) ogParams.set("eventCount", sp.eventCount);
  if (sp.goodsCount) ogParams.set("goodsCount", sp.goodsCount);
  if (sp.topOshi) ogParams.set("topOshi", sp.topOshi);
  if (sp.topExpense) ogParams.set("topExpense", sp.topExpense);
  if (sp.names) ogParams.set("names", sp.names);
  if (sp.color) ogParams.set("color", sp.color);

  const ogImageUrl = `https://my-oshi.com/api/og?${ogParams.toString()}`;

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
  const expense = parseInt(sp.expense || "0", 10);
  const month = sp.month || "";
  const level = getLevel(expense);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 px-4 py-12">
      <div className="text-center max-w-md">
        <p className="text-white/50 text-sm mb-2">{month}</p>
        <h1 className="text-2xl font-bold text-white mb-2">推し活レポート</h1>
        <p className="text-lg font-bold text-pink-400 mb-1">{level}</p>
        <p className="text-3xl font-extrabold text-white mb-6">¥{expense.toLocaleString()}</p>

        <Link
          href="/dashboard"
          className="inline-block bg-pink-500 text-white font-bold px-8 py-3 rounded-xl text-sm hover:bg-pink-600 transition-colors"
        >
          推し活スケジュール帳を始める
        </Link>

        <p className="text-white/30 text-xs mt-6">my-oshi.com</p>
      </div>
    </div>
  );
}
