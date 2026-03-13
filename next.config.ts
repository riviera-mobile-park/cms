import type { NextConfig } from 'next';

const cloudFrontHost = process.env.CLOUDFRONT_DOMAIN
  ? process.env.CLOUDFRONT_DOMAIN.replace(/^https?:\/\//, '').replace(/\/$/, '')
  : undefined;

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [480, 768, 1200, 1600],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      ...(cloudFrontHost
        ? [
            {
              protocol: 'https' as const,
              hostname: cloudFrontHost,
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
