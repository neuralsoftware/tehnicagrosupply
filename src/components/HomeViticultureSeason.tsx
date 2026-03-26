import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const VITICULTURE_BG = '/images/viticulture-season-bg.jpg';

/** Card categorie premium — viticultură (imagine + overlay), nu alertă de sistem */
export function HomeViticultureSeason({ catalogHref }: { catalogHref: string }) {
    return (
        <section className="border-y border-zinc-100 bg-white py-8 md:py-10" aria-labelledby="viticulture-season-heading">
            <div className="max-w-7xl mx-auto px-4">
                <div className="relative min-h-[260px] md:min-h-[300px] rounded-2xl overflow-hidden shadow-md border border-zinc-200/80">
                    <div
                        className="absolute inset-0 bg-cover bg-center scale-[1.02]"
                        style={{ backgroundImage: `url(${VITICULTURE_BG})` }}
                        role="img"
                        aria-label="Vie și echipamente viticole"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/35" aria-hidden />
                    <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-12 md:py-14 max-w-2xl mx-auto">
                        <h2 id="viticulture-season-heading" className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white tracking-tight leading-tight drop-shadow-sm">
                            Echipamente de sezon: Viticultură
                        </h2>
                        <p className="mt-3 text-sm md:text-base text-white/85 max-w-lg leading-relaxed">
                            Gama pentru vie, pregătirea solului și campania viticolă — aceeași calitate ca în cereale.
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
