import { BLOG_POSTS } from '@/data/blog';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';

export default function BlogPage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100 pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter">
                        Blog & <span className="text-ea-green-500">Resurse</span>
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
                        Ghiduri tehnice, noutăți despre subvenții și strategii pentru creșterea eficienței în ferma ta.
                    </p>
                </div>

                {/* Blog Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {BLOG_POSTS.map((post) => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.slug}`}
                            className="group bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 hover:border-ea-green-500/50 transition-all flex flex-col"
                        >
                            {/* Image */}
                            <div className="aspect-[16/9] overflow-hidden relative">
                                <img
                                    src={post.imageSrc}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-ea-green-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                                        {post.category.replace('-', ' ')}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8 space-y-4 flex-grow flex flex-col">
                                <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(post.date).toLocaleDateString('ro-RO')}
                                </div>
                                <h2 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-ea-green-500 transition-colors">
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
            </div>
        </main>
    );
}
