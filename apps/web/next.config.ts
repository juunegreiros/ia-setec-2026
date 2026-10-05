import path from "path";
import { loadEnvConfig } from "@next/env";
import type { NextConfig } from "next";

// The .env lives at the repository root and is shared with Django.
const repositoryRoot = path.resolve(__dirname, "../..");
loadEnvConfig(repositoryRoot);

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
};

export default nextConfig;
