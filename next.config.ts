import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['10.0.0.12','10.0.0.69','neo-earnings-prot-statutes.trycloudflare.com'], // añade tu IP de desarrollo
  // ...otros settings que tengas
  cacheComponents: true,
};

export default nextConfig;