"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getStorage } from "@/lib/storage";

const REGISTERED_KEY = "oshi-schedule-registered";

function checkRegistered(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(REGISTERED_KEY) === "true";
}

function showRegisterPopup() {
  // RegisterPromptProviderのイベントを発火
  window.dispatchEvent(new CustomEvent("oshi-register-prompt"));
}

export function useCollection<T extends { id: string }>(collection: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const storageRef = useRef(getStorage());

  const reload = useCallback(async () => {
    setLoading(true);
    const data = await storageRef.current.getAll<T>(collection);
    setItems(data);
    setLoading(false);
  }, [collection]);

  useEffect(() => {
    reload();
  }, [reload]);

  const add = useCallback(
    async (item: T) => {
      if (!checkRegistered()) { showRegisterPopup(); return; }
      await storageRef.current.create(collection, item);
      await reload();
    },
    [collection, reload]
  );

  const edit = useCallback(
    async (item: T) => {
      if (!checkRegistered()) { showRegisterPopup(); return; }
      await storageRef.current.update(collection, item);
      await reload();
    },
    [collection, reload]
  );

  const remove = useCallback(
    async (id: string) => {
      if (!checkRegistered()) { showRegisterPopup(); return; }
      await storageRef.current.delete(collection, id);
      await reload();
    },
    [collection, reload]
  );

  const getById = useCallback(
    async (id: string): Promise<T | null> => {
      return storageRef.current.getById<T>(collection, id);
    },
    [collection]
  );

  return { items, loading, add, edit, remove, getById, reload };
}
