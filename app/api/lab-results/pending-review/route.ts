import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { serverError, ok } from '@/lib/api-helpers';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const role = (session.user as { role: string }).role;
    if (role !== 'DOCTOR' && role !== 'ADMIN') {
      return NextResponse.json({ error: 'Only specialists and admins can view pending reviews' }, { status: 403 });
    }

    const results = await prisma.labResult.findMany({
      where: { status: 'REVIEW_NEEDED' },
      include: {
        patient: { select: { name: true, age: true, gender: true } },
        metrics: true,
      },
      orderBy: { date: 'desc' },
      take: 20,
    });

    return ok(results);
  } catch (error) {
    return serverError(error);
  }
}
