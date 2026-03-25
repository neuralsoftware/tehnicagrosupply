'use client';

import { useState, useCallback, useRef } from 'react';
import { Check, Upload } from 'lucide-react';

function fileToOptimizedWebpBlob(
    file: File,
    qualityPercent: number,
    maxDim: number
): Promise<{ blob: Blob; previewDataUrl: string }> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('Citire fișier eșuată'));
        reader.onload = () => {
            const img = new window.Image();
            img.onerror = () => reject(new Error('Imagine invalidă'));
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX = maxDim;
                const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
                canvas.width = Math.round(img.width * ratio);
                canvas.height = Math.round(img.height * ratio);
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Canvas indisponibil'));
                    return;
                }
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const q = qualityPercent / 100;
                const previewDataUrl = canvas.toDataURL('image/webp', q);
                canvas.toBlob(
                    (blob) => {
                        if (!blob) reject(new Error('Optimizare eșuată'));
                        else resolve({ blob, previewDataUrl });
                    },
                    'image/webp',
                    q
                );
            };
            img.src = reader.result as string;
        };
        reader.readAsDataURL(file);
    });
}

type Props = {
    onOptimized: (url: string) => void;
    adminAuth: string;
    /** Folosit când multiple e false sau ca prefix */
    filename: string;
    /** Dacă true: selectezi mai multe fișiere / tragi un folder de poze — se încarcă pe rând, automat în galerie */
    multiple?: boolean;
    /** Număr de imagini deja în galerie (la începutul lotului). Folosit la nume: `{filename}-gal-{start+i+1}` */
    getInitialGalleryCount?: () => number;
    maxDimension?: number;
    /** Text pentru zona drag & drop */
    dropZoneHint?: string;
};

export function ImageOptimizer({
    onOptimized,
    adminAuth,
    filename,
    multiple = false,
    getInitialGalleryCount,
    maxDimension = 1200,
    dropZoneHint,
}: Props) {
    const [preview, setPreview] = useState<string | null>(null);
    const [quality, setQuality] = useState(80);
    const [originalSize, setOriginalSize] = useState(0);
    const [optimizedSize, setOptimizedSize] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [batchTotal, setBatchTotal] = useState(0);
    const [batchIndex, setBatchIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const uploadBlob = useCallback(
        async (blob: Blob, name: string): Promise<string | null> => {
            const formData = new FormData();
            formData.append('file', blob, name);
            formData.append('filename', name);

            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'x-admin-auth': adminAuth },
                body: formData,
            });
            const data = await res.json();
            if (data.url) return data.url as string;
            alert('Upload failed: ' + (data.error || res.status));
            return null;
        },
        [adminAuth]
    );

    const runOneFile = useCallback(
        async (file: File, q: number, nameForBlob: string): Promise<string | null> => {
            setOriginalSize(file.size);
            const { blob, previewDataUrl } = await fileToOptimizedWebpBlob(file, q, maxDimension);
            setPreview(previewDataUrl);
            setOptimizedSize(blob.size);
            return uploadBlob(blob, nameForBlob.endsWith('.webp') ? nameForBlob : `${nameForBlob}.webp`);
        },
        [maxDimension, uploadBlob]
    );

    const processFiles = useCallback(
        async (files: File[]) => {
            const imageFiles = files.filter((f) => /^image\//i.test(f.type) || /\.(jpe?g|png|gif|webp|avif|heic)$/i.test(f.name));
            if (imageFiles.length === 0) {
                alert('Nu am găsit imagini în selecție. Alege fișiere JPG, PNG, WebP etc.');
                return;
            }

            setUploading(true);
            setBatchTotal(imageFiles.length);
            setBatchIndex(0);

            const galleryStart =
                multiple && getInitialGalleryCount ? Math.max(0, getInitialGalleryCount()) : 0;

            try {
                for (let i = 0; i < imageFiles.length; i++) {
                    setBatchIndex(i + 1);
                    const nameBase = multiple
                        ? `${filename}-gal-${galleryStart + i + 1}`
                        : i === 0
                          ? filename
                          : `${filename}-${i + 1}`;
                    const url = await runOneFile(imageFiles[i], quality, nameBase);
                    if (url) onOptimized(url);
                }
            } catch (err) {
                alert('Eroare la procesare: ' + String(err));
            } finally {
                setUploading(false);
                setBatchTotal(0);
                setBatchIndex(0);
                if (inputRef.current) inputRef.current.value = '';
            }
        },
        [filename, getInitialGalleryCount, multiple, onOptimized, quality, runOneFile]
    );

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const list = e.target.files;
        if (!list?.length) return;
        const files = multiple ? Array.from(list) : [list[0]];
        void processFiles(files);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!multiple || uploading) return;
        const files = Array.from(e.dataTransfer.files || []);
        if (files.length) void processFiles(files);
    };

    const onDragOver = (e: React.DragEvent) => {
        if (!multiple) return;
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <div
            className={`space-y-3 p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800 ${multiple ? 'ring-1 ring-zinc-800/80' : ''}`}
            onDrop={onDrop}
            onDragOver={onDragOver}
        >
            {multiple && (
                <div className="flex items-start gap-3 rounded-xl border border-dashed border-zinc-700 bg-zinc-900/40 px-4 py-3">
                    <Upload className="w-5 h-5 text-ea-green-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-[11px] font-bold text-zinc-300">
                            Încărcare în lot: mai multe poze odată
                        </p>
                        <p className="text-[10px] text-zinc-500 leading-relaxed mt-1">
                            {dropZoneHint ||
                                'Alege mai multe fișiere din dialog sau trage-le aici (din Finder). Fiecare poză e optimizată și urcată automat pe server — nu mai e nevoie să le descarci manual una câte una.'}
                        </p>
                    </div>
                </div>
            )}
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple={multiple}
                onChange={handleFile}
                className="w-full text-xs text-zinc-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-ea-green-600 file:text-white file:text-xs file:font-bold file:cursor-pointer disabled:opacity-50"
                disabled={uploading}
            />
            <div className="flex items-center gap-3">
                <label className="text-[10px] text-zinc-500 uppercase font-black tracking-widest whitespace-nowrap">
                    Calitate WebP: {quality}%
                </label>
                <input
                    type="range"
                    min={40}
                    max={95}
                    value={quality}
                    onChange={(e) => setQuality(+e.target.value)}
                    className="flex-1 accent-ea-green-500"
                    disabled={uploading}
                />
            </div>
            {uploading && batchTotal > 1 && (
                <p className="text-[10px] text-ea-green-400 font-black uppercase tracking-widest">
                    Încarc pe server: {batchIndex} / {batchTotal}
                </p>
            )}
            {preview && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-zinc-600 uppercase">
                            {originalSize > 0 ? `Original: ${(originalSize / 1024).toFixed(1)} KB` : ''}
                        </span>
                        <span className="text-ea-green-400 font-bold uppercase">
                            {optimizedSize > 0 ? `Optimizat: ${(optimizedSize / 1024).toFixed(1)} KB` : ''}
                        </span>
                    </div>
                    <div className="relative rounded-lg overflow-hidden border border-zinc-800 group">
                        <img src={preview} alt="previzualizare" className="w-full h-32 object-cover transition-all group-hover:scale-105" />
                        {uploading && (
                            <div className="absolute inset-0 bg-zinc-950/80 flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-ea-green-500 border-t-transparent rounded-full animate-spin" />
                                <span className="text-[10px] text-white font-black uppercase tracking-widest">
                                    Se încarcă pe server…
                                </span>
                            </div>
                        )}
                        {!uploading && (
                            <div className="absolute top-2 right-2 bg-ea-green-600 text-white p-1 rounded-md shadow-lg">
                                <Check className="w-3 h-3" />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
