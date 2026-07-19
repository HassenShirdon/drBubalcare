import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = (session.user as { role: string }).role;
  if (role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const cutoff = new Date(Date.now() - FOUR_HOURS_MS);

  const unmatchedCases = await prisma.case.findMany({
    where: {
      status: 'OPEN',
      specialistId: null,
      createdAt: { lt: cutoff },
    },
    include: { patient: { select: { name: true, email: true } } },
    orderBy: { createdAt: 'asc' },
  });

  return NextResponse.json({ cases: unmatchedCases }, {
    headers: { 'Cache-Control': 'private, no-store' },
  });
}
