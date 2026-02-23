import { Hero } from '@/components/Hero';
import { FeaturedMachinery } from '@/components/FeaturedMachinery';
import { Contact } from '@/components/Contact';
import { LegalProof } from '@/components/LegalProof';
import { RoiCalculator } from '@/components/RoiCalculator';
import { TrustSignals } from '@/components/TrustSignals';
import { ExpertAuthority } from '@/components/ExpertAuthority';
import { VideoGallery } from '@/components/VideoGallery';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { ExitIntentPopup } from '@/components/ExitIntentPopup';
import { SocialProof } from '@/components/SocialProof';
import { InlineCTA } from '@/components/InlineCTA';

export default function Home() {
    // Schema.org JSON-LD for SEO Rich Results
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "TehnicAgro Supply",
        "url": "https://tehnic-agro-funnel.vercel.app",
        "logo": "https://tehnic-agro-funnel.vercel.app/logos/tehnicagro_logo_v1_1769155922952.png",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+40-723-380-022",
            "contactType": "Sales",
            "areaServed": "RO",
            "availableLanguage": "Romanian"
        },
        "description": "Furnizor de utilaje agricole No-Till și soluții pentru agricultura conservativă în România.",
        "sameAs": [
            "https://wa.me/40723380022"
        ]
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Ce este subvenția APIA PD-04 și cum o pot accesa?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Eco-schema PD-04 oferă 56 EUR/ha pentru agricultura conservativă (No-Till, Mini-Till). Pentru a fi eligibil, trebuie să folosești utilaje care nu inversează solul și să menții resturile vegetale la suprafață. Semănătoarea Avers-Agro Green Plains îndeplinește toate cerințele."
                }
            },
            {
                "@type": "Question",
                "name": "Ce înseamnă GAEC 6 și de ce este important?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "GAEC 6 impune acoperirea solului pe teren arabil în perioada 15 iunie - 15 octombrie. Trebuie să lași resturile vegetale la suprafață sau să cultivi culturi intermediare. Grapa Fliegl Chain Disc mărunțește resturile fără să le îngropă, asigurând conformitatea."
                }
            },
            {
                "@type": "Question",
                "name": "Cât economisesc cu tehnologia No-Till?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "În medie, fermierii economisesc 320 RON/ha la motorină prin reducerea numărului de treceri. La 100 hectare, aceasta înseamnă 32.000 RON/an economie, plus subvenția de 28.140 RON (56 EUR x 100 ha x 5 RON/EUR)."
                }
            }
        ]
    };

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-ea-green-500 selection:text-white pt-16">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <Hero />

            {/* Social Proof - Immediate trust & activity */}
            <SocialProof />

            {/* ROI Calculator - Main conversion hook */}
            <RoiCalculator />

            {/* CTA break */}
            <InlineCTA variant="contact" />

            {/* Legal context - Why this matters now */}
            <LegalProof />

            <TrustSignals />

            {/* Featured Machinery - The new product portal */}
            <FeaturedMachinery />

            {/* Video Demo - Dovezi Reale */}
            <VideoGallery />

            <ExpertAuthority />

            {/* Partner Logos Section */}
            <section className="py-12 bg-zinc-950 border-y border-zinc-900">
                <div className="max-w-5xl mx-auto px-4">
                    <p className="text-center text-zinc-600 text-sm uppercase tracking-widest font-bold mb-8">
                        Parteneri Tehnologici de Încredere
                    </p>
                    <div className="flex items-center justify-center gap-12 flex-wrap opacity-60 hover:opacity-100 transition-opacity">
                        <div className="text-2xl font-black text-zinc-400 uppercase tracking-tight">Avers-Agro</div>
                        <div className="text-2xl font-black text-zinc-400 uppercase tracking-tight">Fliegl</div>
                        <div className="text-2xl font-black text-zinc-400 uppercase tracking-tight">APIA RO</div>
                    </div>
                </div>
            </section>

            <Contact />

            <footer className="py-12 bg-black border-t border-zinc-900">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <h3 className="text-xl font-black text-white uppercase tracking-wide">
                        Tehnic<span className="text-ea-green-500">Agro</span> Supply
                    </h3>
                    <p className="text-zinc-500 text-xs mt-4">&copy; 2026 TehnicAgro Supply. Toate drepturile rezervate.</p>
                </div>
            </footer>

            <WhatsAppButton />
            <ExitIntentPopup />
        </main>
    );
}
