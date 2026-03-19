'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setIsVisible(true);
    } else if (consent === 'granted') {
      updateConsent(true);
    }
  }, []);

  const updateConsent = (granted: boolean) => {
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      (window as any).gtag('consent', 'update', {
        'analytics_storage': granted ? 'granted' : 'denied',
        'ad_storage': granted ? 'granted' : 'denied',
        'ad_user_data': granted ? 'granted' : 'denied',
        'ad_personalization': granted ? 'granted' : 'denied',
      });
    }
  };

  const handleAccept  const handleAccept  const handleAccept  const han',  const handleAccept  eCo  const handleAccept  const handleAccept ;

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'denied');
    updateConsent(false);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 text-white p-4 md:p-6 z-[99999] border-t border-slate-700 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="text-sm text-slate-300 flex-1">
        Folosim cookie-uri pentru a vă asigura cea mai bună experiență pe site, pentru analiza traficului (Google Analytics) și marketing. 
        Detalii în <Link href="/politica-cookie" className="text-emerald-400 underline hover:text-emerald-300">Politica de Cookie-uri</Link> și <Link href="/privacy-policy" className="text-emerald-400 underline hover:text-emerald-300">Confidențialitate</Link>.
      </div>
      <div className="flex gap-3 w-full md:w-auto shrink-0">
        <button 
          onClick={handleDecline}
          className="flex-1 md:flex-none px-4 py-2 text-sm font-semibold text-slate-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors"
        >
          Refuz
        </button>
        <button 
          onClick={handleAccept}
          className="flex-1 md:flex-none px-4 py-2 text-sm font-semibold text-slate-900 bg-emerald-500 rounded-lg hover:bg-emerald-400 transition-colors"
        >
          Accept Toate
        </button>
      </div>
    </div>
  );
}
