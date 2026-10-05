import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.url(),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;

let cached: ClientEnv | undefined;

const DEFAULT_API_BASE_URL = "http://localhost:8000";

export function getClientEnv(): ClientEnv {
  if (!cached) {
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL;
    cached = clientEnvSchema.parse({
      NEXT_PUBLIC_API_BASE_URL: apiBaseUrl,
    });
  }
  return cached;
}
