let unauthorizedHandler: (() => void) | null = null;

/** Auth registers this so a 401 can clear the session without the client importing auth. */
export function setUnauthorizedHandler(handler: () => void): void {
  unauthorizedHandler = handler;
}

export function notifyUnauthorized(): void {
  unauthorizedHandler?.();
}
