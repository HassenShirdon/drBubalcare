import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('next/server', () => ({
  NextResponse: {
    json: (data: unknown, init?: { status?: number }) =>
      new Response(JSON.stringify(data), {
        status: init?.status ?? 200,
        headers: { 'content-type': 'application/json' },
      }),
  },
}));

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
  authOptions: {},
}));

vi.mock('@/lib/db', () => ({
  prisma: {
    case: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
    doctor: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    specialistOpinion: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('@/lib/schemas/case.schema', () => ({
  createCaseSchema: {
    safeParse: vi.fn(),
  },
}));

vi.mock('@/lib/generated/prisma/enums', () => ({
  OpinionStatus: { DRAFT: 'DRAFT', SIGNED: 'SIGNED', DELIVERED: 'DELIVERED', DISPUTED: 'DISPUTED' },
}));

import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { createCaseSchema } from '@/lib/schemas/case.schema';
import { POST as createCase } from '@/app/api/cases/route';
import { PATCH as verifyDoctor } from '@/app/api/admin/specialists/[id]/verify/route';
import { PATCH as assignCase } from '@/app/api/admin/cases/[id]/assign/route';
import { POST as saveOpinion } from '@/app/api/doctor/cases/[id]/opinion/route';
import { GET as getCase } from '@/app/api/cases/[id]/route';

const mockSession = (role: string, id: string) => ({
  user: { id, role, name: 'Test', email: 'test@test.com' },
});

function createRequest(body?: unknown): Request {
  return { json: async () => body } as unknown as Request;
}

function params(id: string) {
  return { params: Promise.resolve({ id }) };
}

const PATIENT_ID = 'patient-1';
const DOCTOR_USER_ID = 'doctor-user-1';
const DOCTOR_PROFILE_ID = 'doctor-profile-1';
const ADMIN_ID = 'admin-1';
const CASE_ID = 'case-1';
const OPINION_ID = 'opinion-1';

describe('Specialist Opinion Workflow E2E', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('completes the full specialist opinion workflow', async () => {
    // Step 1: Patient creates a case
    vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', PATIENT_ID) as any);
    vi.mocked(createCaseSchema.safeParse).mockReturnValue({
      success: true,
      data: { serviceType: 'SPECIALIST_OPINION', description: 'Chest pain review' },
    } as any);
    vi.mocked(prisma.case.create).mockResolvedValue({
      id: CASE_ID, patientId: PATIENT_ID, specialistId: null,
      serviceType: 'SPECIALIST_OPINION', status: 'OPEN',
      createdAt: new Date(), updatedAt: new Date(),
    } as any);

    const createRes = await createCase(createRequest({ serviceType: 'SPECIALIST_OPINION', description: 'Chest pain review' }));
    expect(createRes.status).toBe(201);

    // Step 2: Admin verifies doctor
    vi.mocked(getServerSession).mockResolvedValue(mockSession('ADMIN', ADMIN_ID) as any);
    vi.mocked(prisma.doctor.findUnique).mockResolvedValue({
      id: DOCTOR_PROFILE_ID, userId: DOCTOR_USER_ID, specialty: 'Cardiology', verified: false,
    } as any);
    vi.mocked(prisma.doctor.update).mockResolvedValue({
      id: DOCTOR_PROFILE_ID, userId: DOCTOR_USER_ID, verified: true,
    } as any);

    const verifyRes = await verifyDoctor(createRequest({ verified: true }), params(DOCTOR_PROFILE_ID));
    expect(verifyRes.status).toBe(200);

    // Step 3: Admin assigns case to doctor
    vi.mocked(prisma.case.findUnique).mockResolvedValue({
      id: CASE_ID, patientId: PATIENT_ID, status: 'OPEN',
    } as any);
    vi.mocked(prisma.doctor.findFirst).mockResolvedValue({
      id: DOCTOR_PROFILE_ID, userId: DOCTOR_USER_ID, verified: true,
    } as any);
    vi.mocked(prisma.case.update).mockResolvedValue({
      id: CASE_ID, patientId: PATIENT_ID, specialistId: DOCTOR_USER_ID, status: 'UNDER_REVIEW',
    } as any);

    const assignRes = await assignCase(createRequest({ specialistId: DOCTOR_USER_ID }), params(CASE_ID));
    expect(assignRes.status).toBe(200);

    // Step 4: Doctor saves draft opinion
    vi.mocked(getServerSession).mockResolvedValue(mockSession('DOCTOR', DOCTOR_USER_ID) as any);
    vi.mocked(prisma.case.findFirst).mockResolvedValue({
      id: CASE_ID, specialistId: DOCTOR_USER_ID,
    } as any);
    vi.mocked(prisma.specialistOpinion.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.specialistOpinion.create).mockResolvedValue({
      id: OPINION_ID, caseId: CASE_ID, specialistId: DOCTOR_USER_ID,
      content: 'Draft: findings indicate mild abnormalities', status: 'DRAFT',
      signedAt: null, createdAt: new Date(),
    } as any);

    const draftRes = await saveOpinion(
      createRequest({ content: 'Draft: findings indicate mild abnormalities', sign: false }),
      params(CASE_ID),
    );
    expect(draftRes.status).toBe(200);

    // Step 5: Patient cannot see draft opinions
    vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', PATIENT_ID) as any);
    vi.mocked(prisma.case.findUnique).mockResolvedValue({
      id: CASE_ID, patientId: PATIENT_ID,
      patient: { name: 'Patient', email: 'p@test.com' },
      specialist: { name: 'Doctor', email: 'd@test.com' },
      records: [], opinions: [], aiPrescreens: [],
    } as any);

    const draftViewRes = await getCase(createRequest(), params(CASE_ID));
    expect(draftViewRes.status).toBe(200);
    const draftViewData = await draftViewRes.json();
    expect(draftViewData.opinions).toHaveLength(0);

    // Step 6: Doctor signs opinion
    vi.mocked(getServerSession).mockResolvedValue(mockSession('DOCTOR', DOCTOR_USER_ID) as any);
    vi.mocked(prisma.specialistOpinion.findFirst).mockResolvedValue({
      id: OPINION_ID, caseId: CASE_ID, specialistId: DOCTOR_USER_ID,
      content: 'Draft: findings indicate mild abnormalities', status: 'DRAFT',
      signedAt: null, createdAt: new Date(),
    } as any);
    vi.mocked(prisma.specialistOpinion.update).mockResolvedValue({
      id: OPINION_ID, caseId: CASE_ID, specialistId: DOCTOR_USER_ID,
      content: 'Final: findings indicate mild abnormalities', status: 'SIGNED',
      signedAt: new Date(), createdAt: new Date(),
    } as any);
    vi.mocked(prisma.case.update).mockResolvedValue({
      id: CASE_ID, status: 'OPINION_READY',
    } as any);

    const signRes = await saveOpinion(
      createRequest({ content: 'Final: findings indicate mild abnormalities', sign: true }),
      params(CASE_ID),
    );
    expect(signRes.status).toBe(200);

    // Step 7: Patient can view signed opinion
    vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', PATIENT_ID) as any);
    vi.mocked(prisma.case.findUnique).mockResolvedValue({
      id: CASE_ID, patientId: PATIENT_ID,
      patient: { name: 'Patient', email: 'p@test.com' },
      specialist: { name: 'Doctor', email: 'd@test.com' },
      records: [],
      opinions: [{
        id: OPINION_ID, content: 'Final: findings indicate mild abnormalities',
        status: 'SIGNED', signedAt: new Date(), specialist: { name: 'Doctor' },
      }],
      aiPrescreens: [],
    } as any);

    const signedViewRes = await getCase(createRequest(), params(CASE_ID));
    expect(signedViewRes.status).toBe(200);
    const signedViewData = await signedViewRes.json();
    expect(signedViewData.opinions).toHaveLength(1);
    expect(signedViewData.opinions[0].status).toBe('SIGNED');
  });
});
