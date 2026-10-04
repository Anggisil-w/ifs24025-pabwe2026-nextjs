import path from "node:path";
import type { NextConfig } from "next";

const API = process.env.NEXT_PUBLIC_DELCOM_BASEURL || "https://open-api.delcom.org/api/v1";
const NOOP = path.resolve(process.cwd(), "src/lib/noop.js");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: true,
  images: {
    formats: ["image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "open-api.delcom.org", pathname: "/**" }],
  },
  experimental: { inlineCss: true },
  // Hilangkan polyfill bawaan Next.js (ditandai Lighthouse sebagai "Legacy JavaScript").
  turbopack: {
    resolveAlias: { "../build/polyfills/polyfill-module": "./src/lib/noop.js" },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "../build/polyfills/polyfill-module": NOOP,
    };
    return config;
  },
  async rewrites() {
    return [{ source: "/delcom-proxy/:path*", destination: `${API}/:path*` }];
  },
};

export default nextConfig;
