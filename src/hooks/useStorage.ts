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
  const hasLoadedRef = useRef(false);

  const reload = useCallback(async () => {
    setLoading(true);
    storageRef.current = getStorage();
    const data = await storageRef.current.getAll<T>(collection);
    setItems(data);
    setLoading(false);
    hasLoadedRef.current = true;
  }, [collection]);

  // 初回: auth-readyイベントを待ってからロード
  useEffect(() => {
    const handleAuthReady = () => {
      reload();
    };

    const handleStorageChanged = () => {
      // ストレージが切り替わったらリロード
      reload();
    };

    window.addEventListener("oshi-auth-ready", handleAuthReady);
    window.addEventListener("oshi-storage-changed", handleStorageChanged);

    // auth-readyが既に発火済みの場合に備えて即座にもロード
    reload();

    return () => {
      window.removeEventListener("oshi-auth-ready", handleAuthReady);
      window.removeEventListener("oshi-storage-changed", handleStorageChanged);
    };
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
