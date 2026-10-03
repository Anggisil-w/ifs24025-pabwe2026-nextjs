import type { NextConfig } from "next";

const API = process.env.NEXT_PUBLIC_DELCOM_BASEURL || "https://open-api.delcom.org/api/v1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  productionBrowserSourceMaps: true,
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
};

export default nextConfig;