import { apiFetch } from "@/lib/api/client";
import { healthResponseSchema, type HealthResponse } from "@/lib/validation";

const HEALTH_PATH = "/api/health/";

export async function fetchHealth(): Promise<HealthResponse> {
  const data = await apiFetch<unknown>(HEALTH_PATH);
  return healthResponseSchema.parse(data);
}
