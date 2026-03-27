'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Maximize2 } from 'lucide-react';

const VIDEO_POSTER_DEFAULT = '/images/category-hero-video-poster.jpg';

interface VideoShowcaseProps {
    title: string;
    videoSrc: string;
    /** Poster comprimat pentru LCP până se încarcă clipul */
    posterSrc?: string;
    badge?: string;
    ctaText?: string;
    ctaHref?: string;
}

export function VideoShowcase({
    title,
    videoSrc,
    posterSrc = VIDEO_POSTER_DEFAULT,
    badge,
    ctaText,
    ctaHref,
}: VideoShowcaseProps) {
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlay = () => {
        const video = document.getElementById(`video-${title.replace(/\s/g, '')}`) as HTMLVideoElement;
        if (video) {
            if (isPlaying) {
                video.pause();
            } else {
                video.play();
                // Track Video Play
                if (typeof window !== 'undefined' && (window as any).fbq) {
                    (window as any).fbq('trackCustom', 'VideoPlay', {
                        content_name: title,
                        video_title: title
                    });
                }
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleFullscreen = () => {
        const video = document.getElementById(`video-${title.replace(/\s/g, '')}`) as HTMLVideoElement;
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

            <div className="relative aspect-video">
                <video
                    id={`video-${title.replace(/\s/g, '')}`}
                    src={videoSrc}
                    poster={posterSrc}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                    onEnded={() => setIsPlaying(false)}
                />

                {/* Overlay Controls */}
                <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                    <button
                        onClick={handlePlay}
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
                            onClick={handleFullscreen}
                            className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all"
                            title="Fullscreen"
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
                        className="block w-full py-3 bg-ea-green-600 hover:bg-ea-green-500 text-white text-center text-sm font-medium rounded-xl transition-all"
                    >
                        {ctaText}
                    </a>
                </div>
            )}
        </motion.div>
    );
}
