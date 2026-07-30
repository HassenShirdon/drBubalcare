import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createCaseSchema } from '@/lib/schemas/case.schema';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const role = (session.user as { role: string }).role;

  const { searchParams } = new URL(request.url);
  const take = Math.min(Math.max(parseInt(searchParams.get('take') || '50', 10) || 50, 1), 200);
  const skip = Math.max(parseInt(searchParams.get('skip') || '0', 10) || 0, 0);

  const orderBy = { createdAt: 'desc' as const };

  if (role === 'PATIENT') {
    const [cases, total] = await Promise.all([
      prisma.case.findMany({
        where: { patientId: userId },
        include: {
          records: true,
          opinions: {
            include: { specialist: { select: { name: true } } },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          aiPrescreens: { take: 1 },
          referralCoordination: true,
        },
        orderBy,
        take,
        skip,
      }),
      prisma.case.count({ where: { patientId: userId } }),
    ]);
    return NextResponse.json({ data: cases, total, take, skip }, {
      headers: { 'Cache-Control': 'private, no-store' },
    });
  }

  if (role === 'DOCTOR') {
    const [cases, total] = await Promise.all([
      prisma.case.findMany({
        where: { specialistId: userId },
        include: {
          patient: { select: { name: true, email: true } },
          records: true,
          referralCoordination: true,
          opinions: {
            where: { specialistId: userId },
            take: 1,
          },
        },
        orderBy,
        take,
        skip,
      }),
      prisma.case.count({ where: { specialistId: userId } }),
    ]);
    return NextResponse.json({ data: cases, total, take, skip }, {
      headers: { 'Cache-Control': 'private, no-store' },
    });
  }

  if (role === 'ADMIN') {
    const [cases, total] = await Promise.all([
      prisma.case.findMany({
        include: {
          patient: { select: { name: true, email: true } },
          specialist: { select: { name: true } },
          records: true,
        },
        orderBy,
        take,
        skip,
      }),
      prisma.case.count(),
    ]);
    return NextResponse.json({ data: cases, total, take, skip }, {
      headers: { 'Cache-Control': 'private, no-store' },
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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid or empty request body' }, { status: 400 });
  }

  const parsed = createCaseSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  // Create the case first — Neon HTTP adapter does not support nested create transactions
  const caseRecord = await prisma.case.create({
    data: {
      patientId: userId,
      serviceType: parsed.data.serviceType,
      description: parsed.data.description,
      status: 'OPEN',
    },
  });

  let result: Record<string, unknown> = caseRecord;

  // If EUROPEAN_REFERRAL, create the referral coordination in a separate query
  if (parsed.data.serviceType === 'EUROPEAN_REFERRAL') {
    const rc = await prisma.referralCoordination.create({
      data: {
        caseId: caseRecord.id,
        referralStatus: 'SEARCHING',
      },
    });
    result = { ...caseRecord, referralCoordination: rc };
  }

  return NextResponse.json(result, {
    status: 201,
    headers: {
      'Cache-Control': 'private, no-store',
    },
  });
}
