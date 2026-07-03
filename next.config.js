/** @type {import('next').NextConfig} */
module.exports = {
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false }
};
