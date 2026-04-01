import { LocalStorageAdapter } from "./local-storage";
import type { IStorageAdapter } from "@/types";

let adapter: IStorageAdapter | null = null;

export function getStorage(): IStorageAdapter {
  if (!adapter) {
    adapter = new LocalStorageAdapter();
  }
  return adapter;
}
