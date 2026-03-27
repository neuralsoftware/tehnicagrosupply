import path from 'path';
import { fileURLToPath } from 'url';
import type { NextConfig } from 'next';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'wsrv.nl',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    optimizeCss: true,
  },
  turbopack: {
    root: projectRoot,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  async redirects() {
    return [
      {
        source: '/utilaje/semanat-fertilizat/green-plains-ads',
        destination: '/utilaje/semanat-fertilizat/multisem-ads',
        permanent: true,
      },
      {
        source: '/utilaje/viticultura/masinacarnit',
        destination: '/utilaje/viticultura/masina-de-carnit-st120',
        permanent: true,
      },
      {
        source: '/utilaje/viticol/masinacarnit',
        destination: '/utilaje/viticol/masina-de-carnit-st120',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
