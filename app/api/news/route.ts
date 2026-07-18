import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: { select: { name: true } } },
    orderBy: { publishedAt: 'desc' },
  });

  return NextResponse.json(posts, {
    headers: {
      'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
    },
  });
}
