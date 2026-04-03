import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

function getLevel(expense: number): string {
  if (expense >= 100000) return "推しに人生捧げし者";
  if (expense >= 50000) return "推し活の覇者";
  if (expense >= 30000) return "推し活ガチ勢";
  if (expense >= 10000) return "推し活エンジョイ勢";
  if (expense > 0) return "推し活ビギナー";
  return "推し活はじめました";
}

export async function GET(req: NextRequest) {
  try {
    const fontData = await fetch(
      "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&display=swap"
    ).then((r) => r.text())
     .then((css) => {
       const match = css.match(/src: url\((.+?)\)/);
       return match ? fetch(match[1]).then((r) => r.arrayBuffer()) : null;
     });

    const sp = req.nextUrl.searchParams;
    const month = sp.get("month") || "";
    const expense = parseInt(sp.get("expense") || "0", 10);
    const oshiCount = parseInt(sp.get("oshiCount") || "0", 10);
    const eventCount = parseInt(sp.get("eventCount") || "0", 10);
    const goodsCount = parseInt(sp.get("goodsCount") || "0", 10);
    const topOshi = sp.get("topOshi") || "";
    const color = sp.get("color") || "#ec4899";
    const level = getLevel(expense);
    const hasData = expense > 0 || oshiCount > 0 || eventCount > 0 || goodsCount > 0;

    const element = (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: `linear-gradient(135deg, ${color}, #1a1a2e)`,
          fontFamily: "Noto Sans JP, sans-serif",
          padding: "40px",
        }}
      >
        <div style={{ display: "flex", color: "rgba(255,255,255,0.5)", fontSize: "20px", marginBottom: "8px" }}>
          {month || "推し活スケジュール帳"}
        </div>
        <div style={{ display: "flex", color: "#fff", fontSize: "36px", fontWeight: 700, marginBottom: "16px" }}>
          {hasData ? "推し活レポート" : "推しで、埋め尽くせ。"}
        </div>
        <div
          style={{
            display: "flex",
            background: "rgba(255,255,255,0.2)",
            color: "#fff",
            fontSize: "22px",
            fontWeight: 700,
            padding: "10px 32px",
            borderRadius: "999px",
            marginBottom: "32px",
          }}
        >
          {level}
        </div>
        {hasData ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "rgba(255,255,255,0.1)",
                borderRadius: "20px",
                padding: "24px 60px",
                marginBottom: "24px",
              }}
            >
              <div style={{ display: "flex", color: "rgba(255,255,255,0.5)", fontSize: "16px" }}>今月の推し活費</div>
              <div style={{ display: "flex", color: "#fff", fontSize: "72px", fontWeight: 700, marginTop: "8px" }}>
                {`¥${expense.toLocaleString()}`}
              </div>
            </div>
            <div style={{ display: "flex", gap: "20px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(255,255,255,0.1)", borderRadius: "16px", padding: "16px 32px" }}>
                <div style={{ display: "flex", color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>推し</div>
                <div style={{ display: "flex", color: "#fff", fontSize: "36px", fontWeight: 700 }}>{String(oshiCount)}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(255,255,255,0.1)", borderRadius: "16px", padding: "16px 32px" }}>
                <div style={{ display: "flex", color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>イベント</div>
                <div style={{ display: "flex", color: "#fff", fontSize: "36px", fontWeight: 700 }}>{String(eventCount)}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(255,255,255,0.1)", borderRadius: "16px", padding: "16px 32px" }}>
                <div style={{ display: "flex", color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>グッズ</div>
                <div style={{ display: "flex", color: "#fff", fontSize: "36px", fontWeight: 700 }}>{String(goodsCount)}</div>
              </div>
            </div>
            {topOshi && (
              <div style={{ display: "flex", color: "rgba(255,255,255,0.6)", fontSize: "18px", marginTop: "20px" }}>
                {`いちばん貢いだ推し: ${topOshi}`}
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ display: "flex", color: "rgba(255,255,255,0.6)", fontSize: "20px" }}>
              推しのスケジュール・グッズ・出費をまとめて管理
            </div>
          </div>
        )}
        <div style={{ display: "flex", color: "rgba(255,255,255,0.3)", fontSize: "16px", marginTop: "32px" }}>
          my-oshi.com
        </div>
      </div>
    );

    const options: { width: number; height: number; fonts?: { name: string; data: ArrayBuffer; weight: 400 | 700; style: "normal" }[] } = {
      width: 1200,
      height: 630,
    };

    if (fontData) {
      options.fonts = [
        { name: "Noto Sans JP", data: fontData, weight: 700, style: "normal" as const },
      ];
    }

    return new ImageResponse(element, options);
  } catch (e) {
    return new Response(`OG image error: ${e instanceof Error ? e.message : "unknown"}`, { status: 500 });
  }
}
