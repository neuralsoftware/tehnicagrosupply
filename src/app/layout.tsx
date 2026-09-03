import CookieBanner from '@/components/CookieBanner';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ConsentGatedMarketing } from '@/components/ConsentGatedMarketing';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { MobileStickyCTA } from '@/components/MobileStickyCTA';
import { SITE_CONTACT } from '@/lib/site-contact';
import { GoogleAnalytics } from '@next/third-parties/google';
import { CONSENT_BOOTSTRAP_SCRIPT } from '@/lib/consent';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-KR6928Z45R';
const GOOGLE_SITE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();

/* Oswald a fost eliminat: era descărcat la fiecare vizită dar neutilizat în niciun stil. */
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
};

export const metadata: Metadata = {
    metadataBase: new URL('https://tehnicagrosupply.ro'),
    title: "Tehnicagro Supply | Utilaje Agricole No-Till & Subvenții APIA 2027",
    description: "Soluții complete pentru agricultura conservativă. Avers-Agro Multisem ADS & Fliegl KSE 680. Conformitate GAEC 6 și pregătire subvenție APIA PD-04 campania 2027. Reducere costuri motorină.",
    keywords: ["utilaje agricole", "no-till", "avers-agro", "fliegl", "subventii apia 2027", "pd-04", "gaec 6", "semanatoare directa", "grapa cu lanturi"],
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: 'any' },
            { url: '/logos/tehnicagro_logo_v1_1769155922952.png', type: 'image/png' }
        ],
        apple: '/logos/tehnicagro_logo_v1_1769155922952.png',
    },
    openGraph: {
        title: "Tehnicagro Supply - Eficiență Maximă în Fermă",
        description: "Pregătire campania APIA 2027: 56 EUR/ha cu PD-04 + conformitate GAEC 6. Economisești 320 RON/ha la motorină din prima zi.",
        type: "website",
        locale: "ro_RO",
        url: "https://tehnicagrosupply.ro",
        siteName: "TehnicAgro Supply",
        images: [
            {
                url: '/api/og',
                width: 1200,
                height: 630,
                alt: 'TehnicAgro Supply - Utilaje Agricole No-Till',
            }
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: "Tehnicagro Supply | Utilaje Agricole No-Till",
        description: "Pregătire subvenție APIA PD-04 (56 EUR/ha) campania 2027 + 320 RON/ha economie motorină. Calculează beneficiul fermei tale!",
        images: ['/api/og'],
    },
    alternates: {
        canonical: 'https://tehnicagrosupply.ro',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ro" className={`${inter.variable} scroll-smooth`}>
            <head>
                {/* Facebook Domain Verification */}
                <meta name="facebook-domain-verification" content="6oeyh29v3v848nr6qv4bsvovm2irfd" />
                {GOOGLE_SITE_VERIFICATION ? (
                    <meta name="google-site-verification" content={GOOGLE_SITE_VERIFICATION} />
                ) : null}

            </head>
            <body className={inter.className}>
                {/* Schema.org Organization Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            "name": "TehnicAgro Supply",
                            "url": "https://tehnicagrosupply.ro",
                            "logo": "https://tehnicagrosupply.ro/logos/tehnicagro_logo_v1_1769155922952.png",
                            "description": "Soluții complete pentru agricultura conservativă. Utilaje No-Till, Avers-Agro Multisem ADS \u0026 Fliegl KSE 680. Conformitate GAEC 6 și pregătire subvenție APIA PD-04 campania 2027.",
                            "email": SITE_CONTACT.email,
                            "address": {
                                "@type": "PostalAddress",
                                "addressLocality": "Lumina",
                                "addressRegion": "Constanța",
                                "addressCountry": "RO"
                            },
                            "contactPoint": {
                                "@type": "ContactPoint",
                                "telephone": SITE_CONTACT.phoneTel,
                                "contactType": "sales",
                                "areaServed": "RO",
                                "availableLanguage": ["Romanian"]
                            },
                            "sameAs": [
                                "https://www.facebook.com/tehnicagrosupply"
                            ]
                        })
                    }}
                />

                <script dangerouslySetInnerHTML={{ __html: CONSENT_BOOTSTRAP_SCRIPT }} />

                <Navbar />
                {children}
                <Footer />

                <MobileStickyCTA />
                <CookieBanner />
                <ConsentGatedMarketing />
                <GoogleAnalytics gaId={GA_ID} />
            </body>
        </html>
    );
}
