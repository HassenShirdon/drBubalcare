import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

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
    caseRecord: {
      create: vi.fn(),
      count: vi.fn(),
      findMany: vi.fn(),
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
      count: vi.fn(),
    },
    aIPrescreen: {
      create: vi.fn(),
    },
    plainLanguageSummary: {
      create: vi.fn(),
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
  CaseStatus: {
    OPEN: 'OPEN',
    AI_PRE_SCREENED: 'AI_PRE_SCREENED',
    UNDER_REVIEW: 'UNDER_REVIEW',
    OPINION_READY: 'OPINION_READY',
    CLOSED: 'CLOSED',
    DISPUTED: 'DISPUTED',
  },
  ServiceType: {
    SPECIALIST_OPINION: 'SPECIALIST_OPINION',
    RESULT_INTERPRETATION: 'RESULT_INTERPRETATION',
    FOLLOW_UP: 'FOLLOW_UP',
    TREND_ANALYSIS: 'TREND_ANALYSIS',
    EUROPEAN_REFERRAL: 'EUROPEAN_REFERRAL',
  },
}));

vi.mock('fs/promises', () => ({
  writeFile: vi.fn().mockResolvedValue(undefined),
  mkdir: vi.fn().mockResolvedValue(undefined),
}));

import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { createCaseSchema } from '@/lib/schemas/case.schema';
import { POST as createCase } from '@/app/api/cases/route';
import { PATCH as verifyDoctor } from '@/app/api/admin/specialists/[id]/verify/route';
import { PATCH as assignCase } from '@/app/api/admin/cases/[id]/assign/route';
import { POST as saveOpinion } from '@/app/api/doctor/cases/[id]/opinion/route';
import { POST as uploadRecords } from '@/app/api/cases/[id]/records/route';
import { GET as getCase } from '@/app/api/cases/[id]/route';

const mockSession = (role: string, id: string) => ({
  user: { id, role, name: 'Test', email: 'test@test.com' },
});

function createRequest(body?: unknown): Request {
  return { json: async () => body } as unknown as Request;
}

function createFormDataRequest(files: { name: string; type: string; size: number }[]): Request {
  const formData = new FormData();
  for (const file of files) {
    const blob = new Blob([new ArrayBuffer(file.size)], { type: file.type });
    Object.defineProperty(blob, 'name', { value: file.name });
    formData.append('files', blob, file.name);
  }
  return {
    formData: async () => formData,
  } as unknown as Request;
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

describe('Phase 1 Happy Path E2E', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXTAUTH_URL = 'http://localhost:3000';
    process.env.INTERNAL_API_SECRET = 'test-secret';
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    } as Response);
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('completes the full workflow with AI trigger verification', async () => {
    // ─── Step 1: Patient creates a case ───
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

    // ─── Step 2: Admin verifies doctor ───
    vi.mocked(getServerSession).mockResolvedValue(mockSession('ADMIN', ADMIN_ID) as any);
    vi.mocked(prisma.doctor.findUnique).mockResolvedValue({
      id: DOCTOR_PROFILE_ID, userId: DOCTOR_USER_ID, specialty: 'Cardiology', verified: false,
    } as any);
    vi.mocked(prisma.doctor.update).mockResolvedValue({
      id: DOCTOR_PROFILE_ID, userId: DOCTOR_USER_ID, verified: true,
    } as any);

    const verifyRes = await verifyDoctor(createRequest({ verified: true }), params(DOCTOR_PROFILE_ID));
    expect(verifyRes.status).toBe(200);

    // ─── Step 3: Admin assigns case to doctor ───
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

    // ─── Step 4: Patient uploads records → triggers AI pre-screening ───
    vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', PATIENT_ID) as any);
    vi.mocked(prisma.case.findUnique).mockResolvedValue({
      id: CASE_ID, patientId: PATIENT_ID,
    } as any);
    vi.mocked(prisma.caseRecord.create).mockResolvedValue({
      id: 'record-1', caseId: CASE_ID,
      fileUrl: '/uploads/test_xray.jpg', fileType: 'image/jpeg', fileName: 'xray.jpg',
      uploadedAt: new Date(),
    } as any);
    vi.mocked(prisma.caseRecord.count).mockResolvedValue(1);

    const uploadRes = await uploadRecords(
      createFormDataRequest([{ name: 'xray.jpg', type: 'image/jpeg', size: 1024 }]),
      params(CASE_ID),
    );
    expect(uploadRes.status).toBe(201);

    // Verify AI pre-screening fetch was triggered (fire and forget)
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/ai/prescreen/case-1',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'x-internal-secret': 'test-secret',
        }),
      }),
    );

    // ─── Step 5: Doctor saves draft opinion ───
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

    // Verify no summary fetch triggered on draft save
    const draftFetchCalls = vi.mocked(global.fetch).mock.calls;
    const draftSummaryCalls = draftFetchCalls.filter(
      (call) => typeof call[0] === 'string' && call[0].includes('/api/ai/summary/'),
    );
    expect(draftSummaryCalls).toHaveLength(0);

    // ─── Step 6: Doctor signs opinion → triggers summary generation ───
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

    // Verify plain-language summary fetch was triggered (fire and forget)
    const allFetchCalls = vi.mocked(global.fetch).mock.calls;
    const summaryCalls = allFetchCalls.filter(
      (call) => typeof call[0] === 'string' && call[0].includes('/api/ai/summary/'),
    );
    expect(summaryCalls.length).toBeGreaterThanOrEqual(1);
    expect(summaryCalls[0][0]).toBe(
      `http://localhost:3000/api/ai/summary/${OPINION_ID}`,
    );
    expect(summaryCalls[0][1]).toEqual(
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'x-internal-secret': 'test-secret',
        }),
      }),
    );

    // ─── Step 7: Patient views case with AI prescreen data ───
    vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', PATIENT_ID) as any);
    vi.mocked(prisma.case.findUnique).mockResolvedValue({
      id: CASE_ID, patientId: PATIENT_ID,
      patient: { name: 'Patient', email: 'p@test.com' },
      specialist: { name: 'Doctor', email: 'd@test.com' },
      records: [{ id: 'record-1', fileUrl: '/uploads/test_xray.jpg', fileType: 'image/jpeg', fileName: 'xray.jpg' }],
      opinions: [{
        id: OPINION_ID, content: 'Final: findings indicate mild abnormalities',
        status: 'SIGNED', signedAt: new Date(), specialist: { name: 'Doctor' },
        plainSummary: { id: 'summary-1', content: 'Your doctor found mild abnormalities.', generatedAt: new Date() },
      }],
      aiPrescreens: [{
        id: 'prescreen-1', caseId: CASE_ID,
        findings: 'Mild cardiomegaly noted',
        differentials: 'Hypertensive heart disease',
        urgentFlags: null,
        generatedAt: new Date(),
      }],
    } as any);

    const caseViewRes = await getCase(createRequest(), params(CASE_ID));
    expect(caseViewRes.status).toBe(200);
    const caseData = await caseViewRes.json();

    // Verify AI prescreen data is accessible
    expect(caseData.aiPrescreens).toHaveLength(1);
    expect(caseData.aiPrescreens[0].findings).toBe('Mild cardiomegaly noted');
    expect(caseData.aiPrescreens[0].generatedAt).toBeDefined();

    // Verify plain-language summary is accessible via the opinion
    expect(caseData.opinions).toHaveLength(1);
    expect(caseData.opinions[0].plainSummary).toBeDefined();
    expect(caseData.opinions[0].plainSummary.content).toBe('Your doctor found mild abnormalities.');

    // Verify records are included
    expect(caseData.records).toHaveLength(1);
    expect(caseData.records[0].fileName).toBe('xray.jpg');
  });

  it('does not trigger AI pre-screening on subsequent file uploads', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', PATIENT_ID) as any);
    vi.mocked(prisma.case.findUnique).mockResolvedValue({
      id: CASE_ID, patientId: PATIENT_ID,
    } as any);
    vi.mocked(prisma.caseRecord.create).mockResolvedValue({
      id: 'record-2', caseId: CASE_ID,
      fileUrl: '/uploads/test_report.pdf', fileType: 'application/pdf', fileName: 'report.pdf',
      uploadedAt: new Date(),
    } as any);
    vi.mocked(prisma.caseRecord.count).mockResolvedValue(2);

    const uploadRes = await uploadRecords(
      createFormDataRequest([{ name: 'report.pdf', type: 'application/pdf', size: 2048 }]),
      params(CASE_ID),
    );
    expect(uploadRes.status).toBe(201);

    // Verify AI pre-screening was NOT triggered for second upload
    const prescreenCalls = vi.mocked(global.fetch).mock.calls.filter(
      (call) => typeof call[0] === 'string' && call[0].includes('/api/ai/prescreen/'),
    );
    expect(prescreenCalls).toHaveLength(0);
  });

  it('does not trigger summary generation on draft save', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession('DOCTOR', DOCTOR_USER_ID) as any);
    vi.mocked(prisma.case.findFirst).mockResolvedValue({
      id: CASE_ID, specialistId: DOCTOR_USER_ID,
    } as any);
    vi.mocked(prisma.specialistOpinion.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.specialistOpinion.create).mockResolvedValue({
      id: OPINION_ID, caseId: CASE_ID, specialistId: DOCTOR_USER_ID,
      content: 'Draft notes', status: 'DRAFT',
      signedAt: null, createdAt: new Date(),
    } as any);

    const draftRes = await saveOpinion(
      createRequest({ content: 'Draft notes', sign: false }),
      params(CASE_ID),
    );
    expect(draftRes.status).toBe(200);

    const summaryCalls = vi.mocked(global.fetch).mock.calls.filter(
      (call) => typeof call[0] === 'string' && call[0].includes('/api/ai/summary/'),
    );
    expect(summaryCalls).toHaveLength(0);
  });
});
