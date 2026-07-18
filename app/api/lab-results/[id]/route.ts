import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const result = await prisma.labResult.findUnique({
    where: { id },
    include: { metrics: true, trends: true },
  });

  if (!result) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (result.patientId !== (session.user as { id: string }).id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json(result);
}
