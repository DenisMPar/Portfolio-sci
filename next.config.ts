import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

export default nextConfig;
