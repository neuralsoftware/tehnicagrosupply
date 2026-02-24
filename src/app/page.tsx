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
                        Producători Reprezentați
                    </p>
                    <div className="flex items-center justify-center gap-16 flex-wrap opacity-80 hover:opacity-100 transition-opacity">
                        <img src="/logos/brands/avers-agro.png" alt="Avers-Agro" className="h-12 object-contain invert brightness-90 hover:invert-0 hover:brightness-100 transition-all duration-300" />
                        <img src="/logos/brands/fliegl.svg" alt="Fliegl Agrartechnik" className="h-9 object-contain invert brightness-90 hover:invert-0 hover:brightness-100 transition-all duration-300" />
                        <img src="/logos/brands/k-factor.webp" alt="K-Factor Trailers" className="h-9 object-contain opacity-90 hover:opacity-100 transition-all duration-300" />
                    </div>
                </div>
            </section>

            <Contact />

            <WhatsAppButton />
            <ExitIntentPopup />
        </main>
    );
}
