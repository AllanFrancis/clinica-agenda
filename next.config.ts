import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL("https://tatame-pro.s3.sa-east-1.amazonaws.com/**"),
    ],
  },
};

export default nextConfig;
