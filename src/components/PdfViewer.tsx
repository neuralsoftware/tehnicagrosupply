'use client';

import { useEffect, useRef, useState } from 'react';
import { FileText } from 'lucide-react';

interface PdfViewerProps {
    url: string;
    title?: string;
}

export default function PdfViewer({ url, title }: PdfViewerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading');

    useEffect(() => {
        let cancelled = false;

        async function render() {
            try {
                const pdfjsLib = await import('pdfjs-dist');
                pdfjsLib.GlobalWorkerOptions.workerSrc =
                    `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

                const pdf = await pdfjsLib.getDocument(url).promise;
                const page = await pdf.getPage(1);

                if (cancelled || !canvasRef.current) return;

                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
                const viewport = page.getViewport({ scale: dpr * 1.5 });

                canvas.width = viewport.width;
                canvas.height = viewport.height;
                canvas.style.width = '100%';
                canvas.style.height = 'auto';

                await page.render({ canvasContext: ctx, viewport, canvas: canvas }).promise;

                if (!cancelled) setStatus('done');
            } catch {
                if (!cancelled) setStatus('error');
            }
        }

        render();
        return () => {
            cancelled = true;
        };
    }, [url]);

    return (
        <div className="relative w-full">
            {status === 'loading' && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-zinc-50">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-ea-green-600" />
                </div>
            )}
            {status === 'error' && (
                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-zinc-50 p-8 text-center">
                    <FileText className="h-10 w-10 text-zinc-400" aria-hidden />
                    <p className="text-sm text-zinc-500">PDF-ul nu s-a putut încărca.</p>
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-ea-green-600 underline"
                    >
                        Deschide direct
                    </a>
                </div>
            )}
            <canvas
                ref={canvasRef}
                aria-label={title}
                className={`w-full rounded-2xl ${status !== 'done' ? 'invisible' : ''}`}
            />
        </div>
    );
}
