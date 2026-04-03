"use client";

import { useRouter } from "next/navigation";
import { AuthButton } from "./AuthButton";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  action?: React.ReactNode;
}

export function Header({ title, showBack, action }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 bg-header border-b border-divider" style={{ backdropFilter: "var(--backdrop-blur)" }}>
      <div className="max-w-lg mx-auto flex items-center h-14 px-4">
        <div className="flex items-center gap-1 mr-2">
          {showBack && (
            <button
              onClick={() => router.back()}
              style={{ color: "var(--header-text)", opacity: 0.7 }}
              aria-label="戻る"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <AuthButton />
        </div>
        <h1 className="text-lg font-bold flex-1" style={{ color: "var(--header-text)" }}>{title}</h1>
        {action && <div>{action}</div>}
      </div>
    </header>
  );
}
