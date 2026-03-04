import { brands, getBrandBySlug } from '@/data/brands-piese';
import { Contact } from '@/components/Contact';
import { TrustSignals } from '@/components/TrustSignals';
import { ChevronRight, CheckCircle2, Package } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    return brands.map((b) => ({ brand: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ brand: string }> }): Promise<Metadata> {
    const { brand: brandSlug } = await params;
    const brand = getBrandBySlug(brandSlug);
    if (!brand) return {};
    return {
        title: brand.metaTitle,
        description: brand.metaDescription,
        keywords: brand.keywords,
        alternates: { canonical: `https://tehnicagrosupply.ro/piese-schimb/${brand.slug}` },
    };
}

export default async function BrandPiesePage({ params }: { params: Promise<{ brand: string }> }) {
    const { brand: brandSlug } = await params;
    const brand = getBrandBySlug(brandSlug);
    if (!brand) notFound();

    const serviceSchema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: `Piese de Schimb ${brand.name} Romania`,
        description: brand.metaDescription,
        provider: {
            '@type': 'Organization',
            name: 'TehnicAgro Supply',
            url: 'https://tehnicagrosupply.ro',
        },
        areaServed: 'RO',
        serviceType: `Piese Schimb ${brand.name}`,
    };

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            ...brand.faq.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
            {
                '@type': 'Question',
                name: `Cât durează livrarea pieselor ${brand.name}?`,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: `Piesele ${brand.name} disponibile prin rețeaua Kramp se livrează în 24-48 ore în România. Piesele la comandă specială pot necesita 5-10 zile lucrătoare, în funcție de disponibilitatea la producător.`,
                },
            },
        ],
    };

    return (
        <main className="min-h-screen bg-white text-zinc-900 pt-32 pb-24">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

            <div className="max-w-7xl mx-auto px-4">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-xs text-zinc-400 uppercase tracking-widest font-bold mb-12">
                    <Link href="/piese-schimb" className="hover:text-ea-green-600 transition-colors">
                        Piese de Schimb
                    </Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-zinc-700">{brand.name}</span>
                </nav>

                {/* Header */}
                <div className="grid lg:grid-cols-2 gap-12 items-start mb-20">
                    <div className="space-y-6">
                        <span className="inline-block text-xs font-bold uppercase tracking-widest text-ea-green-600 bg-ea-green-100 rounded-full px-4 py-1.5">
                            {brand.categoryLabel} · {brand.country}
                        </span>
                        <h1 className="text-5xl md:text-6xl font-black text-zinc-900 uppercase tracking-tighter leading-none">
                            Piese de Schimb<br />
                            <span className="text-ea-green-600">{brand.name}</span>
                        </h1>
                        <p className="text-zinc-500 text-lg max-w-lg">
                            {brand.longDescription}
                        </p>
                        <div className="flex flex-wrap gap-4 pt-2">
                            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                                <CheckCircle2 className="w-4 h-4 text-ea-green-500" /> OEM & Aftermarket
                            </div>
                            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                                <CheckCircle2 className="w-4 h-4 text-ea-green-500" /> Identificare după serie / foto
                            </div>
                            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                                <CheckCircle2 className="w-4 h-4 text-ea-green-500" /> Livrare 24-48h România
                            </div>
                        </div>
                    </div>

                    {/* Stats block */}
                    <div className="bg-zinc-900 rounded-3xl p-8 grid grid-cols-2 gap-4">
                        {[
                            { val: brand.country, sub: 'Țara producătorului' },
                            { val: '24-48h', sub: 'Livrare din stoc Kramp' },
                            { val: 'OEM', sub: 'Piese originale disponibile' },
                            { val: '2h', sub: 'Răspuns la ofertă' },
                        ].map((s) => (
                            <div key={s.sub} className="bg-zinc-800 rounded-2xl p-4 text-center">
                                <p className="text-xl font-black text-white">{s.val}</p>
                                <p className="text-xs text-zinc-400 mt-1 uppercase tracking-wide">{s.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Parts grid */}
                <div className="mb-20">
                    <h2 className="text-3xl font-black text-zinc-900 uppercase tracking-tight mb-8">
                        Piese <span className="text-ea-green-600">Disponibile</span>
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {brand.parts.map((part) => (
                            <div
                                key={part.name}
                                className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 space-y-3 hover:border-ea-green-400 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <Package className="w-5 h-5 text-ea-green-500 flex-shrink-0" />
                                    <h3 className="font-bold text-zinc-900 text-sm uppercase tracking-tight">
                                        {part.name}
                                    </h3>
                                </div>
                                <p className="text-zinc-500 text-xs leading-relaxed">{part.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FAQ */}
                {brand.faq.length > 0 && (
                    <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-10 mb-20">
                        <h2 className="text-2xl font-black text-zinc-900 uppercase tracking-tight mb-8">
                            Întrebări <span className="text-ea-green-600">Frecvente</span>
                        </h2>
                        <div className="space-y-6">
                            {brand.faq.map((f) => (
                                <div key={f.q} className="border-b border-zinc-200 pb-6 last:border-0 last:pb-0">
                                    <p className="font-bold text-zinc-900 mb-2">{f.q}</p>
                                    <p className="text-zinc-500 text-sm leading-relaxed">{f.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Contact */}
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6">
                        <h2 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter">
                            Solicitați o <span className="text-ea-green-600">ofertă rapidă</span>
                        </h2>
                        <p className="text-zinc-500 text-lg">
                            Trimiteți-ne modelul utilajului {brand.name}, piesa sau referința necesară.
                            Vă răspundem în maxim 2 ore cu preț și termen de livrare.
                        </p>
                        <TrustSignals />
                    </div>
                    <div className="bg-zinc-50 p-2 rounded-3xl border border-zinc-200">
                        <Contact />
                    </div>
                </div>
            </div>
        </main>
    );
}
