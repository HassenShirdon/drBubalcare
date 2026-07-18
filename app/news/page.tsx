import Link from 'next/link';
import { prisma } from '@/lib/db';
import Image from 'next/image';
import { Calendar, ArrowRight, Tag } from 'lucide-react';
import { unstable_cacheTag as cacheTag } from 'next/cache';

async function getLatestPosts() {
  'use cache';
  cacheTag('news');

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      category: true,
      createdAt: true,
    },
  });

  return posts;
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function NewsPage() {
  const posts = await getLatestPosts();

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pb-24 md:pb-8 space-y-8">
      <div>
        <p className="text-on-surface-variant text-sm mb-1">Dr. Bubal Care</p>
        <h1 className="text-clinical-navy font-bold text-2xl md:text-3xl">News & Updates</h1>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 text-on-surface-variant">
          <p className="text-lg">No posts yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/news/${post.slug}`}
              className="group block bg-white rounded-2xl border border-surface-gray/60 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {post.coverImage && (
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-5">
                {post.category && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-clinical-navy bg-evidence-blue-light/30 px-2 py-1 rounded-full mb-2">
                    <Tag className="size-3" />
                    {post.category}
                  </span>
                )}
                <h2 className="font-semibold text-text-medical-black text-lg group-hover:text-clinical-navy transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-on-surface-variant text-sm mt-1 line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-3 text-xs text-on-surface-variant">
                  <Calendar className="size-3" />
                  {formatDate(post.createdAt)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
