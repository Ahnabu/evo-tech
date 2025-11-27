/** @type {import('next').NextConfig} */

const resolveFrontendUrl = () => {
  if (process.env.NEXT_PUBLIC_FEND_URL) return process.env.NEXT_PUBLIC_FEND_URL;
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
};

const resolveBackendUrl = () => {
  if (process.env.NEXT_PUBLIC_BACKEND_URL)
    return process.env.NEXT_PUBLIC_BACKEND_URL;
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (process.env.BACKEND_URL) return process.env.BACKEND_URL;
  return "http://localhost:5000/api/v1";
};

const frontUrl = resolveFrontendUrl();
const backendUrl = resolveBackendUrl();
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? backendUrl;

const nextConfig = {
  reactStrictMode: true,
  // For Hostinger deployment, use standalone output
  output: process.env.BUILD_STANDALONE === "true" ? "standalone" : undefined,
  // Suppress build errors when backend is not available during build
  typescript: {
    // Don't fail build on type errors in production
    ignoreBuildErrors: false,
  },
  eslint: {
    // Don't fail build on lint errors (warnings only)
    ignoreDuringBuilds: false,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  env: {
    NEXT_PUBLIC_FEND_URL: frontUrl,
    NEXT_PUBLIC_BACKEND_URL: backendUrl,
    NEXT_PUBLIC_API_URL: apiUrl,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.evo-techbd.com",
      },
      {
        protocol: "https",
        hostname: "**.vercel.app",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
      },
      {
        protocol: "https",
        hostname: "elegoo.com",
      },
      {
        protocol: "https",
        hostname: "**.elegoo.com",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;