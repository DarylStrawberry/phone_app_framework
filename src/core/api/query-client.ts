import { QueryClient } from "@tanstack/react-query";

/**
 * Toasts are raised by the API client so a failed query does not toast twice.
 * Pass `silent: true` on a request when the screen renders the error itself.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
    mutations: {
      retry: false,
    },
  },
});
