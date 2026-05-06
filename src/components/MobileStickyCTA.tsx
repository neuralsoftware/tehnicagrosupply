'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, Phone, Send } from 'lucide-react';
import { CONTACT_SECTION_ID, onHashLinkClickSmooth } from '@/lib/scroll-to-anchor';

const PHONE = 'tel:+40723380022';
const WHATSAPP =
    'https://wa.me/40723380022?text=Bun%C4%83%20ziua!%20Doresc%20o%20ofert%C4%83%20TehnicAgro.';

export function MobileStickyCTA() {
    const pathname = usePathname();
    const [hideForForm, setHideForForm] = useState(false);

    useEffect(() => {
        const contact = document.getElementById(CONTACT_SECTION_ID);
        if (!contact || typeof IntersectionObserver === 'undefined') {
            return;
        }
        const observer = new IntersectionObserver(
            ([entry]) => setHideForForm(Boolean(entry?.isIntersecting)),
            { threshold: 0.12 }
        );
        observer.observe(contact);
        return () => observer.disconnect();
    }, [pathname]);

    if (pathname.startsWith('/admin') || hideForForm) return null;

    return (
        <div className="fixed inset-x-3 bottom-3 z-40 md:hidden">
            <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-black/20">
                <a
                    href={PHONE}
                    className="flex min-h-14 flex-col items-center justify-center gap-0.5 border-r border-zinc-100 text-xs font-semibold text-zinc-800"
                >
                    <Phone className="h-4 w-4 text-ea-green-700" />
                    Sună
                </a>
                <a
                    href={WHATSAPP}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-14 flex-col items-center justify-center gap-0.5 border-r border-zinc-100 text-xs font-semibold text-zinc-800"
                >
                    <MessageCircle className="h-4 w-4 text-[#25D366]" />
                    WhatsApp
                </a>
                <a
                    href={`/contact#${CONTACT_SECTION_ID}`}
                    onClick={(e) => {
                        if (document.getElementById(CONTACT_SECTION_ID)) {
                            onHashLinkClickSmooth(e, `#${CONTACT_SECTION_ID}`);
                        }
                    }}
                    className="flex min-h-14 flex-col items-center justify-center gap-0.5 bg-ea-green-600 text-xs font-semibold text-white"
                >
                    <Send className="h-4 w-4" />
                    Ofertă
                </a>
            </div>
        </div>
    );
}
