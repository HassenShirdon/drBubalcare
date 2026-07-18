'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Calendar, ArrowRight } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  category: string | null;
  publishedAt: string | null;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
} as const;

export default function LatestNewsClient() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/news/latest')
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  if (!loaded || posts.length === 0) return null;

  return (
    <motion.section
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="py-24 bg-white border-t border-surface-gray/50"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-16 space-y-12">
        <div className="flex items-end justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 bg-evidence-blue-light px-4 py-1.5 rounded-full text-clinical-navy text-xs font-semibold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-healing-teal" />
              <span>Updates</span>
            </div>
            <h2 className="font-headline-lg text-3xl md:text-4xl lg:text-5xl font-bold text-text-medical-black">
              Latest News
            </h2>
            <p className="text-on-surface-variant/80 text-lg max-w-2xl">
              Stay informed with the latest from Dr. Bubal Care — platform updates, medical insights, and global health news.
            </p>
          </div>
          <Link
            href="/news"
            className="hidden md:inline-flex items-center gap-2 text-clinical-navy font-semibold text-sm hover:text-healing-teal transition-colors"
          >
            View All News <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                <h3 className="font-headline-md text-lg font-bold text-clinical-navy mb-2 group-hover:text-healing-teal transition-colors">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-on-surface-variant text-sm leading-relaxed flex-grow mb-4">
                    {post.excerpt.length > 120 ? `${post.excerpt.slice(0, 120)}...` : post.excerpt}
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

        <div className="md:hidden text-center">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-clinical-navy font-semibold text-sm hover:text-healing-teal transition-colors"
          >
            View All News <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
