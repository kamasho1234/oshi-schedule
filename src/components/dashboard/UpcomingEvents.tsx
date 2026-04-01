"use client";

import { useState } from "react";
import type { OshiEvent, Oshi } from "@/types";
import { formatDate, getToday, getDaysBetween } from "@/lib/utils";
import { EVENT_CATEGORY_COLORS, EVENT_CATEGORY_LABELS } from "@/lib/constants";
import type { EventCategory } from "@/types";

interface UpcomingEventsProps {
  events: OshiEvent[];
  oshiList?: Oshi[];
}

interface UpcomingItem {
  id: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  memo?: string;
  category?: string;
  oshiName?: string;
  dotColor: string;
  isBirthday?: boolean;
}

export function UpcomingEvents({ events, oshiList = [] }: UpcomingEventsProps) {
  const today = getToday();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const thirtyDaysLater = new Date();
  thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
  const limitStr = `${thirtyDaysLater.getFullYear()}-${String(thirtyDaysLater.getMonth() + 1).padStart(2, "0")}-${String(thirtyDaysLater.getDate()).padStart(2, "0")}`;

  const upcomingEvents: UpcomingItem[] = events
    .filter((e) => e.date >= today && e.date <= limitStr)
    .map((e) => {
      const oshi = e.oshiId ? oshiList.find((o) => o.id === e.oshiId) : undefined;
      return {
        id: e.id,
        title: e.title,
        date: e.date,
        startTime: e.startTime,
        endTime: e.endTime,
        location: e.location,
        memo: e.memo,
        category: e.category,
        oshiName: oshi?.name,
        dotColor: EVENT_CATEGORY_COLORS[e.category] || "#6b7280",
      };
    });

  const currentYear = new Date().getFullYear();
  const birthdayEvents: UpcomingItem[] = oshiList
    .filter((o) => o.birthday)
    .map((o) => {
      const mmdd = o.birthday!.slice(5);
      let bdayDate = `${currentYear}-${mmdd}`;
      if (bdayDate < today) bdayDate = `${currentYear + 1}-${mmdd}`;
      return {
        id: `bday_${o.id}`,
        title: `${o.name} 誕生日`,
        date: bdayDate,
        dotColor: o.themeColor || "#ec4899",
        isBirthday: true,
        oshiName: o.name,
      };
    })
    .filter((b) => b.date >= today && b.date <= limitStr);

  const allUpcoming = [...upcomingEvents, ...birthdayEvents]
    .sort((a, b) => a.date.localeCompare(b.date));

  if (allUpcoming.length === 0) {
    return (
      <section className="space-y-2">
        <div className="bg-card backdrop-blur-sm rounded-xl p-3 border border-card">
          <p className="text-sm text-dim text-center py-2">
            直近の予定はありません
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-2">
      {allUpcoming.map((event) => {
        const days = getDaysBetween(event.date);
        const dayLabel =
          days === 0 ? "今日!" : days === 1 ? "明日!" : `あと${days}日!`;
        const isExpanded = expandedId === event.id;

        return (
          <div
            key={event.id}
            className="bg-card backdrop-blur-sm rounded-xl border border-card overflow-hidden"
          >
            <button
              onClick={() => setExpandedId(isExpanded ? null : event.id)}
              className="w-full text-left p-3 flex items-center gap-3"
            >
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: event.dotColor }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-heading truncate">
                  {event.title}
                </p>
                <p className="text-xs text-sub truncate">
                  {formatDate(event.date).slice(5)}
                  {event.location ? ` / ${event.location}` : ""}
                  {event.startTime ? ` ${event.startTime}〜` : ""}
                </p>
              </div>
              <span className="text-xs font-bold shrink-0 text-heading">
                {dayLabel}
              </span>
              <svg
                className="w-3 h-3 text-sub shrink-0 transition-transform"
                style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
                fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isExpanded && (
              <div className="px-3 pb-3 pt-1 border-t border-divider space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-sub">
                  <span className="font-medium text-heading">{formatDate(event.date)}</span>
                  {event.startTime && (
                    <span>{event.startTime}{event.endTime ? `〜${event.endTime}` : "〜"}</span>
                  )}
                </div>
                {event.category && !event.isBirthday && (
                  <p className="text-xs text-sub">
                    <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ backgroundColor: event.dotColor }} />
                    {EVENT_CATEGORY_LABELS[event.category as EventCategory] || event.category}
                  </p>
                )}
                {event.location && (
                  <p className="text-xs text-sub">📍 {event.location}</p>
                )}
                {event.oshiName && (
                  <p className="text-xs text-sub">推し: {event.oshiName}</p>
                )}
                {event.memo && (
                  <p className="text-xs text-sub whitespace-pre-wrap">{event.memo}</p>
                )}
                {event.isBirthday && (
                  <p className="text-xs text-sub">🎂 お誕生日おめでとう！</p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
