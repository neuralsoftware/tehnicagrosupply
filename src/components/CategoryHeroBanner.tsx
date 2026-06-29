'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const HERO_VIDEO_POSTER = '/images/category-hero-video-poster.jpg';

export interface CategoryHeroBannerProps {
    categoryTitle: string;
    subtitle: string;
    videoUrls: string[];
    imageUrl?: string | null;
}

function getVideoMimeType(src: string): string {
    const cleanSrc = src.split(/[?#]/)[0]?.toLowerCase() ?? '';
    if (cleanSrc.endsWith('.mov')) return 'video/quicktime';
    if (cleanSrc.endsWith('.webm')) return 'video/webm';
    return 'video/mp4';
}

function CategoryHeroBannerVideos({
    categoryTitle,
    subtitle,
    videoUrls,
}: {
    categoryTitle: string;
    subtitle: string;
    videoUrls: string[];
}) {
    const multi = videoUrls.length > 1;
    const [activeIndex, setActiveIndex] = useState(0);
    const [failedVideos, setFailedVideos] = useState<Set<string>>(() => new Set());
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    useEffect(() => {
        if (!window.matchMedia('(min-width: 768px)').matches) return;
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
    }, [activeIndex, multi, videoUrls]);

    return (
        <div className="relative mb-12 h-[250px] w-full overflow-hidden md:h-[350px]">
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${HERO_VIDEO_POSTER})` }}
                aria-hidden
            />
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
                        poster={HERO_VIDEO_POSTER}
                        muted
                        playsInline
                        preload="metadata"
                        onError={() => {
                            setFailedVideos((prev) => new Set(prev).add(src));
                        }}
                        onEnded={() => {
                            if (!multi) return;
                            if (i !== activeIndex) return;
                            setActiveIndex((a) => (a + 1) % videoUrls.length);
                        }}
                    >
                        <source src={src} type={getVideoMimeType(src)} />
                    </video>
                ))}
            </div>
            {failedVideos.size >= videoUrls.length && (
                <div className="absolute inset-0 z-[1] bg-black/20" aria-hidden />
            )}
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

function CategoryHeroBannerImage({
    categoryTitle,
    subtitle,
    imageUrl,
}: {
    categoryTitle: string;
    subtitle: string;
    imageUrl: string;
}) {
    const [imageOk, setImageOk] = useState(true);

    if (!imageOk) {
        return (
            <div className="relative mb-12 h-[250px] w-full overflow-hidden md:h-[350px]">
                <div
                    className="absolute inset-0 z-0 bg-gradient-to-br from-slate-900 via-green-950 to-slate-900"
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
            <Image
                src={imageUrl}
                alt={`${categoryTitle} — TehnicAgro Supply`}
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
                onError={() => setImageOk(false)}
            />
            <div className="pointer-events-none absolute inset-0 z-[5] bg-black/45" aria-hidden />
            <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center">
                <h1 className="normal-case text-3xl font-semibold tracking-tight text-white drop-shadow-lg md:text-4xl">
                    {categoryTitle}
                </h1>
                <p className="mt-3 max-w-3xl text-sm text-gray-100 drop-shadow-md md:text-base">{subtitle}</p>
            </div>
        </div>
    );
}

export function CategoryHeroBanner({ categoryTitle, subtitle, videoUrls, imageUrl }: CategoryHeroBannerProps) {
    const hasVideo = videoUrls.length > 0;
    const hasImage = Boolean(imageUrl?.trim());
    const urlsKey = videoUrls.join('\0');

    if (!hasVideo && hasImage) {
        return (
            <CategoryHeroBannerImage
                categoryTitle={categoryTitle}
                subtitle={subtitle}
                imageUrl={imageUrl as string}
            />
        );
    }

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
        <CategoryHeroBannerVideos key={urlsKey} categoryTitle={categoryTitle} subtitle={subtitle} videoUrls={videoUrls} />
    );
}
