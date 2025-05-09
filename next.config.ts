import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    BASE_URL: 'https://school-hive.vercel.app/',
    BE_LOCAL_URL: 'http://localhost:8080',
  }
};

export default nextConfig;
