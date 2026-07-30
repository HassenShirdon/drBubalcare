import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = (session.user as { role: string }).role;
  if (role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = request.nextUrl;
  const take = Math.min(Math.max(parseInt(searchParams.get('take') || '50', 10) || 50, 1), 200);
  const skip = Math.max(parseInt(searchParams.get('skip') || '0', 10) || 0, 0);

  const [data, total] = await Promise.all([
    prisma.case.findMany({
      take,
      skip,
      include: {
        patient: { select: { name: true, email: true } },
        specialist: { select: { name: true, email: true } },
        referralCoordination: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.case.count(),
  ]);

  return NextResponse.json({ data, total });
}
