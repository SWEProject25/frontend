import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.giphy.com',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
