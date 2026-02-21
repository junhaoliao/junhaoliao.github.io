import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Disable Next.js telemetry at project level too
  env: {
    NEXT_TELEMETRY_DISABLED: "1",
  },
};

export default nextConfig;
