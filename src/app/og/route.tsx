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

function getOneWord(expense: number, oshiCount: number): string {
  if (expense >= 100000) return "推しのために生きている。後悔はない。";
  if (expense >= 50000) return "財布が軽い。でも心は満たされている。";
  if (expense >= 30000) return "推しが元気なら、それでいい。";
  if (expense >= 10000) return "推し活は最高の自己投資。";
  if (expense > 0) return "推し活、始めました。";
  if (oshiCount > 0) return "推しとの日々が始まる。";
  return "推しで、埋め尽くせ。";
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const month = sp.get("month") || new Date().getFullYear() + "年" + (new Date().getMonth() + 1) + "月";
  const expense = parseInt(sp.get("expense") || "0", 10);
  const oshiCount = parseInt(sp.get("oshiCount") || "0", 10);
  const eventCount = parseInt(sp.get("eventCount") || "0", 10);
  const goodsCount = parseInt(sp.get("goodsCount") || "0", 10);
  const topOshi = sp.get("topOshi") || "";
  const topExpense = parseInt(sp.get("topExpense") || "0", 10);
  const names = sp.get("names") || "";
  const color = sp.get("color") || "#ec4899";

  const level = getLevel(expense);
  const oneWord = getOneWord(expense, oshiCount);
  const dailyAvg = expense > 0 ? Math.round(expense / 30) : 0;
  const isEmpty = expense === 0 && oshiCount === 0 && eventCount === 0 && goodsCount === 0;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: `linear-gradient(135deg, ${color}ee, ${color}88, #1a1a2e)`,
          fontFamily: "sans-serif",
          padding: "40px",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "20px" }}>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "18px" }}>{month}</div>
          <div style={{ color: "#fff", fontSize: "32px", fontWeight: 700, marginTop: "4px" }}>推し活レポート</div>
        </div>

        {/* Level */}
        <div style={{
          display: "flex",
          background: "rgba(255,255,255,0.2)",
          color: "#fff",
          fontSize: "20px",
          fontWeight: 700,
          padding: "8px 24px",
          borderRadius: "999px",
          marginBottom: "24px",
        }}>
          {level}
        </div>

        {isEmpty ? (
          /* データなしの場合 */
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "20px",
            padding: "30px 60px",
            marginBottom: "20px",
          }}>
            <div style={{ color: "#fff", fontSize: "36px", fontWeight: 800 }}>推しで、埋め尽くせ。</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "18px", marginTop: "12px" }}>
              推し活のすべてをあなた色に
            </div>
          </div>
        ) : (
          /* データありの場合 */
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {/* Main expense */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "20px",
              padding: "20px 60px",
              marginBottom: "20px",
            }}>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>今月の推し活費</div>
              <div style={{ color: "#fff", fontSize: "64px", fontWeight: 800, marginTop: "4px" }}>
                ¥{expense.toLocaleString()}
              </div>
              {dailyAvg > 0 && (
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", marginTop: "4px" }}>
                  1日あたり ¥{dailyAvg.toLocaleString()}
                </div>
              )}
            </div>

            {/* Stats row */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
              {[
                { label: "推し", value: oshiCount, unit: "人" },
                { label: "イベント", value: eventCount, unit: "件" },
                { label: "グッズ", value: goodsCount, unit: "点" },
              ].map((s) => (
                <div key={s.label} style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "16px",
                  padding: "12px 24px",
                  minWidth: "100px",
                }}>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>{s.label}</div>
                  <div style={{ color: "#fff", fontSize: "32px", fontWeight: 700 }}>{s.value}</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>{s.unit}</div>
                </div>
              ))}
            </div>

            {/* Top oshi */}
            {topOshi && topExpense > 0 && (
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "rgba(255,255,255,0.1)",
                borderRadius: "16px",
                padding: "12px 24px",
                width: "400px",
                marginBottom: "16px",
              }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px" }}>いちばん貢いだ推し</div>
                  <div style={{ color: "#fff", fontSize: "20px", fontWeight: 700 }}>{topOshi}</div>
                </div>
                <div style={{ color: "#fff", fontSize: "20px", fontWeight: 700 }}>¥{topExpense.toLocaleString()}</div>
              </div>
            )}
          </div>
        )}

        {/* One word */}
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "16px", fontStyle: "italic", marginBottom: "16px" }}>
          「{oneWord}」
        </div>

        {/* Names */}
        {names && (
          <div style={{ display: "flex", gap: "8px" }}>
            {names.split(",").filter(Boolean).map((n) => (
              <div key={n} style={{
                background: "rgba(255,255,255,0.15)",
                color: "#fff",
                fontSize: "14px",
                padding: "4px 12px",
                borderRadius: "999px",
              }}>
                {n}
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{ position: "absolute", bottom: "20px", color: "rgba(255,255,255,0.3)", fontSize: "14px" }}>
          my-oshi.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
