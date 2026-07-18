import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: { select: { name: true, image: true } } },
  });

  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json(post);
}
