'use client';

import Link from 'next/link';

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
                        <p className="text-zinc-500 text-sm leading-relaxed">
                            Partenerul tău strategic pentru agricultură de precizie și tehnologii No-Till. Eficiență garantată și conformitate deplină cu reglementările APIA 2026.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="space-y-6">
                        <h4 className="text-white font-bold uppercase text-xs tracking-widest">Navigare</h4>
                        <ul className="space-y-4 text-sm text-zinc-500">
                            <li><Link href="/" className="hover:text-ea-green-500 transition-colors">Acasă</Link></li>
                            <li><Link href="/utilaje/pregatire-sol" className="hover:text-ea-green-500 transition-colors">Utilaje</Link></li>
                            <li><Link href="/piese-schimb" className="hover:text-ea-green-500 transition-colors">Piese de Schimb</Link></li>
                            <li><Link href="/blog" className="hover:text-ea-green-500 transition-colors">Blog & Noutăți</Link></li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div className="space-y-6">
                        <h4 className="text-white font-bold uppercase text-xs tracking-widest">Legal</h4>
                        <ul className="space-y-4 text-sm text-zinc-500">
                            <li><Link href="/privacy-policy" className="hover:text-ea-green-500 transition-colors">Politică de Confidențialitate</Link></li>
                            <li><Link href="/politica-cookie" className="hover:text-ea-green-500 transition-colors">Politică de Cookie-uri</Link></li>
                            <li><Link href="/conditii-utilizare" className="hover:text-ea-green-500 transition-colors">Condiții de Utilizare</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <h4 className="text-white font-bold uppercase text-xs tracking-widest">Contact</h4>
                        <ul className="space-y-4 text-sm text-zinc-500">
                            <li className="flex flex-col">
                                <span className="text-[10px] uppercase font-bold text-zinc-600">Telefon Vânzări</span>
                                <a href="tel:+40723380022" className="text-white hover:text-ea-green-500 transition-colors">0723 380 022</a>
                            </li>
                            <li className="flex flex-col">
                                <span className="text-[10px] uppercase font-bold text-zinc-600">Email</span>
                                <a href="mailto:tehnicagro.supply@gmail.com" className="text-white hover:text-ea-green-500 transition-colors">tehnicagro.supply@gmail.com</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-zinc-700 uppercase font-bold tracking-widest">
                    <p>© {new Date().getFullYear()} TehnicAgro Supply. Toate drepturile rezervate.</p>
                    <p>Dezvoltat sub standarde de conformitate legală 100%.</p>
                </div>
            </div>
        </footer>
    );
}
