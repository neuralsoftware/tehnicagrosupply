'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <main className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col items-center justify-center px-6 pt-24 pb-16">
            <div className="max-w-md w-full rounded-3xl border border-zinc-200 bg-white p-10 shadow-sm text-center space-y-6">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                    <AlertTriangle className="h-8 w-8" aria-hidden />
                </div>
                <div className="space-y-2">
                    <h1 className="text-xl font-semibold tracking-tight text-zinc-900">A apărut o problemă temporară</h1>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                        Ne pare rău — ceva nu a funcționat cum trebuie. Poți încerca din nou sau reveni la pagina principală.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        type="button"
                        onClick={reset}
                        className="rounded-xl bg-ea-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-ea-green-500 transition-colors"
                    >
                        Încearcă din nou
                    </button>
                    <Link
                        href="/"
                        className="rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 transition-colors text-center"
                    >
                        Înapoi la pagina principală
                    </Link>
                </div>
            </div>
        </main>
    );
}
