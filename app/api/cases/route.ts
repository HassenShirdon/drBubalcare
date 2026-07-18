import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createCaseSchema } from '@/lib/schemas/case.schema';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const role = (session.user as { role: string }).role;

  if (role === 'PATIENT') {
    const cases = await prisma.case.findMany({
      where: { patientId: userId },
      include: {
        records: true,
        opinions: {
          include: { specialist: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        aiPrescreens: { take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(cases, {
      headers: {
        'Cache-Control': 'private, no-store',
      },
    });
  }

  if (role === 'DOCTOR') {
    const cases = await prisma.case.findMany({
      where: { specialistId: userId },
      include: {
        patient: { select: { name: true, email: true } },
        records: true,
        opinions: {
          where: { specialistId: userId },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(cases, {
      headers: {
        'Cache-Control': 'private, no-store',
      },
    });
  }

  if (role === 'ADMIN') {
    const cases = await prisma.case.findMany({
      include: {
        patient: { select: { name: true, email: true } },
        specialist: { select: { name: true } },
        records: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(cases, {
      headers: {
        'Cache-Control': 'private, no-store',
      },
    });
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const role = (session.user as { role: string }).role;

  if (role !== 'PATIENT') {
    return NextResponse.json({ error: 'Only patients can create cases' }, { status: 403 });
  }

  const body = await request.json();
  const parsed = createCaseSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const caseRecord = await prisma.case.create({
    data: {
      patientId: userId,
      serviceType: parsed.data.serviceType,
      status: 'OPEN',
    },
  });

  return NextResponse.json(caseRecord, {
    status: 201,
    headers: {
      'Cache-Control': 'private, no-store',
    },
  });
}
