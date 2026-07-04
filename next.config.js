/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    formats: ["image/webp"],
    deviceSizes: [320, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns", "recharts"]
  },
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false
};
