'use client';

import { useEffect, useState } from 'react';
import { CONSENT_EVENT, CONSENT_DENIED, currentConsent, type ConsentChoice } from '@/lib/consent';

const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID?.trim();
const FB_PIXEL_ID = (process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '928787952822638').trim();

/**
 * Scripturile terților, fiecare legat de categoria lui:
 *   Microsoft Clarity → „Analiză”
 *   Meta Pixel        → „Marketing”
 *
 * Nimic nu se injectează înainte de acordul pentru categoria respectivă. O dată injectat,
 * un script nu mai poate fi scos din pagină, așa că retragerea acordului are efect de la
 * următoarea încărcare — exact ce spunem în politica de cookie-uri.
 */
export function ConsentGatedMarketing() {
    const [consent, setConsent] = useState<ConsentChoice>(CONSENT_DENIED);

    useEffect(() => {
        const read = () => setConsent(currentConsent());
        read();
        window.addEventListener(CONSENT_EVENT, read);
        window.addEventListener('storage', read);
        return () => {
            window.removeEventListener(CONSENT_EVENT, read);
            window.removeEventListener('storage', read);
        };
    }, []);

    useEffect(() => {
        if (!consent.analytics || typeof document === 'undefined') return;
        if (!CLARITY_ID || document.getElementById('tehnicagro-clarity')) return;

        const s = document.createElement('script');
        s.id = 'tehnicagro-clarity';
        s.async = true;
        s.innerHTML = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${CLARITY_ID}");`;
        document.head.appendChild(s);
    }, [consent.analytics]);

    useEffect(() => {
        if (!consent.marketing || typeof document === 'undefined') return;
        if (!FB_PIXEL_ID || document.getElementById('tehnicagro-fbq-bootstrap')) return;

        const s = document.createElement('script');
        s.id = 'tehnicagro-fbq-bootstrap';
        s.async = true;
        s.innerHTML = `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${FB_PIXEL_ID}');
fbq('track', 'PageView');`;
        document.head.appendChild(s);
    }, [consent.marketing]);

    if (!consent.marketing || !FB_PIXEL_ID) return null;

    return (
        <noscript>
            {/* Facebook cere <img> simplu în noscript; nu e LCP */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                height={1}
                width={1}
                style={{ display: 'none' }}
                src={`https://www.facebook.com/tr?id=${encodeURIComponent(FB_PIXEL_ID)}&ev=PageView&noscript=1`}
                alt=""
            />
        </noscript>
    );
}
