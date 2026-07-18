import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const role = (session.user as { role: string }).role;
  if (role !== 'DOCTOR') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const cases = await prisma.case.findMany({
    where: { specialistId: userId },
    include: {
      patient: { select: { name: true, email: true } },
      opinions: {
        where: { specialistId: userId },
        select: { id: true, status: true, signedAt: true },
        take: 1,
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(cases);
}
