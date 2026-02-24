'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    // Helper to safely call gtag
    const updateConsent = (granted: boolean) => {
        const state = granted ? 'granted' : 'denied';

        // Ensure dataLayer exists
        // @ts-ignore
        window.dataLayer = window.dataLayer || [];
        // @ts-ignore
        function gtag() { dataLayer.push(arguments); }

        // @ts-ignore
        gtag('consent', 'update', {
            'ad_storage': state,
            'analytics_storage': state,
            'ad_user_data': state,
            'ad_personalization': state
        });

        // Force a pageview event to wake up realtime view if granted
        if (granted) {
            // @ts-ignore
            gtag('event', 'page_view');
        }
    };

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            setIsVisible(true);
        } else if (consent === 'accepted') {
            // Already accepted in previous session
            updateConsent(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        updateConsent(true);
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookie-consent', 'declined');
        updateConsent(false);
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-white/95 backdrop-blur-md border-t border-zinc-200 shadow-2xl">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-zinc-600 text-center md:text-left">
                    <p>
                        Folosim cookie-uri pentru a îmbunătăți experiența de utilizare și pentru a analiza traficul.
                        Prin continuarea navigării, ești de acord cu modul nostru de utilizare a acestora.
                        Citește mai multe în{' '}
                        <Link href="/privacy-policy" className="text-green-500 hover:underline">
                            Politica de Confidențialitate
                        </Link>{' '}
                        și{' '}
                        <Link href="/politica-cookie" className="text-green-500 hover:underline">
                            Politica de Cookie-uri
                        </Link>.
                    </p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={handleDecline}
                        className="flex-1 md:flex-none px-6 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                    >
                        Refuză
                    </button>
                    <button
                        onClick={handleAccept}
                        className="flex-1 md:flex-none px-6 py-2 text-sm font-medium bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
                    >
                        Acceptă Tot
                    </button>
                </div>
            </div>
        </div>
    );
}
