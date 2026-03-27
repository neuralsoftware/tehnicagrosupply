/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizeCss: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Redirect pentru domeniu final (când va fi custom)
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
