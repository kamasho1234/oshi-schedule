"use client";

import { useState, useMemo } from "react";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { DayDetail } from "@/components/calendar/DayDetail";
import { EventForm } from "@/components/calendar/EventForm";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useEvents } from "@/hooks/useEvents";
import { useOshi } from "@/hooks/useOshi";
import { AuthButton } from "@/components/layout/AuthButton";
import { getToday } from "@/lib/utils";
import type { OshiEvent } from "@/types";

export default function CalendarPage() {
  const today = getToday();
  const [year, setYear] = useState(() => parseInt(today.split("-")[0]));
  const [month, setMonth] = useState(() => parseInt(today.split("-")[1]) - 1);
  const [selectedDate, setSelectedDate] = useState<string | null>(today);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<OshiEvent | undefined>();

  const { items: events, loading: eventsLoading, add, edit, remove } = useEvents();
  const { items: oshiList } = useOshi();

  // Collect all oshi images for photo wall background
  const allImages = useMemo(() => {
    const imgs: string[] = [];
    for (const oshi of oshiList) {
      if (oshi.image) imgs.push(oshi.image);
      if (oshi.images) {
        for (const img of oshi.images) {
          imgs.push(img.data);
        }
      }
    }
    return imgs;
  }, [oshiList]);

  // Events for the current month (for dot display)
  const monthEvents = useMemo(() => {
    const prefix = `${year}-${String(month + 1).padStart(2, "0")}`;
    return events.filter((e) => e.date.startsWith(prefix));
  }, [events, year, month]);

  // Events for the selected date
  const dayEvents = useMemo(() => {
    if (!selectedDate) return [];
    return events.filter((e) => e.date === selectedDate);
  }, [events, selectedDate]);

  function handlePrevMonth() {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else {
      setMonth((m) => m - 1);
    }
  }

  function handleNextMonth() {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else {
      setMonth((m) => m + 1);
    }
  }

  function openAddModal() {
    setEditingEvent(undefined);
    setModalOpen(true);
  }

  function openEditModal(event: OshiEvent) {
    setEditingEvent(event);
    setModalOpen(true);
  }

  async function handleSave(event: OshiEvent) {
    if (editingEvent) {
      await edit(event);
    } else {
      await add(event);
    }
    setModalOpen(false);
    setEditingEvent(undefined);
  }

  async function handleDelete() {
    if (editingEvent) {
      await remove(editingEvent.id);
      setModalOpen(false);
      setEditingEvent(undefined);
    }
  }

  return (
    <div className="h-[100dvh] relative flex flex-col overflow-hidden pb-20">
      {/* Photo wall background */}
      {allImages.length > 0 && (
        <div className="fixed inset-0 opacity-80 z-0 overflow-hidden"><div className="grid grid-cols-3 gap-0" style={{ minHeight: "200vh" }}>
          {allImages.concat(allImages).concat(allImages).concat(allImages).concat(allImages).concat(allImages).slice(0, 60).map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="w-full block"
              style={{ objectFit: "cover" }}
              draggable={false}
            />
          ))}
          </div>
        </div>
      )}

      {/* Fallback bg when no images */}
      {allImages.length === 0 && (
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "linear-gradient(180deg, var(--color-primary-light, #fce7f3) 0%, var(--bg-page, #fff) 100%)",
          }}
        />
      )}

      {/* Fixed overlay */}
      <div className="fixed inset-0 z-[1]" style={{ background: "rgba(0,0,0,0.15)", pointerEvents: "none" }} />

      {/* Content layer */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header - matching dashboard */}
        <header
          className="shrink-0 backdrop-blur-md border-b border-white/20"
          style={{ background: "var(--bg-header)" }}
        >
          <div className="max-w-lg mx-auto flex items-center h-10 px-4">
            <div className="flex-1 flex justify-start">
              <AuthButton compact />
            </div>
            <h1 className="text-lg font-bold text-center" style={{ color: "var(--header-text)" }}>
              カレンダー
            </h1>
            <div className="flex-1 flex justify-end">
            <button onClick={openAddModal} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--header-accent-bg)" }}>
              <svg className="w-5 h-5" style={{ color: "var(--header-text)" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
            </div>
          </div>
        </header>

        {/* Scrollable content area */}
        <div
          className="flex-1 overflow-y-auto"
          
        >
          <div className="max-w-lg mx-auto px-3 py-3 space-y-2">
            {/* Calendar grid card */}
            <div className="bg-card backdrop-blur-sm rounded-xl border border-card overflow-hidden text-sm">
              <CalendarGrid
                events={monthEvents}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                year={year}
                month={month}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
              />
            </div>

            {/* Day detail card */}
            {selectedDate && (
              <div className="bg-card backdrop-blur-sm rounded-xl border border-card p-3">
                <DayDetail
                  date={selectedDate}
                  events={dayEvents}
                  oshiList={oshiList}
                  onEditEvent={openEditModal}
                  onAddEvent={openAddModal}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingEvent(undefined);
        }}
        title={editingEvent ? "イベントを編集" : "イベントを追加"}
      >
        <EventForm
          event={editingEvent}
          oshiList={oshiList}
          onSave={handleSave}
          onCancel={() => {
            setModalOpen(false);
            setEditingEvent(undefined);
          }}
          defaultDate={selectedDate ?? undefined}
        />
        {editingEvent && (
          <div className="mt-4 pt-4 border-t border-divider">
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              className="w-full"
            >
              このイベントを削除
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
