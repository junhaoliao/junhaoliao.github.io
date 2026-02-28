import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    inlineCss: true,
  },
  env: {
    NEXT_TELEMETRY_DISABLED: "1",
  },
};

export default nextConfig;
