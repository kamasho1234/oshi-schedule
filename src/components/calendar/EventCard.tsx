"use client";

import { useState } from "react";
import type { OshiEvent } from "@/types";
import {
  EVENT_CATEGORY_LABELS,
  EVENT_CATEGORY_COLORS,
} from "@/lib/constants";

interface EventCardProps {
  event: OshiEvent;
  oshiName?: string;
  onEdit: (event: OshiEvent) => void;
}

export function EventCard({ event, oshiName, onEdit }: EventCardProps) {
  const [expanded, setExpanded] = useState(false);
  const categoryColor = EVENT_CATEGORY_COLORS[event.category];
  const categoryLabel = EVENT_CATEGORY_LABELS[event.category];

  const timeLabel = event.isAllDay
    ? "終日"
    : [event.startTime, event.endTime].filter(Boolean).join(" ~ ");

  return (
    <div
      className="rounded-lg overflow-hidden border border-white/20 bg-white/40 backdrop-blur-sm transition-all"
      style={{ borderLeft: `3px solid ${categoryColor}` }}
    >
      {/* タップでプレビュー展開 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-3 py-2"
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-bold text-heading leading-tight flex-1">
            {event.title}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded"
              style={{ background: `${categoryColor}20`, color: categoryColor }}
            >
              {categoryLabel}
            </span>
            <svg
              className="w-3 h-3 text-sub transition-transform"
              style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
              fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1 text-xs text-sub">
          {timeLabel && <span>{timeLabel}</span>}
          {event.location && (
            <>
              <span className="text-sub/40">|</span>
              <span>{event.location}</span>
            </>
          )}
        </div>
      </button>

      {/* 展開時のプレビュー詳細 */}
      {expanded && (
        <div className="px-3 pb-2 space-y-1.5 border-t border-white/20 pt-2">
          {oshiName && (
            <p className="text-xs text-heading font-medium flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {oshiName}
            </p>
          )}

          {event.url && (
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 underline flex items-center gap-1 break-all"
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              {event.url}
            </a>
          )}

          {event.memo && (
            <p className="text-xs text-sub">{event.memo}</p>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(event);
            }}
            className="text-xs font-medium px-3 py-1 rounded-full"
            style={{ background: "var(--text-heading)", color: "#fff" }}
          >
            編集
          </button>
        </div>
      )}
    </div>
  );
}
