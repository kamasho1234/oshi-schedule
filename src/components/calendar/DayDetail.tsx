import type { OshiEvent, Oshi } from "@/types";
import { EventCard } from "@/components/calendar/EventCard";

interface DayDetailProps {
  date: string;
  events: OshiEvent[];
  oshiList: Oshi[];
  onEditEvent: (event: OshiEvent) => void;
  onAddEvent: () => void;
}

const DAY_NAMES = ["日", "月", "火", "水", "木", "金", "土"];

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const dow = DAY_NAMES[d.getDay()];
  return `${month}月${day}日(${dow})`;
}

export function DayDetail({
  date,
  events,
  oshiList,
  onEditEvent,
  onAddEvent,
}: DayDetailProps) {
  const oshiMap = new Map(oshiList.map((o) => [o.id, o.name]));

  const sorted = [...events].sort((a, b) => {
    if (a.isAllDay && !b.isAllDay) return -1;
    if (!a.isAllDay && b.isAllDay) return 1;
    return (a.startTime ?? "").localeCompare(b.startTime ?? "");
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-heading">
          {formatDateLabel(date)}
        </h3>
        <button
          onClick={onAddEvent}
          className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: "var(--text-heading)", color: "#fff" }}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>

      {sorted.length === 0 ? (
        <p className="text-center py-1 text-sub text-xs">
          予定はありません
        </p>
      ) : (
        <div className="space-y-1.5">
          {sorted.map((ev) => (
            <EventCard
              key={ev.id}
              event={ev}
              oshiName={ev.oshiId ? oshiMap.get(ev.oshiId) : undefined}
              onEdit={onEditEvent}
            />
          ))}
        </div>
      )}
    </div>
  );
}
