'use client';

import Link from 'next/link';
import { SITE_CONTACT } from '@/lib/site-contact';
import { CONSENT_OPEN_EVENT } from '@/lib/consent';

export function Footer() {
    return (
        <footer className="bg-zinc-950 border-t border-zinc-900 py-16 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link href="/" className="text-xl font-black text-white uppercase tracking-wide">
                            Tehnic<span className="text-ea-green-500">Agro</span>
                        </Link>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            Partenerul tău strategic pentru agricultură de precizie și tehnologii No-Till. Eficiență garantată și conformitate deplină cu reglementările APIA 2026.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="space-y-6">
                        <h4 className="text-white font-bold uppercase text-xs tracking-widest">Navigare</h4>
                        <ul className="space-y-4 text-sm text-zinc-400">
                            <li><Link href="/" className="hover:text-ea-green-500 transition-colors">Acasă</Link></li>
                            <li><Link href="/utilaje" className="hover:text-ea-green-500 transition-colors">Utilaje</Link></li>
                            <li><Link href="/piese-schimb" className="hover:text-ea-green-500 transition-colors">Piese de Schimb</Link></li>
                            <li><Link href="/blog" className="hover:text-ea-green-500 transition-colors">Blog & Noutăți</Link></li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div className="space-y-6">
                        <h4 className="text-white font-bold uppercase text-xs tracking-widest">Legal</h4>
                        <ul className="space-y-4 text-sm text-zinc-400">
                            <li><Link href="/privacy-policy" className="hover:text-ea-green-500 transition-colors">Politică de Confidențialitate</Link></li>
                            <li><Link href="/politica-cookie" className="hover:text-ea-green-500 transition-colors">Politică de Cookie-uri</Link></li>
                            <li><Link href="/conditii-utilizare" className="hover:text-ea-green-500 transition-colors">Condiții de Utilizare</Link></li>
                            <li><Link href="/drepturile-mele" className="hover:text-ea-green-500 transition-colors">Drepturile mele (GDPR)</Link></li>
                            <li>
                                <button onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))} className="hover:text-ea-green-500 transition-colors text-left">
                                    Setări cookie-uri
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <h4 className="text-white font-bold uppercase text-xs tracking-widest">Contact</h4>
                        <ul className="space-y-4 text-sm text-zinc-400">
                            <li className="flex flex-col">
                                <span className="text-[10px] uppercase font-bold text-zinc-600">Telefon Vânzări</span>
                                <a href={`tel:${SITE_CONTACT.phoneTel}`} className="text-white hover:text-ea-green-500 transition-colors">{SITE_CONTACT.phoneDisplay}</a>
                            </li>
                            <li className="flex flex-col">
                                <span className="text-[10px] uppercase font-bold text-zinc-600">Email</span>
                                <a href={`mailto:${SITE_CONTACT.email}`} className="text-white hover:text-ea-green-500 transition-colors">{SITE_CONTACT.email}</a>
                            </li>
                            <li className="flex flex-col pt-2 border-t border-zinc-800/80">
                                <span className="text-[10px] uppercase font-bold text-zinc-600">Adresă</span>
                                <span className="text-white text-sm leading-snug">{SITE_CONTACT.addressLine}</span>
                            </li>
                            <li className="flex flex-col">
                                <span className="text-[10px] uppercase font-bold text-zinc-600">Program</span>
                                <span className="text-white text-sm">{SITE_CONTACT.officeHours}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-zinc-900 space-y-4">
                    {/* Date de identificare — obligatorii permanent și direct accesibile (Legea 365/2002 art. 5) */}
                    <p className="text-xs text-zinc-500 leading-relaxed">
                        <span className="text-zinc-400 font-semibold">{SITE_CONTACT.legalName}</span>
                        {' · '}CUI {SITE_CONTACT.cui}
                        {' · '}Reg. Com. {SITE_CONTACT.regCom}
                        <br />
                        Sediu social: {SITE_CONTACT.addressFull}
                    </p>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-[10px] text-zinc-700 uppercase font-bold tracking-widest">
                        <p>© {new Date().getFullYear()} TehnicAgro Supply. Toate drepturile rezervate.</p>
                        <p>Operator de date cu caracter personal</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
