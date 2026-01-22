import type { Metadata } from 'next';
import { Inter, Oswald } from 'next/font/google';
import './globals.css';
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald' });

export const metadata: Metadata = {
    title: "Tehnicagro Supply | Utilaje Agricole No-Till & Subvenții APIA 2026",
    description: "Soluții complete pentru agricultura conservativă. Avers-Agro Green Plains & Fliegl KSE 680. Eligibil APIA PD-04 și GAEC 6. Reducere costuri motorină.",
    keywords: ["utilaje agricole", "no-till", "avers-agro", "fliegl", "subventii apia 2026", "pd-04", "gaec 6", "semanatoare directa", "grapa cu lanturi"],
    openGraph: {
        title: "Tehnicagro Supply - Eficiență Maximă în Fermă",
        description: "Descoperă utilajele care îți aduc 56 EUR/ha subvenție și economisesc 320 RON/ha la motorină.",
        type: "website",
        locale: "ro_RO",
    }
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ro" className={`${inter.variable} ${oswald.variable} scroll-smooth`}>
            <body className={inter.className}>
                {children}
                <GoogleAnalytics gaId="G-KR6928Z45R" />
            </body>
        </html>
    );
}
