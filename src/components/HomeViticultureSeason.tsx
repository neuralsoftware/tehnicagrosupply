import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const SEASON_BG = '/images/hero-wheat-field.jpg';

/** Card categorie premium — echipamente de sezon (imagine + overlay), nu alertă de sistem */
export function HomeViticultureSeason({ catalogHref }: { catalogHref: string }) {
    return (
        <section className="border-y border-zinc-100 bg-white py-8 md:py-10" aria-labelledby="season-equipment-heading">
            <div className="max-w-7xl mx-auto px-4">
                <div className="relative min-h-[260px] md:min-h-[300px] rounded-2xl overflow-hidden shadow-md border border-zinc-200/80">
                    <div
                        className="absolute inset-0 bg-cover bg-center scale-[1.02]"
                        style={{ backgroundImage: `url(${SEASON_BG})` }}
                        role="img"
                        aria-label="Câmp de cereale pentru campania de recoltare"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/35" aria-hidden />
                    <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-12 md:py-14 max-w-2xl mx-auto">
                        <h2 id="season-equipment-heading" className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white tracking-tight leading-tight drop-shadow-sm">
                            Echipamente de sezon: Recoltare & Logistică
                        </h2>
                        <p className="mt-3 text-sm md:text-base text-white/85 max-w-lg leading-relaxed">
                            Remorci, buncăre de transfer și echipamente pentru campania de recoltare, cu focus pe flux rapid și pierderi reduse.
                        </p>
                        <Link
                            href={catalogHref}
                            className="mt-8 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white text-zinc-900 text-sm font-medium hover:bg-zinc-100 transition-colors shadow-lg"
                        >
                            Explorează gama
                            <ArrowRight className="w-4 h-4" aria-hidden />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
