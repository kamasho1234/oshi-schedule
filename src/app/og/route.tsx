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

async function loadFont(): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch("https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700;900&display=swap", {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    const css = await res.text();
    const match = css.match(/src: url\((.+?)\)/);
    if (!match) return null;
    const fontRes = await fetch(match[1]);
    return fontRes.arrayBuffer();
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const fontData = await loadFont();

    const sp = req.nextUrl.searchParams;
    const month = sp.get("month") || "";
    const expense = parseInt(sp.get("expense") || "0", 10);
    const oshiCount = parseInt(sp.get("oshiCount") || "0", 10);
    const eventCount = parseInt(sp.get("eventCount") || "0", 10);
    const goodsCount = parseInt(sp.get("goodsCount") || "0", 10);
    const topOshi = sp.get("topOshi") || "";
    const names = sp.get("names") || "";
    const color = sp.get("color") || "#ec4899";
    const level = getLevel(expense);
    const nameList = names.split(",").filter(Boolean);
    const hasData = expense > 0 || oshiCount > 0 || eventCount > 0 || goodsCount > 0;

    const element = (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "row",
          background: "#0a0a0f",
          fontFamily: "Noto Sans JP, sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Left: gradient accent bar */}
        <div
          style={{
            width: "8px",
            height: "630px",
            display: "flex",
            background: `linear-gradient(180deg, ${color}, #6366f1, ${color})`,
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "48px 56px",
            position: "relative",
          }}
        >
          {/* Background decorative circles */}
          <div
            style={{
              display: "flex",
              position: "absolute",
              top: "-80px",
              right: "-80px",
              width: "320px",
              height: "320px",
              borderRadius: "160px",
              background: `${color}15`,
            }}
          />
          <div
            style={{
              display: "flex",
              position: "absolute",
              bottom: "-60px",
              right: "200px",
              width: "200px",
              height: "200px",
              borderRadius: "100px",
              background: `${color}10`,
            }}
          />

          {/* Top: month + logo */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div style={{ display: "flex", color: "rgba(255,255,255,0.4)", fontSize: "16px" }}>
              {month || "my-oshi.com"}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  display: "flex",
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  background: `linear-gradient(135deg, ${color}, #6366f1)`,
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 900,
                }}
              >
                M
              </div>
              <div style={{ display: "flex", color: "rgba(255,255,255,0.3)", fontSize: "14px" }}>my-oshi.com</div>
            </div>
          </div>

          {/* Oshi names - hero section */}
          <div style={{ display: "flex", flexDirection: "column", marginBottom: "28px" }}>
            {nameList.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", color: `${color}`, fontSize: "14px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase" as const, marginBottom: "4px" }}>
                  MY OSHI
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "baseline" }}>
                  {nameList.slice(0, 4).map((name, i) => (
                    <div
                      key={String(i)}
                      style={{
                        display: "flex",
                        color: "#fff",
                        fontSize: nameList.length === 1 ? "56px" : nameList.length <= 2 ? "44px" : "36px",
                        fontWeight: 900,
                        letterSpacing: "-1px",
                      }}
                    >
                      {name}
                    </div>
                  ))}
                  {nameList.length > 4 && (
                    <div style={{ display: "flex", color: "rgba(255,255,255,0.4)", fontSize: "24px", fontWeight: 700 }}>
                      {`+${nameList.length - 4}`}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", color: "#fff", fontSize: "48px", fontWeight: 900, letterSpacing: "-1px" }}>
                  推し活スケジュール帳
                </div>
              </div>
            )}
          </div>

          {/* Level badge */}
          <div style={{ display: "flex", marginBottom: "28px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: `linear-gradient(135deg, ${color}30, ${color}10)`,
                border: `1px solid ${color}40`,
                padding: "8px 20px",
                borderRadius: "999px",
              }}
            >
              <div style={{ display: "flex", color: `${color}`, fontSize: "18px", fontWeight: 700 }}>
                {level}
              </div>
            </div>
          </div>

          {/* Stats */}
          {hasData ? (
            <div style={{ display: "flex", gap: "16px", marginTop: "auto" }}>
              {expense > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "16px",
                    padding: "16px 24px",
                  }}
                >
                  <div style={{ display: "flex", color: "rgba(255,255,255,0.4)", fontSize: "12px", marginBottom: "4px" }}>推し活費</div>
                  <div style={{ display: "flex", color: "#fff", fontSize: "32px", fontWeight: 900 }}>{`¥${expense.toLocaleString()}`}</div>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  alignItems: "flex-end",
                }}
              >
                {oshiCount > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 20px" }}>
                    <div style={{ display: "flex", color: "rgba(255,255,255,0.4)", fontSize: "11px", marginBottom: "4px" }}>推し</div>
                    <div style={{ display: "flex", color: "#fff", fontSize: "28px", fontWeight: 700 }}>{String(oshiCount)}</div>
                  </div>
                )}
                {eventCount > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 20px" }}>
                    <div style={{ display: "flex", color: "rgba(255,255,255,0.4)", fontSize: "11px", marginBottom: "4px" }}>イベント</div>
                    <div style={{ display: "flex", color: "#fff", fontSize: "28px", fontWeight: 700 }}>{String(eventCount)}</div>
                  </div>
                )}
                {goodsCount > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 20px" }}>
                    <div style={{ display: "flex", color: "rgba(255,255,255,0.4)", fontSize: "11px", marginBottom: "4px" }}>グッズ</div>
                    <div style={{ display: "flex", color: "#fff", fontSize: "28px", fontWeight: 700 }}>{String(goodsCount)}</div>
                  </div>
                )}
              </div>
              {topOshi && (
                <div style={{ display: "flex", flexDirection: "column", padding: "16px 20px", marginLeft: "auto" }}>
                  <div style={{ display: "flex", color: "rgba(255,255,255,0.4)", fontSize: "11px", marginBottom: "4px" }}>いちばん貢いだ推し</div>
                  <div style={{ display: "flex", color: `${color}`, fontSize: "20px", fontWeight: 700 }}>{topOshi}</div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", marginTop: "auto" }}>
              <div style={{ display: "flex", color: "rgba(255,255,255,0.4)", fontSize: "18px" }}>
                推しのスケジュール・グッズ・出費をまとめて管理
              </div>
            </div>
          )}
        </div>
      </div>
    );

    return new ImageResponse(element, {
      width: 1200,
      height: 630,
      ...(fontData
        ? { fonts: [{ name: "Noto Sans JP", data: fontData, weight: 700 as const, style: "normal" as const }] }
        : {}),
    });
  } catch (e) {
    return new Response(`OG image error: ${e instanceof Error ? e.message : "unknown"}`, { status: 500 });
  }
}
