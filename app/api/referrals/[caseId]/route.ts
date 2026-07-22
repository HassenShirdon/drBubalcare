import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const updateReferralSchema = z.object({
  referralStatus: z.enum(['SEARCHING', 'MATCHED', 'SCHEDULED', 'COMPLETED', 'CLOSED']).optional(),
  specialistName: z.string().optional(),
  specialistEmail: z.string().email().optional().or(z.literal('')),
  clinic: z.string().optional(),
  country: z.string().optional(),
  consultationType: z.enum(['IN_PERSON', 'VIRTUAL']).optional(),
  coordinatorNotes: z.string().optional(),
  scheduledAt: z.string().datetime().optional().nullable(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ caseId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { caseId } = await params;
  const userId = (session.user as { id: string }).id;
  const role = (session.user as { role: string }).role;

  const caseRecord = await prisma.case.findUnique({
    where: { id: caseId },
    select: { patientId: true, serviceType: true },
  });

  if (!caseRecord) {
    return NextResponse.json({ error: 'Case not found' }, { status: 404 });
  }

  if (caseRecord.serviceType !== 'EUROPEAN_REFERRAL') {
    return NextResponse.json({ error: 'Not a referral case' }, { status: 400 });
  }

  if (role === 'PATIENT' && caseRecord.patientId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const coordination = await prisma.referralCoordination.findUnique({
    where: { caseId },
  });

  if (!coordination) {
    return NextResponse.json({ error: 'Referral coordination not found' }, { status: 404 });
  }

  return NextResponse.json(coordination, {
    headers: { 'Cache-Control': 'private, no-store' },
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ caseId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = (session.user as { role: string }).role;
  if (role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { caseId } = await params;
  const body = await request.json();
  const parsed = updateReferralSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const caseRecord = await prisma.case.findUnique({
    where: { id: caseId },
    select: { serviceType: true },
  });

  if (!caseRecord) {
    return NextResponse.json({ error: 'Case not found' }, { status: 404 });
  }

  if (caseRecord.serviceType !== 'EUROPEAN_REFERRAL') {
    return NextResponse.json({ error: 'Not a referral case' }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  if (parsed.data.referralStatus !== undefined) data.referralStatus = parsed.data.referralStatus;
  if (parsed.data.specialistName !== undefined) data.specialistName = parsed.data.specialistName;
  if (parsed.data.specialistEmail !== undefined) data.specialistEmail = parsed.data.specialistEmail || null;
  if (parsed.data.clinic !== undefined) data.clinic = parsed.data.clinic;
  if (parsed.data.country !== undefined) data.country = parsed.data.country;
  if (parsed.data.consultationType !== undefined) data.consultationType = parsed.data.consultationType;
  if (parsed.data.coordinatorNotes !== undefined) data.coordinatorNotes = parsed.data.coordinatorNotes;
  if (parsed.data.scheduledAt !== undefined) data.scheduledAt = parsed.data.scheduledAt ? new Date(parsed.data.scheduledAt) : null;
  if (parsed.data.referralStatus === 'COMPLETED') data.completedAt = new Date();

  const coordination = await prisma.referralCoordination.upsert({
    where: { caseId },
    create: { caseId, ...data },
    update: data,
  });

  return NextResponse.json(coordination, {
    headers: { 'Cache-Control': 'private, no-store' },
  });
}
