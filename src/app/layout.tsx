import type { Metadata } from 'next';
import { Inter, Oswald } from 'next/font/google';
import './globals.css';
import { GoogleAnalytics } from '@next/third-parties/google';
import { CookieConsent } from '@/components/CookieConsent';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald' });

export const metadata: Metadata = {
    metadataBase: new URL('https://tehnicagrosupply.ro'),
    title: "Tehnicagro Supply | Utilaje Agricole No-Till & Subvenții APIA 2026",
    description: "Soluții complete pentru agricultura conservativă. Avers-Agro Green Plains & Fliegl KSE 680. Eligibil APIA PD-04 și GAEC 6. Reducere costuri motorină.",
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

                {/* Microsoft Clarity for Heatmaps */}
                {process.env.NEXT_PUBLIC_CLARITY_ID && (
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                                (function(c,l,a,r,i,t,y){
                                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                                })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
                            `,
                        }}
                    />
                )}
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
                            "description": "Soluții complete pentru agricultura conservativă. Utilaje No-Till, Avers-Agro Green Plains \u0026 Fliegl KSE 680. Eligibil APIA PD-04 și GAEC 6.",
                            "contactPoint": {
                                "@type": "ContactPoint",
                                "telephone": "+40723380022",
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

                {/* Facebook Pixel - Consent Mode Compliant */}
                <noscript>
                    <img
                        height="1"
                        width="1"
                        style={{ display: 'none' }}
                        src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}&ev=PageView&noscript=1`}
                        alt=""
                    />
                </noscript>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            
                            // Initialize Consent Mode (Default Denied - GDPR)
                            gtag('consent', 'default', {
                                'ad_storage': 'denied',
                                'analytics_storage': 'denied',
                                'ad_user_data': 'denied',
                                'ad_personalization': 'denied',
                                'wait_for_update': 500
                            });

                            // Facebook Pixel
                            !function(f,b,e,v,n,t,s)
                            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                            n.queue=[];t=b.createElement(e);t.async=!0;
                            t.src=v;s=b.getElementsByTagName(e)[0];
                            s.parentNode.insertBefore(t,s)}(window, document,'script',
                            'https://connect.facebook.net/en_US/fbevents.js');
                            fbq('init', '${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '928787952822638'}');
                            fbq('track', 'PageView');
                        `,
                    }}
                />

                <Navbar />
                {children}
                <Footer />

                {/* Global UI Components - CookieConsent only (WhatsApp & ExitPopup moved to page.tsx) */}
                <CookieConsent />

                <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-KR6928Z45R"} />
            </body>
        </html>
    );
}
