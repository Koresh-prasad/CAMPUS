/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@shms/shared'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

module.exports = nextConfig;
