import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Dev-only: allow extra origins (e.g. a phone on the LAN) to reach the dev
  // server. Set ALLOWED_DEV_ORIGINS="192.168.x.x,..." in .env.local so no
  // personal network topology is committed. Ignored in production builds.
  allowedDevOrigins: process.env.ALLOWED_DEV_ORIGINS?.split(",").map((s) =>
    s.trim(),
  ),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["three", "@react-three/drei", "framer-motion"],
  },
};

export default withNextIntl(nextConfig);
