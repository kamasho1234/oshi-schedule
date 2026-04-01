"use client";

import { useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40"
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
    >
      <div className="bg-modal w-full sm:max-w-lg sm:radius-card rounded-t-[var(--radius-card)] max-h-[85vh] overflow-y-auto animate-slide-up">
        <div className="sticky top-0 bg-modal border-b border-divider px-5 py-4 flex items-center justify-between rounded-t-[var(--radius-card)]">
          <h2 className="text-lg font-bold text-heading">{title}</h2>
          <button
            onClick={onClose}
            className="text-dim hover:text-sub text-2xl leading-none"
            aria-label="閉じる"
          >
            &times;
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}
