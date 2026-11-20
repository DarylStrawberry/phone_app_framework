import { create } from "zustand";

import { sessionProfileSchema, type SessionProfile } from "@/core/session/profile";
import { getJson, preferencesStorage, setJson, storageKeys } from "@/core/storage";

type SessionState = {
  profile: SessionProfile | null;
  setProfile: (profile: SessionProfile | null) => Promise<void>;
  hydrateProfile: () => Promise<SessionProfile | null>;
};

export const useSessionStore = create<SessionState>((set) => ({
  profile: null,
  setProfile: async (profile) => {
    if (profile) {
      await setJson(preferencesStorage, storageKeys.profile, profile);
    } else {
      await preferencesStorage.delete(storageKeys.profile);
    }
    set({ profile });
  },
  hydrateProfile: async () => {
    const profile = await getJson(preferencesStorage, storageKeys.profile, sessionProfileSchema);
    set({ profile });
    return profile;
  },
}));
