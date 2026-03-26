import Link from 'next/link';
import { ArrowRight, Grape } from 'lucide-react';

/** Sub hero — direcționare clară către catalogul de sezon viticol */
export function HomeViticultureSeason() {
    return (
        <section className="py-14 md:py-16 bg-white border-y border-zinc-100" aria-labelledby="viticulture-season-heading">
            <div className="max-w-5xl mx-auto px-4">
                <div className="relative overflow-hidden rounded-3xl border border-emerald-100/80 bg-gradient-to-br from-emerald-50/90 via-white to-zinc-50/80 shadow-sm px-6 py-8 md:px-10 md:py-10 md:flex md:items-center md:justify-between md:gap-10">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="relative flex items-start gap-4 mb-6 md:mb-0">
                        <div className="shrink-0 w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-900/10">
                            <Grape className="w-6 h-6" aria-hidden />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-emerald-700 uppercase tracking-[0.2em] mb-1">
                                Echipamente de sezon
                            </p>
                            <h2 id="viticulture-season-heading" className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">
                                Viticultură
                            </h2>
                            <p className="text-zinc-600 mt-2 text-sm md:text-base max-w-lg leading-relaxed">
                                Selecție de utilaje pentru vie, pregătirea terenului și campania din domeniul viticol.
                            </p>
                        </div>
                    </div>
                    <div className="relative shrink-0">
                        <Link
                            href="/utilaje/viticol"
                            className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-7 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold tracking-wide transition-all shadow-lg shadow-emerald-600/20"
                        >
                            Vezi utilajele pentru viticultură
                            <ArrowRight className="w-4 h-4" aria-hidden />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
