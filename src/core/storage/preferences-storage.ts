import type { MMKV } from "react-native-mmkv";

import { createMemoryStorage } from "@/core/storage/memory-storage";
import type { KeyValueStorage } from "@/core/storage/types";

const memory = createMemoryStorage();
let database: MMKV | null | undefined;

/**
 * MMKV is a native module. Expo Go does not include it, so UI sessions there
 * keep preferences in memory. Development builds use MMKV on disk.
 */
async function getDatabase(): Promise<MMKV | null> {
  if (database !== undefined) {
    return database;
  }

  try {
    const { createMMKV } = await import("react-native-mmkv");
    database = createMMKV({ id: "app-factory.preferences" });
  } catch {
    database = null;
  }

  return database;
}

export const preferencesStorage: KeyValueStorage = {
  async getString(key) {
    const db = await getDatabase();
    if (!db) {
      return memory.getString(key);
    }
    return db.getString(key) ?? null;
  },
  async setString(key, value) {
    const db = await getDatabase();
    if (!db) {
      await memory.setString(key, value);
      return;
    }
    db.set(key, value);
  },
  async delete(key) {
    const db = await getDatabase();
    if (!db) {
      await memory.delete(key);
      return;
    }
    db.remove(key);
  },
};
