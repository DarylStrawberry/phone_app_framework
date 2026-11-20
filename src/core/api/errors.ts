export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: unknown;

  constructor(message: string, status: number, code: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error && error.name === "AbortError") {
    return new ApiError("The request timed out.", 408, "timeout");
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 0, "network");
  }

  return new ApiError("Something went wrong.", 0, "unknown");
}

export function errorMessage(error: unknown): string {
  return toApiError(error).message;
}
