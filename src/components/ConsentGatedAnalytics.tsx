'use client';

import { GoogleAnalytics } from '@next/third-parties/google';
import { useEffect, useState } from 'react';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-KR6928Z45R';

/**
 * Încarcă Google Analytics doar după `cookie_consent === 'granted'` (vezi CookieBanner).
 */
export function ConsentGatedAnalytics() {
    const [granted, setGranted] = useState(false);

    useEffect(() => {
        const read = () => {
            try {
                setGranted(localStorage.getItem('cookie_consent') === 'granted');
            } catch {
                setGranted(false);
            }
        };
        read();
        window.addEventListener('tehnicagro-cookie-consent', read);
        window.addEventListener('storage', read);
        return () => {
            window.removeEventListener('tehnicagro-cookie-consent', read);
            window.removeEventListener('storage', read);
        };
    }, []);

    if (!granted) return null;
    return <GoogleAnalytics gaId={GA_ID} />;
}
