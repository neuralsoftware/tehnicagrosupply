import { Contact } from '@/components/Contact';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';
import { SITE_CONTACT } from '@/lib/site-contact';

export const metadata: Metadata = {
    title: 'Contact | TehnicAgro Supply',
    description:
        'Telefon, email și adresă TehnicAgro Supply — Sat Lumina, jud. Constanța. Solicită ofertă pentru utilaje agricole și consultanță APIA.',
    alternates: { canonical: 'https://tehnicagrosupply.ro/contact' },
};

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-white text-zinc-900 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4">
                <nav aria-label="Breadcrumb" className="text-xs text-zinc-500 mb-6">
                    <ol className="flex flex-wrap gap-2">
                        <li>
                            <Link href="/" className="hover:text-ea-green-600">
                                Acasă
                            </Link>
                        </li>
                        <li aria-hidden>/</li>
                        <li className="text-zinc-900 font-semibold">Contact</li>
                    </ol>
                </nav>

                <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900 mb-3">
                                Contact
                            </h1>
                            <p className="text-zinc-600 leading-relaxed">
                                Scrie-ne pentru oferte, finanțare sau întrebări tehnice — un consultant TehnicAgro îți răspunde cât mai curând.
                            </p>
                        </div>

                        <ul className="space-y-5 text-sm">
                            <li className="flex gap-3">
                                <Mail className="w-5 h-5 text-ea-green-600 shrink-0 mt-0.5" aria-hidden />
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Email</p>
                                    <a
                                        href={`mailto:${SITE_CONTACT.email}`}
                                        className="text-zinc-900 font-medium hover:text-ea-green-600 transition-colors"
                                    >
                                        {SITE_CONTACT.email}
                                    </a>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <Phone className="w-5 h-5 text-ea-green-600 shrink-0 mt-0.5" aria-hidden />
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Telefon</p>
                                    <a
                                        href={`tel:${SITE_CONTACT.phoneTel}`}
                                        className="text-zinc-900 font-medium hover:text-ea-green-600 transition-colors"
                                    >
                                        {SITE_CONTACT.phoneDisplay}
                                    </a>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <MapPin className="w-5 h-5 text-ea-green-600 shrink-0 mt-0.5" aria-hidden />
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Adresă</p>
                                    <p className="text-zinc-900 font-medium">{SITE_CONTACT.addressLine}</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <Clock className="w-5 h-5 text-ea-green-600 shrink-0 mt-0.5" aria-hidden />
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Program</p>
                                    <p className="text-zinc-900 font-medium">{SITE_CONTACT.officeHours}</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="lg:col-span-3 w-full min-w-0">
                        <Contact hideSectionAnchor hideMarketingCopy />
                    </div>
                </div>
            </div>
        </main>
    );
}
