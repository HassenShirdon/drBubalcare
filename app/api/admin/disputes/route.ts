import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = (session.user as { role: string }).role;
  if (role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') ?? undefined;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  const disputes = await prisma.dispute.findMany({
    where,
    include: {
      case: { select: { id: true, serviceType: true } },
      patient: { select: { name: true, email: true } },
      opinion: { select: { content: true, specialist: { select: { name: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(disputes, {
    headers: { 'Cache-Control': 'private, no-store' },
  });
}
