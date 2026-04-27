import path from 'path';
import { fileURLToPath } from 'url';
import type { NextConfig } from 'next';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const securityHeaders = [
    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-XSS-Protection', value: '1; mode=block' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
    {
        key: 'Content-Security-Policy',
        value: [
            "default-src 'self'",
            // Script-uri: permite Google Tag Manager, Google Ads, Meta Pixel, Supabase etc.
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'" +
                " https://www.googletagmanager.com" +
                " https://www.google-analytics.com" +
                " https://googleads.g.doubleclick.net" +
                " https://www.googleadservices.com" +
                " https://connect.facebook.net" +
                " https://snap.licdn.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com data:",
            // Imagini: permite tracking pixels (1x1 GIF de la Google/Meta)
            "img-src 'self' data: blob: https://*.supabase.co https://wsrv.nl https://*.public.blob.vercel-storage.com https://www.google.com https://www.google-analytics.com https://googleads.g.doubleclick.net https://www.facebook.com https://px.ads.linkedin.com https:",
            // Conexiuni: permite Google Analytics, supabase, wsrv
            "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://wsrv.nl https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://region1.google-analytics.com https://www.googletagmanager.com",
            // Frame-uri: Google recaptcha, DoubleClick
            "frame-src https://bid.g.doubleclick.net https://www.google.com",
            "media-src 'self' https://*.supabase.co",
            "frame-ancestors 'self'",
            "base-uri 'self'",
            "form-action 'self'",
        ].join('; '),
    },
];


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
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: securityHeaders,
            },
        ];
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
