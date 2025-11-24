import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */

  // Proxy API requests to avoid third-party cookie blocking
  async rewrites() {
    return [
      {
        source: '/api/v1.0/:path*',
        destination: 'https://api.hankers.myaddr.tools/api/v1.0/:path*',
      },
    ];
  },

  images: {
    unoptimized: true, // Disable image optimization for external images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.giphy.com',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'avatar.iran.liara.run',
      },
      {
        protocol: 'http',
        hostname: 'avatar.iran.liara.run',
      },
      {
        protocol: 'https',
        hostname: 'stsimpleappiee20o.blob.core.windows.net',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/a/**',
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
