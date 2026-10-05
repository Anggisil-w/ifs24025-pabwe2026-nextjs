import { join } from "node:path";
import type { NextConfig } from "next";

const API = process.env.NEXT_PUBLIC_DELCOM_BASEURL || "https://open-api.delcom.org/api/v1";

const nextConfig: NextConfig = {
  // Target browser (lihat "browserslist" di package.json) sudah mendukung semua fitur yang di-polyfill Next
  // (Array.at/flat/flatMap, Object.fromEntries/hasOwn, trimStart/trimEnd), jadi polyfill-nya dibuang (~11 KiB).
  webpack: (config, { webpack, isServer }) => {
    if (!isServer) {
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(/build[\\/]polyfills[\\/]polyfill-module/, join(process.cwd(), "src/lib/empty.ts")),
      );
    }
    return config;
  },
  turbopack: {}, // webpack di atas hanya dipakai build webpack; ini mencegah error bila Next memakai Turbopack
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "open-api.delcom.org", pathname: "/**" },
      { protocol: "https", hostname: "ui-avatars.com", pathname: "/**" },
    ],
  },
  experimental: { inlineCss: true },
  async rewrites() {
    return [{ source: "/delcom-proxy/:path*", destination: `${API}/:path*` }];
  },
  async headers() {
    return [
      {
        source: "/((?!delcom-proxy).*)",
        headers: [{ key: "X-Robots-Tag", value: "index, follow" }],
      },
    ];
  },
};

export default nextConfig;