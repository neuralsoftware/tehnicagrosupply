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
            // Conexiuni: permite Google Analytics, supabase, wsrv.
            // `*.analytics.google.com` e obligatoriu: cu consimțământ acordat, gtag trimite
            // evenimentele (inclusiv generate_lead) către region1.analytics.google.com —
            // fără el, conversiile Google Ads erau blocate de CSP (diagnostic 10 iul. 2026).
            "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://wsrv.nl https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://stats.g.doubleclick.net https://www.googletagmanager.com",
            // Frame-uri: Google recaptcha, DoubleClick, demo-uri video produs
            "frame-src https://bid.g.doubleclick.net https://www.google.com https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://*.supabase.co",
            "media-src 'self' https://pub-956963153a8e40c0852ae49d504d4f93.r2.dev",
            "frame-ancestors 'self'",
            "base-uri 'self'",
            "form-action 'self'",
        ].join('; '),
    },
];


const nextConfig: NextConfig = {
    images: {
        formats: ['image/avif', 'image/webp'],
        /** 65 = imaginea hero de pe paginile de produs (LCP); 75 = restul (implicit Next). */
        qualities: [65, 75],
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
