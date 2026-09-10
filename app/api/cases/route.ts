import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Prisma } from '@/lib/generated/prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createCaseSchema } from '@/lib/schemas/case.schema';
import { intakeSchema } from '@/lib/schemas/intake.schema';
import { z } from 'zod';

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

  // Optional intake payload — the full patient case-review form
  let intake: z.infer<typeof intakeSchema> | null = null;
  if (body && typeof body === 'object' && 'intake' in (body as Record<string, unknown>)) {
    const intakeParsed = intakeSchema.safeParse((body as Record<string, unknown>).intake);
    if (!intakeParsed.success) {
      return NextResponse.json({ error: intakeParsed.error.flatten() }, { status: 400 });
    }
    intake = intakeParsed.data;
  }

  // Build the case description for the specialist / AI pre-screen from the intake form
  const description = intake
    ? [
        intake.reasonForRequest.length
          ? `Reason for request: ${intake.reasonForRequest.join(', ')}`
          : null,
        intake.diagnosis ? `Diagnosis: ${intake.diagnosis}` : null,
        intake.mainSymptoms ? `Main symptoms: ${intake.mainSymptoms}` : null,
        intake.diagnosis ? null : `Main concern: ${intake.mainConcern}`,
      ]
        .filter(Boolean)
        .join('\n')
    : parsed.data.description;

  // Create the case first — Neon HTTP adapter does not support nested create transactions
  const caseRecord = await prisma.case.create({
    data: {
      patientId: userId,
      serviceType: parsed.data.serviceType,
      description: description || null,
      status: 'OPEN',
    },
  });

  let result: Record<string, unknown> = caseRecord;

  // Persist the full case-review intake form when provided
  if (intake) {
    const intakeRecord = await prisma.caseIntake.create({
      data: {
        caseId: caseRecord.id,
        age: intake.age ?? null,
        sex: intake.sex ?? null,
        serviceType: intake.serviceType,
        reviewType: intake.reviewType,
        reasonForRequest: intake.reasonForRequest,
        mainConcern: intake.mainConcern,
        diagnosis: intake.diagnosis || null,
        onsetDate: intake.onsetDate || null,
        mainSymptoms: intake.mainSymptoms || null,
        courseOfCondition: intake.courseOfCondition || null,
        medicalHistory: intake.medicalHistory,
        previousOperations: intake.previousOperations || null,
        medications: intake.medications.length ? intake.medications : Prisma.JsonNull,
        medicationAllergies: intake.medicationAllergies || null,
        labTests: intake.labTests.length ? intake.labTests : Prisma.JsonNull,
        imagingTypes: intake.imagingTypes,
        imagingFindings: intake.imagingFindings || null,
        previousOpinions: intake.previousOpinions || null,
        questionsForReview: intake.questionsForReview || null,
        lifestyleFactors: intake.lifestyleFactors,
        lifestyleNotes: intake.lifestyleNotes || null,
        familyHistory: intake.familyHistory,
        patientGoals: intake.patientGoals || null,
        outcomeDecision: intake.outcomeDecision || null,
        documentsToUpload: intake.documentsToUpload,
        requestedSpecialty: intake.requestedSpecialty || null,
        referralReason: intake.referralReason || null,
        referralUrgency: intake.referralUrgency || null,
        country: intake.country || null,
        preferredLanguage: intake.preferredLanguage || null,
        phone: intake.phone || null,
        preferredCommunication: intake.preferredCommunication,
        consentedToReview: intake.consentedToReview,
        confirmedAccuracy: intake.confirmedAccuracy,
        consentedToProcessing: intake.consentedToProcessing,
        signatureName: intake.signatureName,
      },
    });
    result = { ...caseRecord, intake: intakeRecord };
  }

  // If EUROPEAN_REFERRAL, create the referral coordination in a separate query
  if (parsed.data.serviceType === 'EUROPEAN_REFERRAL') {
    const rc = await prisma.referralCoordination.create({
      data: {
        caseId: caseRecord.id,
        referralStatus: 'SEARCHING',
      },
    });
    result = { ...result, referralCoordination: rc };
  }

  return NextResponse.json(result, {
    status: 201,
    headers: {
      'Cache-Control': 'private, no-store',
    },
  });
}
