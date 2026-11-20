export { apiClient, createApiClient } from "@/core/api/client";
export { ApiError, errorMessage, toApiError } from "@/core/api/errors";
export { mockKey, registerMockHandlers } from "@/core/api/mock-registry";
export { queryClient } from "@/core/api/query-client";
export type { ApiClient, ApiRequest, HttpMethod, MockHandler, MockResult } from "@/core/api/types";
export { setUnauthorizedHandler } from "@/core/api/unauthorized";
