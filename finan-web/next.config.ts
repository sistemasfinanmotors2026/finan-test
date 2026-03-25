import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['10.0.0.12'], // añade tu IP de desarrollo
  // ...otros settings que tengas
};

export default nextConfig;