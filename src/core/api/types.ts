export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiRequest = {
  method: HttpMethod;
  path: string;
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  /** Attach the access token. Defaults to true. */
  auth?: boolean;
  /** Skip the global error toast. Screens that show their own message use this. */
  silent?: boolean;
};

export type MockResult = {
  status: number;
  body: unknown;
};

export type MockHandler = (request: ApiRequest) => Promise<MockResult> | MockResult;

export interface ApiClient {
  request<T>(request: ApiRequest): Promise<T>;
}
