import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import { createMemoryStorage } from "@/core/storage/memory-storage";
import type { KeyValueStorage } from "@/core/storage/types";

const WEB_PREFIX = "app-factory.secure.";
const memory = createMemoryStorage();

function readBrowser(key: string): string | null {
  if (typeof localStorage === "undefined") {
    return null;
  }
  return localStorage.getItem(WEB_PREFIX + key);
}

function writeBrowser(key: string, value: string): void {
  if (typeof localStorage === "undefined") {
    return;
  }
  localStorage.setItem(WEB_PREFIX + key, value);
}

function deleteBrowser(key: string): void {
  if (typeof localStorage === "undefined") {
    return;
  }
  localStorage.removeItem(WEB_PREFIX + key);
}

async function canUseSecureStore(): Promise<boolean> {
  if (Platform.OS === "web") {
    return false;
  }

  try {
    return await SecureStore.isAvailableAsync();
  } catch {
    return false;
  }
}

/**
 * Sensitive values (access tokens) go here.
 * Web has no SecureStore. The browser fallback is for UI testing only.
 */
export const secureStorage: KeyValueStorage = {
  async getString(key) {
    if (await canUseSecureStore()) {
      return SecureStore.getItemAsync(key);
    }

    const browserValue = readBrowser(key);
    if (browserValue !== null) {
      return browserValue;
    }
    return memory.getString(key);
  },
  async setString(key, value) {
    if (await canUseSecureStore()) {
      await SecureStore.setItemAsync(key, value);
      return;
    }

    writeBrowser(key, value);
    await memory.setString(key, value);
  },
  async delete(key) {
    if (await canUseSecureStore()) {
      await SecureStore.deleteItemAsync(key);
      return;
    }

    deleteBrowser(key);
    await memory.delete(key);
  },
};
