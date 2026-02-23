'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, Phone, MessageSquare } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Acasă', href: '/' },
        {
            name: 'Utilaje',
            href: '/#oferta',
            children: [
                { name: 'Pregătire Sol', href: '/utilaje/pregatire-sol' },
                { name: 'Semănat & Fertilizat', href: '/utilaje/semanat-fertilizat' },
                { name: 'Piese de Schimb', href: '/piese-schimb' },
            ]
        },
        { name: 'Blog Subvenții', href: '/blog' },
        { name: 'Contact', href: '/#contact' },
    ];

    return (
        <nav className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
            isScrolled
                ? "bg-zinc-950/90 backdrop-blur-md border-zinc-800 py-3"
                : "bg-transparent border-transparent py-5"
        )}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter">
                            Tehnic<span className="text-ea-green-500">Agro</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <div key={link.name} className="relative group">
                                <Link
                                    href={link.href}
                                    className="text-zinc-400 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-1"
                                >
                                    {link.name}
                                    {link.children && <ChevronDown className="w-4 h-4" />}
                                </Link>

                                {link.children && (
                                    <div className="absolute top-full left-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                        {link.children.map((child) => (
                                            <Link
                                                key={child.name}
                                                href={child.href}
                                                className="block px-4 py-3 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                                            >
                                                {child.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        <a
                            href="tel:+40723380022"
                            className="bg-ea-green-600 hover:bg-ea-green-500 text-white px-5 py-2.5 rounded-full text-sm font-black uppercase transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                        >
                            <Phone className="w-4 h-4" />
                            Sună Acum
                        </a>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-zinc-400 hover:text-white p-2"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            <div className={cn(
                "md:hidden absolute top-full left-0 right-0 bg-zinc-950 border-b border-zinc-800 transition-all duration-300 overflow-hidden",
                isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
            )}>
                <div className="px-4 pt-2 pb-6 flex flex-col gap-4">
                    {navLinks.map((link) => (
                        <div key={link.name}>
                            <Link
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="text-zinc-100 text-lg font-bold uppercase tracking-widest block py-2"
                            >
                                {link.name}
                            </Link>
                            {link.children && (
                                <div className="pl-4 mt-2 flex flex-col gap-2 border-l border-zinc-800">
                                    {link.children.map((child) => (
                                        <Link
                                            key={child.name}
                                            href={child.href}
                                            onClick={() => setIsOpen(false)}
                                            className="text-zinc-500 hover:text-ea-green-500 transition-colors"
                                        >
                                            {child.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    <a
                        href="tel:+40723380022"
                        className="mt-4 bg-ea-green-600 text-white px-6 py-4 rounded-xl text-center font-black uppercase flex items-center justify-center gap-3"
                    >
                        <Phone className="w-5 h-5" />
                        Sună pentru ofertă
                    </a>
                </div>
            </div>
        </nav>
    );
}
