import { getClientEnv } from "@/lib/env/client-env";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body: unknown = null,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const { NEXT_PUBLIC_API_BASE_URL } = getClientEnv();
  const url = `${NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, "")}${path}`;

  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    // The body carries DRF validation errors, which forms need to show.
    throw new ApiError(
      `API request failed: ${response.status} ${response.statusText}`.trim(),
      response.status,
      await readJson(response),
    );
  }

  return response.json() as Promise<T>;
}
