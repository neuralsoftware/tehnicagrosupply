'use client';

import dynamic from 'next/dynamic';

const PdfViewer = dynamic(() => import('./PdfViewer'), { ssr: false });

function toProxyUrl(url: string): string {
    const clean = url.trim().split('#')[0] ?? url.trim();
    return `/api/promotions/pdf-proxy?url=${encodeURIComponent(clean)}`;
}

export default function PdfViewerWrapper({ url, title }: { url: string; title?: string }) {
    return <PdfViewer url={toProxyUrl(url)} title={title} />;
}
