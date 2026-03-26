'use client';

import { useEffect, useRef, useState } from 'react';

export interface CategoryHeroBannerProps {
    categoryTitle: string;
    subtitle: string;
    /** Listă MP4 (gol = hero static gradient) */
    videoUrls: string[];
}

export function CategoryHeroBanner({ categoryTitle, subtitle, videoUrls }: CategoryHeroBannerProps) {
    const hasVideo = videoUrls.length > 0;
    const multi = videoUrls.length > 1;
    const [activeIndex, setActiveIndex] = useState(0);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
    const urlsKey = videoUrls.join('\0');

    useEffect(() => {
        setActiveIndex(0);
    }, [urlsKey]);

    useEffect(() => {
        if (!hasVideo) return;
        const refs = videoRefs.current;
        videoUrls.forEach((_, i) => {
            const el = refs[i];
            if (!el) return;
            el.loop = !multi;
            if (i === activeIndex) {
                void el.play().catch(() => {});
            } else {
                el.pause();
                try {
                    el.currentTime = 0;
                } catch {
                    /* ignore */
                }
            }
        });
    }, [activeIndex, hasVideo, multi, urlsKey]);

    if (!hasVideo) {
        return (
            <div className="relative mb-12 h-[250px] w-full overflow-hidden md:h-[350px]">
                <div
                    className="absolute inset-0 z-0 bg-gradient-to-br from-slate-900 via-green-950 to-slate-900"
                    aria-hidden
                />
                <div
                    className="pointer-events-none absolute inset-0 z-[1] opacity-40"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 75% 25%, rgba(34,197,94,0.12), transparent 42%), radial-gradient(circle at 25% 75%, rgba(15,118,110,0.1), transparent 45%)',
                    }}
                    aria-hidden
                />
                <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center">
                    <h1 className="normal-case text-3xl font-semibold tracking-tight text-white drop-shadow-lg md:text-4xl">
                        {categoryTitle}
                    </h1>
                    <p className="mt-3 max-w-3xl text-sm text-gray-100 drop-shadow-md md:text-base">{subtitle}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative mb-12 h-[250px] w-full overflow-hidden md:h-[350px]">
            <div className="absolute inset-0 z-0">
                {videoUrls.map((src, i) => (
                    <video
                        key={`${i}-${src}`}
                        ref={(el) => {
                            videoRefs.current[i] = el;
                        }}
                        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
                            i === activeIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                        muted
                        playsInline
                        preload="auto"
                        onEnded={() => {
                            if (!multi) return;
                            if (i !== activeIndex) return;
                            setActiveIndex((a) => (a + 1) % videoUrls.length);
                        }}
                    >
                        <source src={src} type="video/mp4" />
                    </video>
                ))}
            </div>
            <div className="pointer-events-none absolute inset-0 z-[5] bg-black/40" aria-hidden />
            <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center">
                <h1 className="normal-case text-3xl font-semibold tracking-tight text-white drop-shadow-lg md:text-4xl">
                    {categoryTitle}
                </h1>
                <p className="mt-3 max-w-3xl text-sm text-gray-100 drop-shadow-md md:text-base">{subtitle}</p>
            </div>
        </div>
    );
}
