import type { NextConfig } from 'next';
const cms = new URL(process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337');
const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: cms.protocol.replace(':', '') as 'http' | 'https',
        hostname: cms.hostname,
        port: cms.port,
        pathname: '/uploads/**',
      },
    ],
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== 'production',
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ];
  },
};
export default config;
