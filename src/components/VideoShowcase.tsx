'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Maximize2 } from 'lucide-react';

interface VideoShowcaseProps {
    title: string;
    videoSrc: string;
    badge?: string;
    ctaText?: string;
    ctaHref?: string;
}

export function VideoShowcase({ title, videoSrc, badge, ctaText, ctaHref }: VideoShowcaseProps) {
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlay = () => {
        const video = document.getElementById(`video-${title.replace(/\s/g, '')}`) as HTMLVideoElement;
        if (video) {
            if (isPlaying) {
                video.pause();
            } else {
                video.play();
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
            className="relative rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 group"
        >
            {badge && (
                <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-ea-green-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                    {badge}
                </div>
            )}

            <div className="relative aspect-video">
                <video
                    id={`video-${title.replace(/\s/g, '')}`}
                    src={videoSrc}
                    muted
                    loop
                    playsInline
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
                    <h3 className="text-white font-bold text-lg">{title}</h3>
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
                <div className="p-4 bg-zinc-950">
                    <a
                        href={ctaHref}
                        className="block w-full py-3 bg-ea-green-600 hover:bg-ea-green-500 text-white text-center font-bold rounded-xl uppercase tracking-wide transition-all"
                    >
                        {ctaText}
                    </a>
                </div>
            )}
        </motion.div>
    );
}
