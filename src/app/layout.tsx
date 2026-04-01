import type { Metadata, Viewport } from "next";
import { BottomNav } from "@/components/layout/BottomNav";
import { ThemeInitializer } from "@/components/layout/ThemeInitializer";
import { ServiceWorkerRegister } from "@/components/layout/ServiceWorkerRegister";
import { GlobalBackground } from "@/components/layout/GlobalBackground";
import { SeedData } from "@/components/layout/SeedData";
import { SwipeNavigation } from "@/components/layout/SwipeNavigation";
import { OnboardingGuide } from "@/components/layout/OnboardingGuide";
import { RegisterPromptProvider } from "@/components/layout/RegisterPrompt";
import { AuthInitializer } from "@/components/layout/AuthInitializer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "推し活スケジュール帳 | my-oshi.com",
    template: "%s | 推し活スケジュール帳",
  },
  description: "推しのスケジュール・グッズ・出費をまとめて管理。推し活のすべてをあなた色に。",
  metadataBase: new URL("https://my-oshi.com"),
  manifest: "/manifest.json",
  openGraph: {
    title: "推し活スケジュール帳",
    description: "推しのスケジュール・グッズ・出費をまとめて管理。推し活のすべてをあなた色に。",
    url: "https://my-oshi.com",
    siteName: "推し活スケジュール帳",
    locale: "ja_JP",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  verification: {
    google: "8YyCmswQ_VONcm1oQv_qJ2rpqKEzYYPhp1kFHmNGWdI",
  },
  twitter: {
    card: "summary_large_image",
    title: "推し活スケジュール帳",
    description: "推しのスケジュール・グッズ・出費をまとめて管理",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "推しスケ",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ec4899",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700&family=Noto+Serif+JP:wght@400;500;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">
        <RegisterPromptProvider>
          <AuthInitializer />
          <ThemeInitializer />
          <SeedData />
          <ServiceWorkerRegister />
          <GlobalBackground />
          <OnboardingGuide />
          <div className="relative z-10">
            <SwipeNavigation>
              {children}
            </SwipeNavigation>
            <BottomNav />
          </div>
        </RegisterPromptProvider>
      </body>
    </html>
  );
}
