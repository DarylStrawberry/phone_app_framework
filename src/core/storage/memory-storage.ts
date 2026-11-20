import type { KeyValueStorage } from "@/core/storage/types";

export function createMemoryStorage(): KeyValueStorage {
  const values = new Map<string, string>();

  return {
    async getString(key) {
      return values.get(key) ?? null;
    },
    async setString(key, value) {
      values.set(key, value);
    },
    async delete(key) {
      values.delete(key);
    },
  };
}
