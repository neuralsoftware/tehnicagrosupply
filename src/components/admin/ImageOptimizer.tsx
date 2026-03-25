'use client';

import { useState, useCallback } from 'react';
import { Check } from 'lucide-react';

export function ImageOptimizer({
    onOptimized,
    adminAuth,
    filename,
}: {
    onOptimized: (url: string) => void;
    adminAuth: string;
    filename: string;
}) {
    const [preview, setPreview] = useState<string | null>(null);
    const [quality, setQuality] = useState(80);
    const [originalSize, setOriginalSize] = useState(0);
    const [optimizedSize, setOptimizedSize] = useState(0);
    const [uploading, setUploading] = useState(false);

    const optimizeAndUpload = useCallback(
        (file: File, q: number) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new window.Image();
                img.onload = async () => {
                    const canvas = document.createElement('canvas');
                    const MAX = 1200;
                    const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
                    canvas.width = img.width * ratio;
                    canvas.height = img.height * ratio;
                    const ctx = canvas.getContext('2d')!;
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    canvas.toBlob(
                        async (blob) => {
                            if (!blob) return;
                            setPreview(canvas.toDataURL('image/webp', q / 100));
                            setOptimizedSize(blob.size);

                            setUploading(true);
                            try {
                                const formData = new FormData();
                                formData.append('file', blob, `${filename || 'product'}.webp`);
                                formData.append('filename', `${filename || 'product'}.webp`);

                                const res = await fetch('/api/upload', {
                                    method: 'POST',
                                    headers: { 'x-admin-auth': adminAuth },
                                    body: formData,
                                });
                                const data = await res.json();
                                if (data.url) onOptimized(data.url);
                                else alert('Upload failed: ' + data.error);
                            } catch (err) {
                                alert('Upload error: ' + String(err));
                            } finally {
                                setUploading(false);
                            }
                        },
                        'image/webp',
                        q / 100
                    );
                };
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        },
        [onOptimized, adminAuth, filename]
    );

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setOriginalSize(file.size);
        optimizeAndUpload(file, quality);
    };

    return (
        <div className="space-y-3 p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800">
            <input
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="w-full text-xs text-zinc-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-ea-green-600 file:text-white file:text-xs file:font-bold file:cursor-pointer disabled:opacity-50"
                disabled={uploading}
            />
            {preview && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-3">
                        <label className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">
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
                    <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-zinc-600 uppercase">Original: {(originalSize / 1024).toFixed(1)} KB</span>
                        <span className="text-ea-green-400 font-bold uppercase">
                            Optimized: {(optimizedSize / 1024).toFixed(1)} KB
                        </span>
                    </div>
                    <div className="relative rounded-lg overflow-hidden border border-zinc-800 group">
                        <img src={preview} alt="preview" className="w-full h-32 object-cover transition-all group-hover:scale-105" />
                        {uploading && (
                            <div className="absolute inset-0 bg-zinc-950/80 flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-ea-green-500 border-t-transparent rounded-full animate-spin" />
                                <span className="text-[10px] text-white font-black uppercase tracking-widest">
                                    Se încarcă pe Blob...
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
