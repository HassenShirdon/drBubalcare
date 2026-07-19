import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = (session.user as { role: string }).role;
  if (role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const deletionRequests = await prisma.dataDeletionRequest.findMany({
    include: { patient: { select: { name: true, email: true } } },
    orderBy: { requestedAt: 'desc' },
  });

  return NextResponse.json(deletionRequests, {
    headers: { 'Cache-Control': 'private, no-store' },
  });
}
