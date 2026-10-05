import { describe, expect, it, vi } from "vitest";

import { fetchHealth } from "./fetch-health";

vi.mock("@/lib/api/client", () => ({
  apiFetch: vi.fn(),
}));

import { apiFetch } from "@/lib/api/client";

describe("fetchHealth", () => {
  it("calls the health path and parses the response", async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce({
      status: "ok",
      service: "workshop-pedidos-api",
    });

    const result = await fetchHealth();

    expect(apiFetch).toHaveBeenCalledWith("/api/health/");
    expect(result).toEqual({ status: "ok", service: "workshop-pedidos-api" });
  });

  it("rejects a response that does not match the schema", async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce({ status: "ok" });

    await expect(fetchHealth()).rejects.toThrow();
  });
});
