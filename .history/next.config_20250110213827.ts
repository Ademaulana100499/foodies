import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
};

export default nextConfig;
module.exports = {
  images: {
    domains: ["*"], // Ini akan mengizinkan semua domain
  },
};
