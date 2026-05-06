'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { CONTACT_SECTION_ID, onHashLinkClickSmooth } from '@/lib/scroll-to-anchor';

function HeroContent() {
    const searchParams = useSearchParams();
    const ref = searchParams.get('ref');

    const defaultHeadline = (
        <>
            <span className="block text-white tracking-tight drop-shadow-sm">
                Tehnologie agricolă pentru performanță maximă.
            </span>
            <span className="block mt-3 text-lg sm:text-xl md:text-2xl font-normal text-emerald-200/95 tracking-tight drop-shadow-sm">
                Soluții premium pentru cultură mare și viticultură.
            </span>
        </>
    );

    let headline = defaultHeadline;

    if (ref === 'subventie') {
        headline = (
            <>
                <span className="block text-white tracking-tight drop-shadow-sm">
                    Tehnologie agricolă pentru performanță maximă.
                </span>
                <span className="block mt-3 text-lg sm:text-xl md:text-2xl font-normal text-emerald-200/95 tracking-tight drop-shadow-sm">
                    Ghidare pentru eco-scheme și conformitate PAC.
                </span>
            </>
        );
    } else if (ref === 'roi') {
        headline = (
            <>
                <span className="block text-white tracking-tight drop-shadow-sm">
                    Tehnologie agricolă pentru performanță maximă.
                </span>
                <span className="block mt-3 text-lg sm:text-xl md:text-2xl font-normal text-emerald-200/95 tracking-tight drop-shadow-sm">
                    Date clare pentru decizii în ferma ta.
                </span>
            </>
        );
    } else if (ref === 'avers') {
        headline = (
            <>
                <span className="block text-white tracking-tight drop-shadow-sm">
                    Tehnologie agricolă pentru performanță maximă.
                </span>
                <span className="block mt-3 text-lg sm:text-xl md:text-2xl font-normal text-emerald-200/95 tracking-tight drop-shadow-sm">
                    Avers-Agro și soluții No-Till de precizie.
                </span>
            </>
        );
    } else if (ref === 'dr12') {
        headline = (
            <>
                <span className="block text-white tracking-tight drop-shadow-sm">
                    Tehnologie agricolă pentru performanță maximă.
                </span>
                <span className="block mt-3 text-lg sm:text-xl md:text-2xl font-normal text-emerald-200/95 tracking-tight drop-shadow-sm">
                    Finanțare și utilaje aliniate la programele naționale.
                </span>
            </>
        );
    }

    return (
        <section className="relative flex min-h-[640px] items-center justify-center overflow-hidden pt-14 pb-20 md:min-h-[680px] md:pb-12">
            <Image
                src="/images/hero-wheat-field.jpg"
                alt=""
                fill
                priority
                sizes="100vw"
                className="absolute inset-0 z-0 object-cover object-center"
                aria-hidden
            />
            <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/25 via-emerald-950/35 to-slate-950/70" aria-hidden />
            <div className="absolute inset-0 z-[2] bg-[radial-gradient(circle_at_50%_42%,rgba(0,0,0,0.05),rgba(0,0,0,0.38)_72%)]" aria-hidden />

            <div className="relative z-10 mx-auto max-w-3xl px-6 text-center space-y-5 sm:space-y-6">
                <h1 className="mx-auto max-w-[22rem] px-2 text-2xl font-semibold leading-tight text-white normal-case text-balance drop-shadow-lg sm:max-w-2xl sm:text-4xl md:text-[2.7rem]">
                    {headline}
                </h1>

                <p className="mx-auto max-w-2xl px-2 text-sm font-medium leading-relaxed text-white/85 drop-shadow sm:text-base">
                    Utilaje și consultanță pentru ferme care cer fiabilitate, randament și respectarea standardelor în câmp.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-1">
                    <Link
                        href="#audit"
                        className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white text-sm sm:text-base font-medium rounded-lg transition-colors shadow-lg shadow-black/25 text-center"
                    >
                        Calculează beneficiul fermei tale
                    </Link>
                    <a
                        href={`#${CONTACT_SECTION_ID}`}
                        onClick={(e) => onHashLinkClickSmooth(e, `#${CONTACT_SECTION_ID}`)}
                        className="w-full sm:w-auto px-6 py-3 rounded-lg font-medium text-sm sm:text-base border border-white/35 bg-white/10 text-white hover:bg-white/15 backdrop-blur-sm transition-colors text-center"
                    >
                        Solicită expertiză tehnică
                    </a>
                </div>
            </div>
        </section>
    );
}

export function Hero() {
    return (
        <Suspense
            fallback={
                <div className="min-h-[60vh] bg-gradient-to-br from-slate-900 via-green-950 to-slate-900 flex items-center justify-center">
                    <div className="h-8 w-8 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                </div>
            }
        >
            <HeroContent />
        </Suspense>
    );
}
