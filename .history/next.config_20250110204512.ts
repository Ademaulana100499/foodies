import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
};

export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["nutritionrefined.com"], // Tambahkan domain eksternal di sini
  },
};

module.exports = nextConfig;
