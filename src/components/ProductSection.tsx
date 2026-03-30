'use client';

import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { TechSpecsModal } from './TechSpecsModal';
import { CONTACT_SECTION_ID, scrollToIdSmooth } from '@/lib/scroll-to-anchor';
import {
    getWebHeroTitleParts,
    shouldUseGiantModelLine,
    type WebHeroTitleParts,
} from '@/lib/product-hero-display';
import {
    buildDetailMoodboardUrls,
    getBrochureDetailPageBody,
    getBrochureIntroBullets,
} from '@/lib/product-brochure-detail';

export interface ProductFeatureBlockInput {
    image: string;
    title: string;
    description: string;
}

interface ProductProps {
    title: string;
    description: string;
    longDescription?: string;
    imageSrc: string;
    specs: string[];
    ctaLabel: string;
    id?: string;
    badge?: string;
    detailedSpecs?: Record<string, unknown>;
    expertVerdict?: string;
    brand?: string;
    categoryLabel?: string;
    secondaryImages?: string[];
    /** Pentru parsare nume / model ca în broșură */
    slug?: string;
    /**
     * Galeria „curată” (ca în PDF catalog): primele imagini pentru coloana stângă pag. 2.
     * Diferă de imaginile din blocurile detaliu — acelea apar mai jos dacă sunt completate.
     */
    gallery?: string[];
    /** Opțional: secțiuni suplimentare (imagine + text) sub layout-ul principal tip broșură. */
    featureBlocks?: ProductFeatureBlockInput[];
}

const sectionContainer = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';
const sectionY = 'py-12 md:py-16';

function splitPrincipleAndPresentation(description: string, longDescription?: string): {
    principle: string;
    presentation: string;
} {
    const short = (description || '').trim();
    const long = (longDescription || '').trim();
    if (long && long !== short) {
        return { principle: short || long.slice(0, 500), presentation: long };
    }
    const parts = short.split(/\n\s*\n/).filter(Boolean);
    if (parts.length >= 2) {
        return { principle: parts[0].trim(), presentation: parts.slice(1).join('\n\n').trim() };
    }
    return { principle: short, presentation: short };
}

const giantModelClass =
    'text-5xl sm:text-6xl font-bold uppercase tracking-tight text-[#1B4332] leading-[0.95] font-sans';
const balancedSecondLineClass =
    'text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[#1B4332] leading-snug text-pretty font-sans';

function HeroTitleColumn({ parts, brandLine }: { parts: WebHeroTitleParts; brandLine: string }) {
    if (parts.mode === 'split') {
        const giant = shouldUseGiantModelLine(parts.modelLine);
        return (
            <div className="space-y-4">
                {brandLine ? (
                    <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-zinc-500">{brandLine}</p>
                ) : null}
                <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-wide text-zinc-900 leading-[1.15] text-pretty">
                    {parts.machineName}
                </h1>
                <p className={giant ? giantModelClass : balancedSecondLineClass}>{parts.modelLine}</p>
            </div>
        );
    }
    const lines = parts.lines.filter(Boolean);
    if (lines.length === 1) {
        const one = lines[0] || '';
        const giant = shouldUseGiantModelLine(one);
        return (
            <div className="space-y-4">
                {brandLine ? (
                    <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-zinc-500">{brandLine}</p>
                ) : null}
                {giant ? (
                    <h1 className={`${giantModelClass} text-pretty`}>
                        {one}
                    </h1>
                ) : (
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-wide text-zinc-900 leading-[1.15] text-pretty">
                        {one}
                    </h1>
                )}
            </div>
        );
    }
    const line = lines[0] || '';
    const second = lines.slice(1).join(' ');
    const secondGiant = shouldUseGiantModelLine(second);
    return (
        <div className="space-y-4">
            {brandLine ? (
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-zinc-500">{brandLine}</p>
            ) : null}
            <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-wide text-zinc-900 leading-[1.15] text-pretty">
                {line}
            </h1>
            {second ? (
                <p className={secondGiant ? giantModelClass : balancedSecondLineClass}>{second}</p>
            ) : null}
        </div>
    );
}

export function ProductSection({
    title,
    description,
    longDescription,
    imageSrc,
    specs,
    ctaLabel,
    id,
    badge,
    detailedSpecs,
    expertVerdict,
    brand,
    categoryLabel,
    secondaryImages = [],
    slug,
    gallery: galleryProp,
    featureBlocks,
}: ProductProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [heroOk, setHeroOk] = useState(true);
    const [moodImgOk, setMoodImgOk] = useState<Record<number, boolean>>({});
    const [overflowImgOk, setOverflowImgOk] = useState<Record<number, boolean>>({});
    const [featureImgOk, setFeatureImgOk] = useState<Record<number, boolean>>({});

    const { principle } = useMemo(
        () => splitPrincipleAndPresentation(description, longDescription),
        [description, longDescription]
    );

    const heroTitles = useMemo(
        () => getWebHeroTitleParts(title, brand, slug),
        [title, brand, slug]
    );

    const brandLine = [brand, categoryLabel].filter(Boolean).join(' · ');

    const secondaryDeduped = useMemo(
        () =>
            secondaryImages.filter(
                (u, i, arr) => Boolean(u && u.trim()) && arr.indexOf(u) === i
            ),
        [secondaryImages]
    );

    const moodboardUrls = useMemo(
        () => buildDetailMoodboardUrls(imageSrc, galleryProp, secondaryDeduped),
        [imageSrc, galleryProp, secondaryDeduped]
    );

    const brochureBody = useMemo(
        () => getBrochureDetailPageBody(slug, description, longDescription),
        [slug, description, longDescription]
    );

    const introBullets = useMemo(() => getBrochureIntroBullets(slug), [slug]);

    const moodboardSet = useMemo(() => new Set(moodboardUrls), [moodboardUrls]);

    const overflowGalleryUrls = useMemo(
        () => secondaryDeduped.filter((u) => u && !moodboardSet.has(u)),
        [secondaryDeduped, moodboardSet]
    );

    const detailFeatureRows = useMemo(
        () =>
            (featureBlocks || [])
                .map((b) => ({
                    image: String(b?.image || '').trim(),
                    title: String(b?.title || '').trim(),
                    body: String(b?.description || '').trim(),
                }))
                .filter((b) => b.image && (b.title || b.body)),
        [featureBlocks]
    );

    const brochurePairImages = useMemo(() => {
        const main = (imageSrc || '').trim();
        const u0 = (moodboardUrls[0] || main).trim();
        const u1 = (moodboardUrls[1] || u0 || main).trim();
        return { u0, u1 };
    }, [imageSrc, moodboardUrls]);

    return (
        <section id={id} className="bg-white text-zinc-900 overflow-hidden">
            {/* —— Pagina 1: antet două coloane + imagine principală lată dedesubt —— */}
            <div className="bg-white pt-10 pb-8 md:pt-14 md:pb-10">
                <div className={sectionContainer}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 lg:items-end mb-10 md:mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.15 }}
                            transition={{ duration: 0.45 }}
                            onViewportEnter={() => {
                                if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
                                    window.fbq('track', 'ViewContent', {
                                        content_name: title,
                                        content_category: 'Agricultural Machinery',
                                        content_ids: [id || title.replace(/\s/g, '_')],
                                        content_type: 'product',
                                    });
                                }
                            }}
                            className="space-y-5"
                        >
                            {badge ? (
                                <span className="inline-block bg-ea-green-600 text-white text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-widest">
                                    {badge}
                                </span>
                            ) : null}
                            <HeroTitleColumn parts={heroTitles} brandLine={brandLine} />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.15 }}
                            transition={{ duration: 0.45, delay: 0.05 }}
                            className="flex flex-col justify-end"
                        >
                            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#2d6a4f] mb-3">
                                Principiu
                            </p>
                            <p className="text-base sm:text-lg text-zinc-700 leading-relaxed text-pretty font-medium">
                                {principle}
                            </p>
                        </motion.div>
                    </div>

                    {/* Imagine principală: container lat, centrat */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ duration: 0.5, delay: 0.08 }}
                        className="w-full max-w-6xl mx-auto"
                    >
                        <div className="relative w-full aspect-[16/10] sm:aspect-[2/1] rounded-2xl overflow-hidden border border-zinc-200/90 shadow-2xl bg-zinc-100">
                            {heroOk ? (
                                <Image
                                    src={imageSrc}
                                    alt={`${title} — utilaj agricol TehnicAgro Supply`}
                                    title={`${title} — TehnicAgro Supply`}
                                    fill
                                    className="object-cover object-center"
                                    sizes="(max-width: 1152px) 100vw, 1152px"
                                    priority
                                    onError={() => setHeroOk(false)}
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-zinc-500 text-sm">
                                    Imagine indisponibilă
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* —— Pagina 2: zig-zag forțat cu containere flex-col + multiple grile —— */}
            <div className={`bg-slate-50 border-y border-slate-200/90 ${sectionY}`}>
                <div className={sectionContainer}>
                    <div className="flex flex-col gap-16 md:gap-24">

                        {/* RÂNDUL 1 (Poză Stânga, Text Dreapta) */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
                            <div className="w-full aspect-[4/3] relative rounded-2xl overflow-hidden border border-zinc-200 bg-white shadow-sm">
                                {moodImgOk[0] !== false && brochurePairImages.u0 ? (
                                    <Image
                                        src={brochurePairImages.u0}
                                        alt={`${title} — vedere 1`}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                        onError={() => setMoodImgOk((prev) => ({ ...prev, 0: false }))}
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-zinc-500 text-sm p-4 text-center">
                                        Imagine indisponibilă
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col justify-center">
                                <h2 className="text-xs font-black uppercase tracking-[0.28em] text-[#1B4332] mb-4 border-l-4 border-[#2d6a4f] pl-4">
                                    Prezentare tehnică
                                </h2>
                                <div className="text-zinc-700 text-base sm:text-[17px] leading-relaxed whitespace-pre-line text-pretty font-medium">
                                    {brochureBody}
                                </div>
                                <ul className="mt-5 space-y-3">
                                    {introBullets.map((line, i) => (
                                        <li key={i} className="flex gap-3 text-zinc-800 text-sm sm:text-base">
                                            <span className="mt-0.5 shrink-0 font-black text-[#2d6a4f]" aria-hidden>
                                                ›
                                            </span>
                                            <span>{line}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* RÂNDUL 2 (Text Stânga, Poză Dreapta) */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
                            <div className="order-2 lg:order-1 flex flex-col justify-center">
                                <h2 className="text-xs font-black uppercase tracking-[0.28em] text-[#1B4332] mb-4 border-l-4 border-[#2d6a4f] pl-4">
                                    Specificații tehnice
                                </h2>
                                {specs.length > 0 ? (
                                    <ul className="space-y-3">
                                        {specs.map((spec, i) => (
                                            <li key={i} className="flex gap-3 text-zinc-800 text-sm sm:text-base">
                                                <span
                                                    className="mt-1 shrink-0 w-5 h-5 rounded-full bg-[#1B4332]/10 text-[#1B4332] flex items-center justify-center text-[10px] font-black"
                                                    aria-hidden
                                                >
                                                    ›
                                                </span>
                                                <span>{spec}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-zinc-500 italic text-sm">
                                        Specificații disponibile la solicitare.
                                    </p>
                                )}
                            </div>
                            <div className="order-1 lg:order-2 w-full aspect-[4/3] relative rounded-2xl overflow-hidden border border-zinc-200 bg-white shadow-sm">
                                {moodImgOk[1] !== false && brochurePairImages.u1 ? (
                                    <Image
                                        src={brochurePairImages.u1}
                                        alt={`${title} — vedere 2`}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                        onError={() => setMoodImgOk((prev) => ({ ...prev, 1: false }))}
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-zinc-500 text-sm p-4 text-center">
                                        Imagine indisponibilă
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {overflowGalleryUrls.length > 0 ? (
                        <div className="pt-8 border-t border-slate-200 mt-16 md:mt-24">
                            <h2 className="text-xs font-black uppercase tracking-[0.28em] text-[#1B4332] mb-5 border-l-4 border-[#2d6a4f] pl-4">
                                Galerie
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                                {overflowGalleryUrls.map((url, i) => {
                                    const ok = overflowImgOk[i] !== false;
                                    return (
                                        <div
                                            key={`ov-${url}-${i}`}
                                            className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-200 bg-white shadow-md"
                                        >
                                            {ok ? (
                                                <Image
                                                    src={url}
                                                    alt={`${title} — galerie ${i + 1}`}
                                                    fill
                                                    className="object-cover object-center"
                                                    sizes="(max-width: 640px) 100vw, 33vw"
                                                    onError={() =>
                                                        setOverflowImgOk((prev) => ({
                                                            ...prev,
                                                            [i]: false,
                                                        }))
                                                    }
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-zinc-500 text-xs p-3 text-center">
                                                    Imagine indisponibilă
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : null}

                    {detailFeatureRows.length > 0 ? (
                        <div className={`space-y-16 md:space-y-24 pt-16 md:pt-24 border-t border-slate-200 mt-16 md:mt-24`}>
                            {detailFeatureRows.map((row, i) => {
                                const isEven = i % 2 === 0;
                                const ok = featureImgOk[i] !== false;
                                return (
                                    <div
                                        key={`feat-${row.image}-${i}`}
                                        className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center"
                                    >
                                        <div className={`${isEven ? 'order-1' : 'order-1 lg:order-2'} relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-200 bg-white shadow-lg`}>
                                            {ok ? (
                                                <Image
                                                    src={row.image}
                                                    alt={`${title} — ${row.title || 'detaliu'}`}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                                    onError={() =>
                                                        setFeatureImgOk((prev) => ({
                                                            ...prev,
                                                            [i]: false,
                                                        }))
                                                    }
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-zinc-500 text-xs p-4 text-center">
                                                    Imagine indisponibilă
                                                </div>
                                            )}
                                        </div>
                                        <div className={`${isEven ? 'order-2' : 'order-2 lg:order-1'} flex flex-col justify-center`}>
                                            <h2 className="text-xs font-black uppercase tracking-[0.28em] text-[#1B4332] mb-4 border-l-4 border-[#2d6a4f] pl-4">
                                                {row.title || 'În detaliu'}
                                            </h2>
                                            <div className="text-zinc-700 text-base sm:text-[17px] leading-relaxed whitespace-pre-line text-pretty">
                                                {row.body}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Verdict + CTA */}
            <div className={`bg-white ${sectionY} pb-16 md:pb-24`}>
                <div className={`${sectionContainer} space-y-10`}>
                    {expertVerdict ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4 }}
                            className="border-l-4 border-orange-500 bg-orange-50 p-6 md:p-8 rounded-r-2xl border-y border-r border-orange-100/90 shadow-sm"
                        >
                            <h3 className="text-orange-900/90 text-[11px] font-black uppercase tracking-[0.22em] mb-3">
                                Verdictul expertului
                            </h3>
                            <p className="text-lg md:text-xl text-zinc-900 leading-relaxed font-medium text-pretty">
                                {expertVerdict}
                            </p>
                        </motion.div>
                    ) : null}

                    <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                scrollToIdSmooth(CONTACT_SECTION_ID);
                                if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
                                    window.fbq('track', 'InitiateCheckout', {
                                        content_name: title,
                                        content_category: 'Agricultural Machinery',
                                    });
                                }
                            }}
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-ea-green-600 hover:bg-ea-green-500 text-white font-bold rounded-xl shadow-lg uppercase tracking-wide text-sm transition-colors"
                        >
                            {ctaLabel}
                        </button>
                        {detailedSpecs && Object.keys(detailedSpecs).length > 0 ? (
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(true)}
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-zinc-50 text-zinc-900 font-bold rounded-xl border border-zinc-200 shadow-md uppercase tracking-wide text-sm transition-colors"
                            >
                                <FileText className="w-4 h-4" />
                                Specificații detaliate
                            </button>
                        ) : null}
                    </div>
                </div>
            </div>

            <TechSpecsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                productName={title}
                specs={detailedSpecs || {}}
            />
        </section>
    );
}
