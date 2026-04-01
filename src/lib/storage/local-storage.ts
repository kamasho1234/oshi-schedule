import type { IStorageAdapter } from "@/types";

const PREFIX = "oshi-schedule";

function getKey(collection: string): string {
  return `${PREFIX}-${collection}`;
}

export class LocalStorageAdapter implements IStorageAdapter {
  async getAll<T>(collection: string): Promise<T[]> {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(getKey(collection));
    if (!raw) return [];
    return JSON.parse(raw) as T[];
  }

  async getById<T>(collection: string, id: string): Promise<T | null> {
    const items = await this.getAll<T>(collection);
    return (
      items.find((item) => (item as Record<string, unknown>)["id"] === id) ??
      null
    );
  }

  async create<T extends { id: string }>(
    collection: string,
    item: T
  ): Promise<T> {
    const items = await this.getAll<T>(collection);
    items.push(item);
    localStorage.setItem(getKey(collection), JSON.stringify(items));
    return item;
  }

  async update<T extends { id: string }>(
    collection: string,
    item: T
  ): Promise<T> {
    const items = await this.getAll<T>(collection);
    const index = items.findIndex((i) => i.id === item.id);
    if (index === -1) throw new Error(`Item ${item.id} not found`);
    items[index] = item;
    localStorage.setItem(getKey(collection), JSON.stringify(items));
    return item;
  }

  async delete(collection: string, id: string): Promise<void> {
    const items = await this.getAll<{ id: string }>(collection);
    const filtered = items.filter((i) => i.id !== id);
    localStorage.setItem(getKey(collection), JSON.stringify(filtered));
  }

  async exportAll(): Promise<string> {
    const collections = ["oshi", "events", "goods", "expenses", "settings"];
    const data: Record<string, unknown> = {};
    for (const col of collections) {
      data[col] = await this.getAll(col);
    }
    return JSON.stringify(data, null, 2);
  }

  async importAll(json: string): Promise<void> {
    const data = JSON.parse(json) as Record<string, unknown[]>;
    for (const [col, items] of Object.entries(data)) {
      localStorage.setItem(getKey(col), JSON.stringify(items));
    }
  }
}
