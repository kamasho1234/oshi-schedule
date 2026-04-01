"use client";

import type { Oshi } from "@/types";
import { getNextBirthday, getDaysBetween } from "@/lib/utils";

interface OshiBirthdayProps {
  oshiList: Oshi[];
}

interface BirthdayInfo {
  oshi: Oshi;
  nextDate: string;
  daysLeft: number;
}

export function OshiBirthday({ oshiList }: OshiBirthdayProps) {
  const birthdayList: BirthdayInfo[] = oshiList
    .filter((o) => o.birthday)
    .map((o) => {
      const nextDate = getNextBirthday(o.birthday!);
      const daysLeft = getDaysBetween(nextDate);
      return { oshi: o, nextDate, daysLeft };
    })
    .filter((b) => b.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  if (birthdayList.length === 0) return null;

  const nearest = birthdayList[0];

  return (
    <section className="space-y-2">
      <div className="bg-card backdrop-blur-sm rounded-xl p-3 border border-card flex items-center gap-3">
        {/* Birthday icon */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
          style={{ backgroundColor: "var(--color-primary-light)" }}
        >
          🎂
        </div>
        {/* Name + date */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-heading truncate">
            {nearest.oshi.name}
          </p>
          <p className="text-xs text-dim">
            {nearest.nextDate.slice(5).replace("-", "/")}
          </p>
        </div>
        {/* Countdown */}
        <div className="text-center shrink-0">
          {nearest.daysLeft === 0 ? (
            <span
              className="text-sm font-bold"
              style={{ color: "var(--color-primary)" }}
            >
              今日!
            </span>
          ) : (
            <span
              className="text-xs font-bold"
              style={{ color: "var(--color-primary)" }}
            >
              あと{nearest.daysLeft}日!
            </span>
          )}
        </div>
      </div>

      {birthdayList.length > 1 &&
        birthdayList.slice(1, 4).map((b) => (
          <div
            key={b.oshi.id}
            className="bg-card backdrop-blur-sm rounded-xl p-3 border border-card flex items-center gap-3"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
              style={{ backgroundColor: "var(--color-primary-light)" }}
            >
              🎂
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-heading truncate">
                {b.oshi.name}
              </p>
              <p className="text-xs text-dim">
                {b.nextDate.slice(5).replace("-", "/")}
              </p>
            </div>
            <span
              className="text-xs font-bold shrink-0"
              style={{ color: "var(--color-primary)" }}
            >
              あと{b.daysLeft}日!
            </span>
          </div>
        ))}
    </section>
  );
}
