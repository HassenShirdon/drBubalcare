import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const results = await prisma.labResult.findMany({
    where: { patientId: (session.user as { id: string }).id },
    include: { metrics: true },
    orderBy: { date: 'desc' },
  });

  return NextResponse.json(results, {
    headers: {
      'Cache-Control': 'private, no-store',
    },
  });
}
