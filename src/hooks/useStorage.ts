"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getStorage, isSupabaseActive } from "@/lib/storage";
import { supabase } from "@/lib/supabase";

async function checkAuthenticated(): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session !== null;
  } catch {
    return false;
  }
}

function showRegisterPopup() {
  window.dispatchEvent(new CustomEvent("oshi-register-prompt"));
}

export function useCollection<T extends { id: string }>(collection: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const storageRef = useRef(getStorage());

  // storageが切り替わった場合に更新
  useEffect(() => {
    storageRef.current = getStorage();
  });

  const reload = useCallback(async () => {
    setLoading(true);
    storageRef.current = getStorage();
    const data = await storageRef.current.getAll<T>(collection);
    setItems(data);
    setLoading(false);
  }, [collection]);

  useEffect(() => {
    reload();
  }, [reload]);

  const add = useCallback(
    async (item: T) => {
      const authed = await checkAuthenticated();
      if (!authed && !isSupabaseActive()) { showRegisterPopup(); return; }
      storageRef.current = getStorage();
      await storageRef.current.create(collection, item);
      await reload();
    },
    [collection, reload]
  );

  const edit = useCallback(
    async (item: T) => {
      const authed = await checkAuthenticated();
      if (!authed && !isSupabaseActive()) { showRegisterPopup(); return; }
      storageRef.current = getStorage();
      await storageRef.current.update(collection, item);
      await reload();
    },
    [collection, reload]
  );

  const remove = useCallback(
    async (id: string) => {
      const authed = await checkAuthenticated();
      if (!authed && !isSupabaseActive()) { showRegisterPopup(); return; }
      storageRef.current = getStorage();
      await storageRef.current.delete(collection, id);
      await reload();
    },
    [collection, reload]
  );

  const getById = useCallback(
    async (id: string): Promise<T | null> => {
      storageRef.current = getStorage();
      return storageRef.current.getById<T>(collection, id);
    },
    [collection]
  );

  return { items, loading, add, edit, remove, getById, reload };
}
