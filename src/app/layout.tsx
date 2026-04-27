import CookieBanner from '@/components/CookieBanner';
import type { Metadata } from 'next';
import { Inter, Oswald } from 'next/font/google';
import './globals.css';
import { ConsentGatedAnalytics } from '@/components/ConsentGatedAnalytics';
import { ConsentGatedMarketing } from '@/components/ConsentGatedMarketing';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SITE_CONTACT } from '@/lib/site-contact';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald' });

export const metadata: Metadata = {
    metadataBase: new URL('https://tehnicagrosupply.ro'),
    title: "Tehnicagro Supply | Utilaje Agricole No-Till & Subvenții APIA 2026",
    description: "Soluții complete pentru agricultura conservativă. Avers-Agro Multisem ADS & Fliegl KSE 680. Eligibil APIA PD-04 și GAEC 6. Reducere costuri motorină.",
    keywords: ["utilaje agricole", "no-till", "avers-agro", "fliegl", "subventii apia 2026", "pd-04", "gaec 6", "semanatoare directa", "grapa cu lanturi"],
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: 'any' },
            { url: '/logos/tehnicagro_logo_v1_1769155922952.png', type: 'image/png' }
        ],
        apple: '/logos/tehnicagro_logo_v1_1769155922952.png',
    },
    openGraph: {
        title: "Tehnicagro Supply - Eficiență Maximă în Fermă",
        description: "Descoperă utilajele care îți aduc 56 EUR/ha subvenție și economisesc 320 RON/ha la motorină.",
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
        description: "56 EUR/ha subvenție APIA + 320 RON/ha economie motorină. Calculează beneficiul fermei tale!",
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
        <html lang="ro" className={`${inter.variable} ${oswald.variable} scroll-smooth`}>
            <head>
                {/* Facebook Domain Verification */}
                <meta name="facebook-domain-verification" content="6oeyh29v3v848nr6qv4bsvovm2irfd" />

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
                            "description": "Soluții complete pentru agricultura conservativă. Utilaje No-Till, Avers-Agro Multisem ADS \u0026 Fliegl KSE 680. Eligibil APIA PD-04 și GAEC 6.",
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

                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            window.gtag = gtag;
                            gtag('consent', 'default', {
                                'ad_storage': 'denied',
                                'analytics_storage': 'denied',
                                'ad_user_data': 'denied',
                                'ad_personalization': 'denied',
                                'wait_for_update': 2000
                            });
                        `,
                    }}
                />

                <Navbar />
                {children}
                <Footer />

                <CookieBanner />
                <ConsentGatedAnalytics />
                <ConsentGatedMarketing />
            </body>
        </html>
    );
}
