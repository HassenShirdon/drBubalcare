import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      category: true,
      publishedAt: true,
    },
  });

  return NextResponse.json(posts);
}
