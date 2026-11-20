import { create } from "zustand";

import { setUnauthorizedHandler } from "@/core/api";
import { features } from "@/core/config";
import { secureStorage, storageKeys } from "@/core/storage";
import { useSessionStore } from "@/core/session";
import { authRepository } from "@/features/auth/services/auth-repository";
import {
  canUseBiometrics,
  promptBiometricUnlock,
  readBiometricEnabled,
  writeBiometricEnabled,
} from "@/features/auth/services/biometrics";
import type { ForgotPasswordInput, LoginInput, SignupInput } from "@/features/auth/services/schemas";

export type AuthStatus = "booting" | "anonymous" | "locked" | "authenticated";

type AuthState = {
  status: AuthStatus;
  biometricEnabled: boolean;
  biometricAvailable: boolean;
  hydrate: () => Promise<void>;
  login: (input: LoginInput) => Promise<void>;
  signup: (input: SignupInput) => Promise<void>;
  requestPasswordReset: (input: ForgotPasswordInput) => Promise<string>;
  logout: () => Promise<void>;
  unlock: () => Promise<boolean>;
  setBiometricEnabled: (enabled: boolean) => Promise<boolean>;
};

let hydratePromise: Promise<void> | null = null;

export const useAuthStore = create<AuthState>((set, get) => ({
  status: "booting",
  biometricEnabled: false,
  biometricAvailable: false,

  hydrate: () => {
    if (hydratePromise) {
      return hydratePromise;
    }

    hydratePromise = (async () => {
      if (!features.auth) {
        set({ status: "authenticated" });
        return;
      }

      const [token, biometricEnabled, biometricAvailable, profile] = await Promise.all([
        secureStorage.getString(storageKeys.accessToken),
        readBiometricEnabled(),
        canUseBiometrics(),
        useSessionStore.getState().hydrateProfile(),
      ]);

      if (!token || !profile) {
        await authRepository.clearLocalSession();
        set({ status: "anonymous", biometricEnabled, biometricAvailable });
        return;
      }

      if (biometricEnabled && biometricAvailable) {
        set({ status: "locked", biometricEnabled, biometricAvailable });
        return;
      }

      set({ status: "authenticated", biometricEnabled, biometricAvailable });
    })().catch(async () => {
      hydratePromise = null;
      await authRepository.clearLocalSession();
      set({ status: "anonymous" });
    });

    return hydratePromise;
  },

  login: async (input) => {
    await authRepository.login(input);
    const biometricAvailable = await canUseBiometrics();
    set({
      status: "authenticated",
      biometricAvailable,
      biometricEnabled: get().biometricEnabled,
    });
  },

  signup: async (input) => {
    await authRepository.signup(input);
    const biometricAvailable = await canUseBiometrics();
    set({ status: "authenticated", biometricAvailable });
  },

  requestPasswordReset: (input) => authRepository.requestPasswordReset(input),

  logout: async () => {
    await authRepository.clearLocalSession();
    set({ status: features.auth ? "anonymous" : "authenticated" });
  },

  unlock: async () => {
    const success = await promptBiometricUnlock();
    if (success) {
      set({ status: "authenticated" });
    }
    return success;
  },

  setBiometricEnabled: async (enabled) => {
    if (enabled) {
      const available = await canUseBiometrics();
      if (!available) {
        set({ biometricAvailable: false, biometricEnabled: false });
        return false;
      }
      const success = await promptBiometricUnlock();
      if (!success) {
        return false;
      }
    }

    await writeBiometricEnabled(enabled);
    set({ biometricEnabled: enabled });
    return true;
  },
}));

setUnauthorizedHandler(() => {
  void useAuthStore.getState().logout();
});
