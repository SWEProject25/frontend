import { MEDIA_TYPES } from '@/features/media/constants/mediaTypes';
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
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'stsimpleappiee20o.blob.core.windows.net',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
