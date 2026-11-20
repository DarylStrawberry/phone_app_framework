import type { MockHandler } from "@/core/api/types";

const handlers = new Map<string, MockHandler>();

export function mockKey(method: string, path: string): string {
  return `${method.toUpperCase()} ${path}`;
}

/** Features register handlers when their module loads. Core never imports features. */
export function registerMockHandlers(routes: Record<string, MockHandler>): void {
  for (const [key, handler] of Object.entries(routes)) {
    handlers.set(key, handler);
  }
}

export function getMockHandler(method: string, path: string): MockHandler | undefined {
  return handlers.get(mockKey(method, path));
}
