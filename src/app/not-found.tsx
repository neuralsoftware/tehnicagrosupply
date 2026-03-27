import Link from 'next/link';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
    return (
        <main className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col items-center justify-center px-6 pt-24 pb-16">
            <div className="max-w-md w-full rounded-3xl border border-zinc-200 bg-white p-10 shadow-sm text-center space-y-6">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-600">
                    <FileQuestion className="h-8 w-8" aria-hidden />
                </div>
                <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-widest text-ea-green-600">404</p>
                    <h1 className="text-xl font-semibold tracking-tight text-zinc-900">Pagina nu a fost găsită</h1>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                        Adresa pe care ai deschis-o nu există sau a fost mutată. Verifică linkul sau mergi la început.
                    </p>
                </div>
                <Link
                    href="/"
                    className="inline-flex w-full justify-center rounded-xl bg-ea-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-ea-green-500 transition-colors"
                >
                    Înapoi la pagina principală
                </Link>
            </div>
        </main>
    );
}
