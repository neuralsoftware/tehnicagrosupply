'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Maximize2 } from 'lucide-react';
import { onHashLinkClickSmooth } from '@/lib/scroll-to-anchor';

const VIDEO_POSTER_DEFAULT = '/images/category-hero-video-poster.jpg';

interface VideoShowcaseProps {
    title: string;
    videoSrc: string;
    /** Poster comprimat pentru LCP până se încarcă clipul */
    posterSrc?: string;
    badge?: string;
    ctaText?: string;
    ctaHref?: string;
    autoPlay?: boolean;
}

export function VideoShowcase({
    title,
    videoSrc,
    posterSrc = VIDEO_POSTER_DEFAULT,
    badge,
    ctaText,
    ctaHref,
    autoPlay = false,
}: VideoShowcaseProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [hasLoadedVideo, setHasLoadedVideo] = useState(autoPlay);
    const [pendingPlay, setPendingPlay] = useState(autoPlay);
    const [videoFailed, setVideoFailed] = useState(false);

    useEffect(() => {
        if (!pendingPlay || !hasLoadedVideo || !videoRef.current) return;

        videoRef.current
            .play()
            .catch(() => {
                setIsPlaying(false);
                setPendingPlay(false);
            });
    }, [hasLoadedVideo, pendingPlay]);

    const handlePlay = () => {
        if (!hasLoadedVideo) {
            setHasLoadedVideo(true);
            setPendingPlay(true);
            return;
        }

        const video = videoRef.current;
        if (video) {
            if (isPlaying) {
                video.pause();
            } else {
                setPendingPlay(true);
                video.play().catch(() => {
                    setIsPlaying(false);
                    setPendingPlay(false);
                });
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleFullscreen = () => {
        if (!hasLoadedVideo) {
            setHasLoadedVideo(true);
            return;
        }

        const video = videoRef.current;
        if (video) {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden bg-white border border-zinc-200 shadow-sm group"
        >
            {badge && (
                <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-ea-green-600 text-white text-xs font-medium rounded-full shadow-lg">
                    {badge}
                </div>
            )}

            <div className="relative aspect-video" role="region" aria-label={`Demonstrație video: ${title}`}>
                {videoFailed ? (
                    <Image src={posterSrc} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" aria-hidden="true" />
                ) : !hasLoadedVideo ? (
                    <Image src={posterSrc} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" aria-hidden="true" />
                ) : (
                    <video
                        ref={videoRef}
                        id={`video-${title.replace(/\s/g, '')}`}
                        src={videoSrc}
                        poster={posterSrc}
                        title={`Demonstrație video: ${title}`}
                        aria-label={`Film demonstrativ ${title}. Folosește controalele pentru redare sau pauză.`}
                        muted
                        loop
                        playsInline
                        autoPlay={autoPlay}
                        preload="none"
                        className="w-full h-full object-cover"
                        onPlay={() => {
                            setIsPlaying(true);
                            setPendingPlay(false);
                            if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
                                window.fbq('trackCustom', 'VideoPlay', {
                                    content_name: title,
                                    video_title: title,
                                });
                            }
                        }}
                        onPause={() => {
                            setIsPlaying(false);
                            setPendingPlay(false);
                        }}
                        onEnded={() => setIsPlaying(false)}
                        onError={() => {
                            setVideoFailed(true);
                            setIsPlaying(false);
                            setPendingPlay(false);
                        }}
                    />
                )}

                {/* Overlay Controls */}
                <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                    <button
                        type="button"
                        onClick={handlePlay}
                        aria-label={isPlaying ? `Pauză: ${title}` : `Redă demonstrația video ${title}`}
                        className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110"
                    >
                        {isPlaying ? (
                            <div className="w-6 h-6 flex gap-1.5">
                                <div className="w-2 h-full bg-white rounded-full"></div>
                                <div className="w-2 h-full bg-white rounded-full"></div>
                            </div>
                        ) : (
                            <Play className="w-8 h-8 text-white fill-white ml-1" />
                        )}
                    </button>
                </div>

                {/* Bottom Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between">
                    <h3 className="text-white font-semibold text-base md:text-lg tracking-tight">{title}</h3>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleFullscreen}
                            className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all"
                            title={`Ecran complet: ${title}`}
                            aria-label={`Ecran complet — ${title}`}
                        >
                            <Maximize2 className="w-4 h-4 text-white" />
                        </button>
                    </div>
                </div>
            </div>

            {ctaText && ctaHref && (
                <div className="p-4 bg-zinc-50">
                    <a
                        href={ctaHref}
                        onClick={
                            ctaHref.startsWith('#')
                                ? (e) => onHashLinkClickSmooth(e, ctaHref)
                                : undefined
                        }
                        className="block w-full py-3 bg-ea-green-600 hover:bg-ea-green-500 text-white text-center text-sm font-medium rounded-xl transition-all"
                    >
                        {ctaText}
                    </a>
                </div>
            )}
        </motion.div>
    );
}
