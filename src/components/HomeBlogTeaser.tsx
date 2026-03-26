import Link from 'next/link';
import type { BlogPost } from '@/data/blog';
import { ArrowRight, BookOpen } from 'lucide-react';

const categoryLabel: Record<BlogPost['category'], string> = {
    'fonduri-europene': 'Fonduri europene',
    tehnologie: 'Tehnologie',
    noutati: 'Noutăți',
};

function formatPostDate(iso: string): string {
    try {
        return new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));
    } catch {
        return iso;
    }
}

export function HomeBlogTeaser({ posts }: { posts: BlogPost[] }) {
    if (!posts.length) return null;

    return (
        <section className="py-20 bg-zinc-50 border-t border-zinc-200" aria-labelledby="blog-teaser-heading">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-12">
                    <div className="flex items-start gap-3">
                        <div className="shrink-0 w-11 h-11 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shadow-sm">
                            <BookOpen className="w-5 h-5 text-ea-green-600" aria-hidden />
                        </div>
                        <div>
                            <h2 id="blog-teaser-heading" className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">
                                Din experiența noastră
                            </h2>
                            <p className="text-zinc-600 mt-1 text-sm md:text-base max-w-xl">
                                Articole practice despre subvenții, tehnologie și campaniile agricole.
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/blog"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border-2 border-zinc-900 bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-800 transition-colors self-start md:self-auto"
                    >
                        Vezi toate articolele
                        <ArrowRight className="w-4 h-4" aria-hidden />
                    </Link>
                </div>

                <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0">
                    {posts.map((post) => (
                        <li key={post.id}>
                            <article className="h-full flex flex-col bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-200/80 transition-all duration-300 group">
                                <Link href={`/blog/${post.slug}`} className="block aspect-[16/10] bg-zinc-100 overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={post.imageSrc}
                                        alt=""
                                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                                    />
                                </Link>
                                <div className="p-5 flex flex-col flex-1">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 mb-2">
                                        {categoryLabel[post.category]}
                                    </span>
                                    <h3 className="text-lg font-bold text-zinc-900 leading-snug group-hover:text-ea-green-600 transition-colors">
                                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                                    </h3>
                                    <p className="text-zinc-600 text-sm mt-2 line-clamp-3 flex-1 leading-relaxed">{post.excerpt}</p>
                                    <time className="text-xs text-zinc-400 mt-4 font-medium" dateTime={post.date}>
                                        {formatPostDate(post.date)}
                                    </time>
                                </div>
                            </article>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
