'use client';

import dynamic from 'next/dynamic';

const PdfViewer = dynamic(() => import('./PdfViewer'), { ssr: false });

export default function PdfViewerWrapper({ url, title }: { url: string; title?: string }) {
    return <PdfViewer url={url} title={title} />;
}
