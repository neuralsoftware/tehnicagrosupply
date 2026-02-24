import { BLOG_POSTS } from '@/data/blog';
import { notFound } from 'next/navigation';
import { Contact } from '@/components/Contact';
import { ChevronLeft, Calendar, User, Tag } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = BLOG_POSTS.find(p => p.slug === slug);

    if (!post) return {};

    return {
        title: `${post.title} | Blog TehnicAgro`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: [post.imageSrc],
            type: 'article',
            publishedTime: post.date,
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: [post.imageSrc],
        }
    };
}

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateStaticParams() {
    return BLOG_POSTS.map((post) => ({
        slug: post.slug,
    }));
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = BLOG_POSTS.find(p => p.slug === slug);

    if (!post) {
        notFound();
    }

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.excerpt,
        "image": `https://tehnicagrosupply.ro${post.imageSrc}`,
        "datePublished": post.date,
        "author": {
            "@type": "Organization",
            "name": "TehnicAgro Supply"
        }
    };

    return (
        <main className="min-h-screen bg-white text-zinc-900 pt-32 pb-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            <div className="max-w-4xl mx-auto px-4">
                {/* Navigation */}
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-zinc-500 hover:text-ea-green-500 transition-colors mb-8 group"
                >
                    <ChevronLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                    Înapoi la Blog
                </Link>

                {/* Header */}
                <header className="space-y-6 mb-12">
                    <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-ea-green-500">
                        <span className="bg-ea-green-500/10 px-3 py-1 rounded">
                            {post.category.replace('-', ' ')}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-zinc-900 leading-tight uppercase tracking-tight">
                        {post.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-zinc-500 text-sm">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(post.date).toLocaleDateString('ro-RO')}
                        </div>
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {post.author}
                        </div>
                    </div>
                </header>

                {/* Featured Image */}
                <div className="aspect-video bg-zinc-100 rounded-3xl overflow-hidden mb-12 border border-zinc-200">
                    <img
                        src={post.imageSrc}
                        alt={post.title}
                        className="w-full h-full object-cover opacity-80"
                    />
                </div>

                {/* Content */}
                <article
                    className="prose prose-zinc max-w-none 
          prose-headings:uppercase prose-headings:font-black prose-headings:tracking-tight
          prose-h2:text-3xl prose-h2:border-l-4 prose-h2:border-ea-green-500 prose-h2:pl-6
          prose-p:text-zinc-600 prose-p:leading-relaxed prose-p:text-lg
          prose-strong:text-zinc-900 prose-strong:font-bold
          prose-ul:text-zinc-600 prose-li:mb-2"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* CTA Section */}
                <div className="mt-24 p-12 bg-zinc-50 rounded-3xl border border-zinc-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-ea-green-500 opacity-5 blur-3xl -mr-32 -mt-32"></div>
                    <div className="relative z-10 text-center space-y-8">
                        <h2 className="text-3xl font-black text-zinc-900 uppercase tracking-tight">
                            Ai nevoie de consultanță tehnică?
                        </h2>
                        <p className="text-zinc-500 max-w-2xl mx-auto">
                            Suntem aici să te ajutăm să alegi utilajul potrivit pentru ferma ta și să navighezi prin labirintul subvențiilor.
                        </p>
                        <Contact />
                    </div>
                </div>
            </div>
        </main>
    );
}
