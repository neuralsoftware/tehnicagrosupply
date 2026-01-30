'use client';

import { motion } from 'framer-motion';
import { VideoShowcase } from './VideoShowcase';
import { Play, Sparkles } from 'lucide-react';

export function VideoGallery() {
    return (
        <section id="demo" className="py-24 bg-zinc-950 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(22,101,52,0.08),transparent_60%)]"></div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-ea-green-500 text-xs font-black uppercase tracking-[0.2em]">
                            <Play className="w-3 h-3 fill-current" />
                            Video Demonstrații
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black uppercase text-white leading-tight">
                            Vezi Utilajele <span className="text-ea-green-500">în Acțiune</span>
                        </h2>
                        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                            Dovezi reale, nu promisiuni. Urmărește cum funcționează tehnologia noastră direct pe teren.
                        </p>
                    </motion.div>
                </div>

                {/* Videos Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    <VideoShowcase
                        title="Avers-Agro MULTISEM ADS"
                        videoSrc="/downloads/video ADS 2026.mp4"
                        badge="Semănătoare No-Till"
                        ctaText="Solicită Ofertă ADS"
                        ctaHref="#contact"
                    />
                    <VideoShowcase
                        title="Fliegl Chain Disc KSE 680"
                        videoSrc="/downloads/video KSE teren.mp4"
                        badge="Grapă cu Lanțuri"
                        ctaText="Solicită Ofertă KSE"
                        ctaHref="#contact"
                    />
                </div>

                {/* Trust Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 text-center"
                >
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-zinc-900 via-ea-green-950/30 to-zinc-900 border border-zinc-800 text-zinc-400">
                        <Sparkles className="w-4 h-4 text-ea-green-500" />
                        <span className="text-sm font-medium">
                            Filmări reale din teren, fără editări sau efecte speciale
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
