import { getPublishedPosts, resolveBlogPostImage } from '@/data/blog';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Metadata } from 'next';

export const revalidate = 3600;

const PER_PAGE = 9;

export const metadata: Metadata = {
    title: "Blog & Resurse Tehnice Agricole | TehnicAgro Supply",
    description: "Ghiduri despre subvenții APIA, reglementări GAEC 6, tehnologia No-Till și bune practici pentru fermieri.",
};

type PageProps = {
    searchParams?: Promise<{ page?: string }>;
};

export default async function BlogPage({ searchParams }: PageProps) {
    const allPosts = getPublishedPosts();
    const sp = searchParams ? await searchParams : {};
    const rawPage = parseInt(String(sp.page || '1'), 10);
    const totalPages = Math.max(1, Math.ceil(allPosts.length / PER_PAGE));
    const page = Number.isFinite(rawPage) ? Math.min(Math.max(1, rawPage), totalPages) : 1;
    const start = (page - 1) * PER_PAGE;
    const posts = allPosts.slice(start, start + PER_PAGE);

    const qs = (p: number) => (p <= 1 ? '/blog' : `/blog?page=${p}`);

    return (
        <main className="min-h-screen bg-white text-zinc-900 pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-5xl md:text-6xl font-black text-zinc-900 uppercase tracking-tighter">
                        Blog & <span className="text-ea-green-600">Resurse</span>
                    </h1>
                    <p className="text-zinc-500 max-w-2xl mx-auto text-lg">
                        Ghiduri tehnice, noutăți despre subvenții și strategii pentru creșterea eficienței în ferma ta.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, index) => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.slug}`}
                            className="group bg-white rounded-3xl overflow-hidden border border-zinc-200 hover:border-ea-green-300 transition-all flex flex-col shadow-sm hover:shadow-lg"
                        >
                            <div className="aspect-[16/9] overflow-hidden relative">
                                {/* Primul card e elementul LCP pe mobil — fără lazy */}
                                <Image
                                    src={resolveBlogPostImage(post)}
                                    alt={post.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                                    priority={index === 0}
                                    fetchPriority={index === 0 ? 'high' : undefined}
                                    quality={65}
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-ea-green-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                                        {post.category.replace('-', ' ')}
                                    </span>
                                </div>
                            </div>

                            <div className="p-8 space-y-4 flex-grow flex flex-col">
                                <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(post.date).toLocaleDateString('ro-RO')}
                                </div>
                                <h2 className="text-xl font-black text-zinc-900 uppercase tracking-tight group-hover:text-ea-green-600 transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-zinc-500 text-sm line-clamp-3">
                                    {post.excerpt}
                                </p>
                                <div className="pt-4 mt-auto flex items-center gap-2 text-ea-green-500 text-xs font-black uppercase tracking-widest">
                                    Citește Articolul
                                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {totalPages > 1 ? (
                    <nav
                        className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-100 pt-10"
                        aria-label="Paginare articole blog"
                    >
                        <p className="text-sm text-zinc-500">
                            Pagina <span className="font-semibold text-zinc-900">{page}</span> din{' '}
                            <span className="font-semibold text-zinc-900">{totalPages}</span>
                            {` — ${allPosts.length} articole`}
                        </p>
                        <div className="flex items-center gap-2">
                            {page > 1 ? (
                                <Link
                                    href={qs(page - 1)}
                                    className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 hover:border-ea-green-300 hover:text-ea-green-700 transition-colors"
                                >
                                    <ChevronLeft className="h-4 w-4" aria-hidden />
                                    Pagina anterioară
                                </Link>
                            ) : (
                                <span className="inline-flex items-center gap-2 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-2.5 text-sm font-medium text-zinc-400 cursor-not-allowed">
                                    <ChevronLeft className="h-4 w-4" aria-hidden />
                                    Pagina anterioară
                                </span>
                            )}
                            {page < totalPages ? (
                                <Link
                                    href={qs(page + 1)}
                                    className="inline-flex items-center gap-2 rounded-xl bg-ea-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-ea-green-500 transition-colors"
                                >
                                    Pagina următoare
                                    <ChevronRight className="h-4 w-4" aria-hidden />
                                </Link>
                            ) : (
                                <span className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-400 cursor-not-allowed">
                                    Pagina următoare
                                    <ChevronRight className="h-4 w-4" aria-hidden />
                                </span>
                            )}
                        </div>
                    </nav>
                ) : null}
            </div>
        </main>
    );
}
