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
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
  const offset = parseInt(searchParams.get('offset') ?? '0');
  const action = searchParams.get('action') ?? undefined;
  const resourceType = searchParams.get('resourceType') ?? undefined;
  const userId = searchParams.get('userId') ?? undefined;
  const startDate = searchParams.get('startDate') ?? undefined;
  const endDate = searchParams.get('endDate') ?? undefined;

  const where: Record<string, unknown> = {};
  if (action) where.action = action;
  if (resourceType) where.resourceType = resourceType;
  if (userId) where.userId = userId;
  if (startDate || endDate) {
    where.timestamp = {};
    if (startDate) (where.timestamp as Record<string, Date>).gte = new Date(startDate);
    if (endDate) (where.timestamp as Record<string, Date>).lte = new Date(endDate);
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: { user: { select: { name: true, email: true } } },
      orderBy: { timestamp: 'desc' },
      take: limit,
      skip: offset,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return NextResponse.json({ logs, total }, {
    headers: { 'Cache-Control': 'private, no-store' },
  });
}
