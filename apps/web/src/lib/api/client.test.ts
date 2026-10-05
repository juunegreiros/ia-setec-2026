import { afterEach, describe, expect, it, vi } from "vitest";

import { ApiError, apiFetch } from "./client";

function mockFetchOnce(body: unknown, init: ResponseInit) {
  vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
    new Response(JSON.stringify(body), init),
  );
}

describe("apiFetch", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("prefixes the API base URL and returns the JSON body", async () => {
    mockFetchOnce({ status: "ok" }, { status: 200 });

    const data = await apiFetch<{ status: string }>("/api/health/");

    expect(data.status).toBe("ok");
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8000/api/health/",
      expect.objectContaining({
        headers: expect.objectContaining({ Accept: "application/json" }),
      }),
    );
  });

  it("throws ApiError with status and body when the response is not ok", async () => {
    mockFetchOnce({ customer_name: ["Obrigatório."] }, { status: 400 });

    const error = await apiFetch("/api/anything/").catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(400);
    expect((error as ApiError).body).toEqual({
      customer_name: ["Obrigatório."],
    });
  });
});
