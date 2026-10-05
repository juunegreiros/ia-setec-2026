import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Home from "./page";

vi.mock("@/features/health/components/health-status", () => ({
  HealthStatus: () => <section>Status da API (mock)</section>,
}));

describe("Home", () => {
  it("renders the title and the API status section", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { level: 1, name: /sistema de pedidos/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Status da API (mock)")).toBeInTheDocument();
  });
});
