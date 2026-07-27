import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowLeft, Tag } from 'lucide-react';
import { NewsContent } from './news-content';

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    include: { author: { select: { name: true } } },
  });

  if (!post) notFound();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="bg-white/80 backdrop-blur-md border-b border-[#E2E8F0]/50 fixed top-0 w-full z-50">
        <div className="flex justify-between items-center max-w-4xl mx-auto px-6 md:px-16 py-4">
          <Link href="/" className="text-2xl font-bold text-[#1E3A5F]">
            Dr Bubal Care
          </Link>
        </div>
      </nav>

      <main className="pt-28 pb-20 max-w-4xl mx-auto px-6 md:px-16">
        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#1E3A5F] transition-colors mb-8"
        >
          <ArrowLeft className="size-4" />
          Back to News
        </Link>

        <article>
          {post.coverImage && (
            <div className="aspect-[2/1] rounded-2xl overflow-hidden mb-10 bg-[#F1F5F9] relative">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}

          <div className="max-w-3xl">
            {post.category && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#15803D] bg-[#15803D]/10 px-2 py-0.5 rounded">
                {post.category}
              </span>
            )}

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0F172A] mt-4 mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-[#64748B] mb-10 pb-8 border-b border-[#E2E8F0]/50">
              <div className="flex items-center gap-1.5">
                <Calendar className="size-4" />
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : ''}
              </div>
              {post.author.name && (
                <span>By {post.author.name}</span>
              )}
              {post.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-[#F1F5F9] text-[#64748B] text-xs px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {post.excerpt && (
              <p className="text-lg text-[#64748B]/90 leading-relaxed mb-8 font-medium">
                {post.excerpt}
              </p>
            )}

            <div className="prose prose-lg max-w-none">
              <NewsContent content={post.content} />
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
