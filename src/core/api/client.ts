import { env } from "@/core/config/env";
import { ApiError, toApiError } from "@/core/api/errors";
import { getMockHandler } from "@/core/api/mock-registry";
import type { ApiClient, ApiRequest } from "@/core/api/types";
import { notifyUnauthorized } from "@/core/api/unauthorized";
import { secureStorage, storageKeys } from "@/core/storage";
import { showToast } from "@/core/toast/toast-store";

const REQUEST_TIMEOUT_MS = 15_000;

function buildUrl(path: string, query: ApiRequest["query"]): string {
  const base = env.EXPO_PUBLIC_API_URL.replace(/\/$/, "");
  const pathPart = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${base}${pathPart}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

function messageFromBody(body: unknown): string | null {
  if (typeof body === "object" && body !== null && "message" in body) {
    const message = body.message;
    if (typeof message === "string" && message.trim() !== "") {
      return message;
    }
  }
  return null;
}

async function dispatchMock<T>(request: ApiRequest): Promise<T> {
  const handler = getMockHandler(request.method, request.path);
  if (!handler) {
    throw new ApiError(
      `No mock handler for ${request.method} ${request.path}.`,
      501,
      "mock_missing",
    );
  }

  const result = await handler(request);
  if (result.status >= 400) {
    throw new ApiError(
      messageFromBody(result.body) ?? "Request failed.",
      result.status,
      "mock_error",
      result.body,
    );
  }

  return result.body as T;
}

async function dispatchLive<T>(request: ApiRequest): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const headers = new Headers({ Accept: "application/json" });
    if (request.body !== undefined) {
      headers.set("Content-Type", "application/json");
    }

    if (request.auth !== false) {
      const token = await secureStorage.getString(storageKeys.accessToken);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }

    const response = await fetch(buildUrl(request.path, request.query), {
      method: request.method,
      headers,
      body: request.body === undefined ? undefined : JSON.stringify(request.body),
      signal: controller.signal,
    });

    const text = await response.text();
    let payload: unknown = null;
    if (text) {
      try {
        payload = JSON.parse(text) as unknown;
      } catch {
        throw new ApiError("The server returned invalid JSON.", response.status, "invalid_json");
      }
    }

    if (!response.ok) {
      throw new ApiError(
        messageFromBody(payload) ?? (response.statusText || "Request failed."),
        response.status,
        "http_error",
        payload,
      );
    }

    return payload as T;
  } finally {
    clearTimeout(timer);
  }
}

export function createApiClient(): ApiClient {
  return {
    async request<T>(request: ApiRequest): Promise<T> {
      try {
        if (env.EXPO_PUBLIC_API_MODE === "mock") {
          return await dispatchMock<T>(request);
        }
        return await dispatchLive<T>(request);
      } catch (error) {
        const apiError = toApiError(error);
        if (!request.silent) {
          showToast(apiError.message);
        }
        if (apiError.status === 401 && request.auth !== false) {
          notifyUnauthorized();
        }
        throw apiError;
      }
    },
  };
}

export const apiClient = createApiClient();
