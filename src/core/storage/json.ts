import type { z } from "zod";

import type { KeyValueStorage } from "@/core/storage/types";

export async function getJson<T>(
  storage: KeyValueStorage,
  key: string,
  schema: z.ZodType<T>,
): Promise<T | null> {
  const raw = await storage.getString(key);
  if (!raw) {
    return null;
  }

  try {
    const parsed = schema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export async function setJson(storage: KeyValueStorage, key: string, value: unknown): Promise<void> {
  await storage.setString(key, JSON.stringify(value));
}
