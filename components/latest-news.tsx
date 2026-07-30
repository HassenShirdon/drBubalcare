import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Calendar, ArrowRight } from 'lucide-react';

export default async function LatestNews() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    take: 3,
  });

  if (posts.length === 0) return null;

  return (
    <section className="py-24 bg-card border-t border-landing-border/50">
      <div className="max-w-7xl mx-auto px-6 md:px-16 space-y-12">
        <div className="flex items-end justify-between">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-landing-text">
              Latest News
            </h2>
            <p className="text-landing-text-muted text-lg max-w-2xl">
              Stay informed with the latest from Dr. Bubal Care. Platform updates, medical insights, and global health news.
            </p>
          </div>
          <Link
            href="/news"
            className="hidden md:inline-flex items-center gap-2 text-landing-brand font-semibold text-sm hover:text-landing-brand/80 transition-colors"
          >
            View All News <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/news/${post.slug}`}
              className="group bg-card rounded-2xl border border-landing-border/60 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
            >
              {post.coverImage ? (
                <div className="aspect-[16/9] overflow-hidden bg-landing-surface-muted relative">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="aspect-[16/9] bg-gradient-to-br from-landing-accent to-landing-surface-muted flex items-center justify-center">
                  <span className="text-landing-brand/30 text-3xl font-bold">DB</span>
                </div>
              )}
              <div className="p-6 flex flex-col flex-grow">
                {post.category && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-landing-success bg-landing-success/10 px-2 py-0.5 rounded w-fit mb-3">
                    {post.category}
                  </span>
                )}
                <h3 className="text-lg font-bold text-landing-brand mb-2 group-hover:text-landing-success transition-colors">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-landing-text-faint text-sm leading-relaxed flex-grow mb-4">
                    {post.excerpt.length > 120
                      ? `${post.excerpt.slice(0, 120)}...`
                      : post.excerpt}
                  </p>
                )}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-landing-border/50">
                  <div className="flex items-center gap-1.5 text-xs text-landing-text-faint">
                    <Calendar className="size-3.5" />
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : ''}
                  </div>
                  <span className="text-landing-success text-sm font-semibold inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Read <ArrowRight className="size-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="md:hidden text-center">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-landing-brand font-semibold text-sm hover:text-landing-brand/80 transition-colors"
          >
            View All News <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
