import Link from 'next/link';
import { prisma } from '@/lib/db';
import Image from 'next/image';
import { Calendar, ArrowRight, Tag } from 'lucide-react';

export default async function NewsPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-surface">
      {/* Nav */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-surface-gray/50 fixed top-0 w-full z-50">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 md:px-16 py-4">
          <Link href="/" className="font-headline-md text-2xl font-bold text-clinical-navy">
            Dr Bubal Care
          </Link>
          <Link
            href="/"
            className="text-sm text-on-surface-variant hover:text-clinical-navy transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </nav>

      <main className="pt-28 pb-20 max-w-7xl mx-auto px-6 md:px-16">
        <div className="max-w-3xl mx-auto space-y-4 mb-16">
          <h1 className="font-headline-lg text-4xl md:text-5xl font-bold text-text-medical-black">Latest News</h1>
          <p className="text-on-surface-variant text-lg">Updates from Dr. Bubal Care on medical research, platform features, and global health insights.</p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-on-surface-variant">No news articles yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/news/${post.slug}`}
                className="group bg-white rounded-2xl border border-surface-gray/60 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
              >
                {post.coverImage ? (
                  <div className="aspect-[16/9] overflow-hidden bg-surface-gray relative">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/9] bg-gradient-to-br from-evidence-blue-light to-surface-gray flex items-center justify-center">
                    <span className="text-clinical-navy/30 font-headline-md text-4xl font-bold">DB</span>
                  </div>
                )}
                <div className="p-6 flex flex-col flex-grow">
                  {post.category && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-healing-teal bg-healing-teal/10 px-2 py-0.5 rounded w-fit mb-3">
                      {post.category}
                    </span>
                  )}
                  <h2 className="font-headline-md text-lg font-bold text-clinical-navy mb-2 group-hover:text-healing-teal transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-on-surface-variant text-sm leading-relaxed flex-grow mb-4">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-surface-gray/50">
                    <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                      <Calendar className="size-3.5" />
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : ''}
                    </div>
                    <span className="text-healing-teal text-sm font-semibold inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Read <ArrowRight className="size-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
