"use client";

import type { OshiEvent, EventCategory } from "@/types";
import { getToday, getDaysInMonth, getFirstDayOfWeek } from "@/lib/utils";
import { EVENT_CATEGORY_COLORS } from "@/lib/constants";

interface CalendarGridProps {
  events: OshiEvent[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  year: number;
  month: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

export function CalendarGrid({
  events,
  selectedDate,
  onSelectDate,
  year,
  month,
  onPrevMonth,
  onNextMonth,
}: CalendarGridProps) {
  const today = getToday();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);

  // Build event map: dateStr -> category colors
  const eventMap = new Map<string, string[]>();
  for (const ev of events) {
    const colors = eventMap.get(ev.date) || [];
    const color = EVENT_CATEGORY_COLORS[ev.category as EventCategory];
    if (!colors.includes(color)) {
      colors.push(color);
    }
    eventMap.set(ev.date, colors);
  }

  // Build calendar cells
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d);
  }
  // Fill remaining to complete the last row
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  const monthLabel = `${year}年${month + 1}月`;

  function dateStr(day: number): string {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  return (
    <div className="bg-card radius-card shadow-themed border border-divider overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-divider">
        <button
          onClick={onPrevMonth}
          className="p-1 rounded-full hover:bg-[var(--bg-input)] transition-colors text-sub"
          aria-label="前月"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-sm font-bold text-heading">{monthLabel}</h2>
        <button
          onClick={onNextMonth}
          className="p-1 rounded-full hover:bg-[var(--bg-input)] transition-colors text-sub"
          aria-label="次月"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Weekday row */}
      <div className="grid grid-cols-7 border-b border-divider">
        {WEEKDAYS.map((w, i) => (
          <div
            key={w}
            className={`text-center text-[10px] font-medium py-1 ${
              i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-dim"
            }`}
          >
            {w}
          </div>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7">
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="aspect-square" />;
          }

          const ds = dateStr(day);
          const isToday = ds === today;
          const isSelected = ds === selectedDate;
          const dayOfWeek = idx % 7;
          const dotColors = (eventMap.get(ds) || []).slice(0, 3);

          return (
            <button
              key={ds}
              onClick={() => onSelectDate(ds)}
              className={`aspect-square flex flex-col items-center justify-center relative transition-colors ${
                isSelected ? "" : "hover:bg-[var(--bg-input)]"
              }`}
            >
              <span
                className={`text-xs leading-none flex items-center justify-center w-6 h-6 rounded-full ${
                  isSelected
                    ? "bg-[var(--color-primary)] text-white font-bold"
                    : isToday
                      ? "ring-2 ring-[var(--color-primary)] font-bold text-heading"
                      : dayOfWeek === 0
                        ? "text-red-400"
                        : dayOfWeek === 6
                          ? "text-blue-400"
                          : "text-body"
                }`}
              >
                {day}
              </span>
              {/* Event dots */}
              {dotColors.length > 0 && (
                <div className="flex gap-0.5 mt-0.5">
                  {dotColors.map((color) => (
                    <span
                      key={color}
                      className="w-1 h-1 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
