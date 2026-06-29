'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-KR6928Z45R';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  const updateConsent = useCallback((granted: boolean, sendPageView = false) => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: granted ? 'granted' : 'denied',
        ad_storage: granted ? 'granted' : 'denied',
        ad_user_data: granted ? 'granted' : 'denied',
        ad_personalization: granted ? 'granted' : 'denied',
      });

      if (granted && sendPageView) {
        window.gtag('event', 'page_view', {
          page_title: document.title,
          page_location: window.location.href,
          page_path: window.location.pathname,
          send_to: GA_ID,
        });
      }
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      const consent = localStorage.getItem('cookie_consent');
      if (!consent) {
        setIsVisible(true);
      } else if (consent === 'granted') {
        updateConsent(true);
        window.dispatchEvent(new Event('tehnicagro-cookie-consent'));
      }
    });

    const handleOpenSettings = () => setIsVisible(true);
    window.addEventListener('openCookieSettings', handleOpenSettings);

    return () => window.removeEventListener('openCookieSettings', handleOpenSettings);
  }, [updateConsent]);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'granted');
    updateConsent(true, true);
    setIsVisible(false);
    window.dispatchEvent(new Event('tehnicagro-cookie-consent'));
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'denied');
    updateConsent(false);
    setIsVisible(false);
    window.dispatchEvent(new Event('tehnicagro-cookie-consent'));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-[99999] max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 p-3 text-white shadow-2xl md:left-0 md:right-0 md:bottom-0 md:max-w-none md:rounded-none md:p-5">
      <div className="mx-auto flex max-w-7xl flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0 flex-1 break-words text-xs leading-snug text-slate-300 md:text-sm">
        Folosim cookie-uri pentru analiză și marketing.{' '}
        <span className="hidden sm:inline">Detalii în </span>
        <Link href="/politica-cookie" className="text-emerald-400 underline hover:text-emerald-300">Cookie-uri</Link>
        {' '}și{' '}
        <Link href="/privacy-policy" className="text-emerald-400 underline hover:text-emerald-300">Confidențialitate</Link>.
      </div>
      <div className="flex w-full min-w-0 shrink-0 gap-2 md:w-auto md:gap-3">
        <button 
          onClick={handleDecline}
          className="min-h-11 min-w-0 basis-0 grow rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-300 transition-colors hover:bg-slate-700 md:basis-auto md:grow-0 md:px-4"
        >
          Refuz
        </button>
        <button 
          onClick={handleAccept}
          className="min-h-11 min-w-0 basis-0 grow rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400 md:basis-auto md:grow-0 md:px-4"
        >
          Acceptă
        </button>
      </div>
      </div>
    </div>
  );
}
