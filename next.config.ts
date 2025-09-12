import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      { source: '/_ph/static/:path*', destination: 'https://us-assets.i.posthog.com/static/:path*' },
      { source: '/_ph/:path*', destination: 'https://us.i.posthog.com/:path*' },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
};

export default nextConfig;
