import { apiClient } from "@/core/api";
import type { SessionProfile } from "@/core/session";
import { secureStorage, storageKeys } from "@/core/storage";
import { useSessionStore } from "@/core/session";

import "@/features/auth/services/register-mocks";
import {
  authSessionSchema,
  forgotPasswordSchema,
  type ForgotPasswordInput,
  type LoginInput,
  type SignupInput,
} from "@/features/auth/services/schemas";

async function persistSession(payload: unknown): Promise<SessionProfile> {
  const session = authSessionSchema.parse(payload);
  await secureStorage.setString(storageKeys.accessToken, session.accessToken);
  if (session.refreshToken) {
    await secureStorage.setString(storageKeys.refreshToken, session.refreshToken);
  }
  await useSessionStore.getState().setProfile(session.user);
  return session.user;
}

export const authRepository = {
  async login(input: LoginInput): Promise<SessionProfile> {
    const payload = await apiClient.request<unknown>({
      method: "POST",
      path: "/auth/login",
      body: input,
      auth: false,
      silent: true,
    });
    return persistSession(payload);
  },

  async signup(input: SignupInput): Promise<SessionProfile> {
    const payload = await apiClient.request<unknown>({
      method: "POST",
      path: "/auth/signup",
      body: {
        name: input.name,
        email: input.email,
        password: input.password,
      },
      auth: false,
      silent: true,
    });
    return persistSession(payload);
  },

  async requestPasswordReset(input: ForgotPasswordInput): Promise<string> {
    const body = forgotPasswordSchema.parse(input);
    const payload = await apiClient.request<unknown>({
      method: "POST",
      path: "/auth/forgot-password",
      body,
      auth: false,
      silent: true,
    });

    if (typeof payload === "object" && payload !== null && "message" in payload) {
      const message = payload.message;
      if (typeof message === "string") {
        return message;
      }
    }

    return "If an account exists for that email, reset instructions are on the way.";
  },

  async clearLocalSession(): Promise<void> {
    await secureStorage.delete(storageKeys.accessToken);
    await secureStorage.delete(storageKeys.refreshToken);
    await useSessionStore.getState().setProfile(null);
  },
};
