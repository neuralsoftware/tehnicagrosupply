import Image from 'next/image';
import Link from 'next/link';
import { CONTACT_SECTION_ID } from '@/lib/scroll-to-anchor';
import { SafeBackgroundVideo } from '@/components/SafeBackgroundVideo';
import { getTehnicagroStoragePublicUrl } from '@/lib/storage-video-public';

const HERO_VIDEO = getTehnicagroStoragePublicUrl('video/home-showcase/camp de grau .mp4');
const HERO_POSTER = '/images/hero-wheat-field.jpg';

export function Hero({ refSource }: { refSource?: string }) {
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

    if (refSource === 'subventie') {
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
    } else if (refSource === 'roi') {
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
    } else if (refSource === 'avers') {
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
    } else if (refSource === 'dr12') {
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
                src={HERO_POSTER}
                alt=""
                fill
                priority
                sizes="100vw"
                className="absolute inset-0 z-0 h-full w-full object-cover object-center"
                aria-hidden="true"
            />
            <SafeBackgroundVideo
                className="absolute inset-0 z-0 hidden h-full w-full md:block"
                src={HERO_VIDEO}
                poster={HERO_POSTER}
                minViewportWidth={768}
                preload="metadata"
            />
            <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/25 via-emerald-950/35 to-slate-950/70" aria-hidden />
            <div className="absolute inset-0 z-[2] bg-[radial-gradient(circle_at_50%_42%,rgba(0,0,0,0.05),rgba(0,0,0,0.38)_72%)]" aria-hidden />

            <div className="relative z-10 mx-auto w-full max-w-3xl px-6 text-center space-y-5 sm:space-y-6">
                <h1 className="mx-auto max-w-[19rem] text-2xl font-semibold leading-tight text-white normal-case text-balance drop-shadow-lg sm:max-w-2xl sm:text-4xl md:text-[2.7rem]">
                    {headline}
                </h1>

                <p className="mx-auto max-w-[19rem] text-sm font-medium leading-relaxed text-white/85 drop-shadow sm:max-w-2xl sm:text-base">
                    Utilaje și consultanță pentru ferme care cer fiabilitate, randament și respectarea standardelor în câmp.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-1">
                    <Link
                        href="#audit"
                        className="w-full max-w-[21rem] sm:w-auto sm:max-w-none px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white text-sm sm:text-base font-medium rounded-lg transition-colors shadow-lg shadow-black/25 text-center"
                    >
                        Calculează beneficiul fermei tale
                    </Link>
                    <a
                        href={`#${CONTACT_SECTION_ID}`}
                        className="w-full max-w-[21rem] sm:w-auto sm:max-w-none px-6 py-3 rounded-lg font-medium text-sm sm:text-base border border-white/35 bg-white/10 text-white hover:bg-white/15 backdrop-blur-sm transition-colors text-center"
                    >
                        Solicită expertiză tehnică
                    </a>
                </div>
            </div>
        </section>
    );
}
