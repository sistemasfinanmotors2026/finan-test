import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['10.0.0.12','54a9-186-4-137-211.ngrok-free.app'], // añade tu IP de desarrollo
  // ...otros settings que tengas
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.ngrok-free.app',
      },
    ],
  },
};

export default nextConfig;