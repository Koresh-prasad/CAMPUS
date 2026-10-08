const rawOrigin = process.env.NEXT_PUBLIC_API_ORIGIN || 'http://localhost:4000';
const apiOrigin = rawOrigin.trim().replace(/\/+$/, '');

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@shms/shared'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiOrigin}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${apiOrigin}/uploads/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
