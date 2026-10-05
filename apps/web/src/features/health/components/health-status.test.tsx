import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { HealthStatus } from "./health-status";

vi.mock("@/features/health/api/fetch-health", () => ({
  fetchHealth: vi.fn(),
}));

import { fetchHealth } from "@/features/health/api/fetch-health";

function renderWithQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <HealthStatus />
    </QueryClientProvider>,
  );
}

describe("HealthStatus", () => {
  it("shows Online when the API answers ok", async () => {
    vi.mocked(fetchHealth).mockResolvedValueOnce({
      status: "ok",
      service: "workshop-pedidos-api",
    });

    renderWithQueryClient();

    expect(await screen.findByText("Online")).toBeInTheDocument();
    expect(screen.getByText("workshop-pedidos-api")).toBeInTheDocument();
  });

  it("shows the unavailable state and a retry button when the request fails", async () => {
    vi.mocked(fetchHealth).mockRejectedValueOnce(new Error("offline"));

    renderWithQueryClient();

    expect(await screen.findByText("Indisponível")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /tentar novamente/i }),
    ).toBeInTheDocument();
  });
});
