import type { Metadata } from 'next';
import { Inter, Oswald } from 'next/font/google';
import './globals.css';
import { GoogleAnalytics } from '@next/third-parties/google';
import { CookieConsent } from '@/components/CookieConsent';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { ExitIntentPopup } from '@/components/ExitIntentPopup';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald' });

export const metadata: Metadata = {
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
        url: "https://tehnic-agro-funnel.vercel.app",
        siteName: "TehnicAgro Supply",
        images: [
            {
                url: '/logos/tehnicagro_wide_v2_1769156124608.png',
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
        images: ['/logos/tehnicagro_wide_v2_1769156124608.png'],
    },
    alternates: {
        canonical: 'https://tehnic-agro-funnel.vercel.app',
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
                {/* Microsoft Clarity for Heatmaps */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function(c,l,a,r,i,t,y){
                                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                            })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID || 'YOUR_CLARITY_ID'}");
                        `,
                    }}
                />
            </head>
            <body className={inter.className}>
                {/* Meta Pixel (Facebook) */}
                <noscript>
                    <img
                        height="1"
                        width="1"
                        style={{ display: 'none' }}
                        src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || 'FACEBOOK_PIXEL_ID'}&ev=PageView&noscript=1`}
                        alt=""
                    />
                </noscript>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            
                            // Initialize Consent Mode (Default Denied)
                            gtag('consent', 'default', {
                                'ad_storage': 'denied',
                                'analytics_storage': 'denied',
                                'ad_user_data': 'denied',
                                'ad_personalization': 'denied',
                                'wait_for_update': 500
                            });

                            !function(f,b,e,v,n,t,s)
                            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                            n.queue=[];t=b.createElement(e);t.async=!0;
                            t.src=v;s=b.getElementsByTagName(e)[0];
                            s.parentNode.insertBefore(t,s)}(window, document,'script',
                            'https://connect.facebook.net/en_US/fbevents.js');
                            fbq('init', '${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || 'FACEBOOK_PIXEL_ID'}');
                            fbq('track', 'PageView');
                        `,
                    }}
                />

                {children}

                {/* Global UI Components */}
                <WhatsAppButton />
                <ExitIntentPopup />
                <CookieConsent />

                <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-KR6928Z45R"} />
            </body>
        </html>
    );
}
