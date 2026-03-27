import Link from 'next/link';

const SITE_ORIGIN = 'https://tehnicagrosupply.ro';

export type BreadcrumbItem = {
    label: string;
    /** Omit pe ultimul element (pagina curentă) sau pune același path pentru JSON-LD complet */
    href?: string;
};

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((it, i) => {
            const position = i + 1;
            const entry: Record<string, unknown> = {
                '@type': 'ListItem',
                position,
                name: it.label,
            };
            if (it.href) {
                entry.item = it.href.startsWith('http') ? it.href : `${SITE_ORIGIN}${it.href}`;
            }
            return entry;
        }),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 py-3 border-b border-zinc-100">
                <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-zinc-500 md:text-sm">
                    {items.map((it, i) => (
                        <li key={`${it.label}-${i}`} className="flex items-center gap-2">
                            {i > 0 ? (
                                <span className="text-zinc-300" aria-hidden>
                                    /
                                </span>
                            ) : null}
                            {it.href ? (
                                <Link href={it.href} className="hover:text-ea-green-600 transition-colors">
                                    {it.label}
                                </Link>
                            ) : (
                                <span className="text-zinc-900 font-semibold" aria-current="page">
                                    {it.label}
                                </span>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
        </>
    );
}
