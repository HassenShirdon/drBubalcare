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
    },
    referralCoordination: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
  },
}));

vi.mock('@/lib/schemas/case.schema', () => ({
  createCaseSchema: {
    safeParse: vi.fn(),
  },
}));

vi.mock('@/lib/generated/prisma/enums', () => ({
  ServiceType: {
    SPECIALIST_OPINION: 'SPECIALIST_OPINION',
    RESULT_INTERPRETATION: 'RESULT_INTERPRETATION',
    FOLLOW_UP: 'FOLLOW_UP',
    TREND_ANALYSIS: 'TREND_ANALYSIS',
    EUROPEAN_REFERRAL: 'EUROPEAN_REFERRAL',
  },
  CaseStatus: {
    OPEN: 'OPEN',
    UNDER_REVIEW: 'UNDER_REVIEW',
    CLOSED: 'CLOSED',
  },
}));

import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { createCaseSchema } from '@/lib/schemas/case.schema';
import { POST as createCase } from '@/app/api/cases/route';
import { GET as getReferral, PATCH as updateReferral } from '@/app/api/referrals/[caseId]/route';

function mockSession(role: string, id = 'user-1') {
  (getServerSession as ReturnType<typeof vi.fn>).mockResolvedValue({
    user: { id, role, name: 'Test', email: 'test@test.com' },
  });
}

function createRequest(body?: unknown): Request {
  return { json: async () => body } as unknown as Request;
}

function paramsRequest(caseId: string) {
  return { params: Promise.resolve({ caseId }) } as unknown as Request;
}

describe('European Referral Workflow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Case Creation', () => {
    it('patient can create a referral case with auto-created coordination', async () => {
      mockSession('PATIENT');
      (createCaseSchema.safeParse as ReturnType<typeof vi.fn>).mockReturnValue({
        success: true,
        data: { serviceType: 'EUROPEAN_REFERRAL', description: 'Need a cardiologist in Germany' },
      });
      (prisma.case.create as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'case-1',
        patientId: 'user-1',
        serviceType: 'EUROPEAN_REFERRAL',
        status: 'OPEN',
        description: 'Need a cardiologist in Germany',
        referralCoordination: { referralStatus: 'SEARCHING' },
      });

      const res = await createCase(createRequest({ serviceType: 'EUROPEAN_REFERRAL', description: 'Need a cardiologist in Germany' }));
      const data = await res.json();

      expect(res.status).toBe(201);
      expect(data.serviceType).toBe('EUROPEAN_REFERRAL');
      expect(data.referralCoordination).toBeDefined();
      expect(data.referralCoordination.referralStatus).toBe('SEARCHING');
    });
  });

  describe('GET Referral Coordination', () => {
    it('patient can view their own referral', async () => {
      mockSession('PATIENT');
      (prisma.case.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        patientId: 'user-1',
        serviceType: 'EUROPEAN_REFERRAL',
      });
      (prisma.referralCoordination.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        caseId: 'case-1',
        referralStatus: 'MATCHED',
        specialistName: 'Dr. Mueller',
        clinic: 'Charité Berlin',
        country: 'Germany',
      });

      const res = await getReferral({} as Request, { params: Promise.resolve({ caseId: 'case-1' }) });
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.specialistName).toBe('Dr. Mueller');
      expect(data.clinic).toBe('Charité Berlin');
    });

    it('patient cannot view another patient referral', async () => {
      mockSession('PATIENT');
      (prisma.case.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        patientId: 'user-2',
        serviceType: 'EUROPEAN_REFERRAL',
      });

      const res = await getReferral({} as Request, { params: Promise.resolve({ caseId: 'case-1' }) });
      expect(res.status).toBe(403);
    });

    it('returns 400 for non-referral case type', async () => {
      mockSession('ADMIN');
      (prisma.case.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        patientId: 'user-1',
        serviceType: 'SPECIALIST_OPINION',
      });

      const res = await getReferral({} as Request, { params: Promise.resolve({ caseId: 'case-1' }) });
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe('Not a referral case');
    });

    it('returns 404 when case does not exist', async () => {
      mockSession('ADMIN');
      (prisma.case.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      const res = await getReferral({} as Request, { params: Promise.resolve({ caseId: 'nonexistent' }) });
      expect(res.status).toBe(404);
    });
  });

  describe('PATCH Referral Coordination', () => {
    it('admin can update referral to matched status', async () => {
      mockSession('ADMIN');
      (prisma.case.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        serviceType: 'EUROPEAN_REFERRAL',
      });
      (prisma.referralCoordination.upsert as ReturnType<typeof vi.fn>).mockResolvedValue({
        caseId: 'case-1',
        referralStatus: 'MATCHED',
        specialistName: 'Dr. Mueller',
        clinic: 'Charité Berlin',
        country: 'Germany',
      });

      const res = await updateReferral(
        createRequest({
          referralStatus: 'MATCHED',
          specialistName: 'Dr. Mueller',
          clinic: 'Charité Berlin',
          country: 'Germany',
        }),
        { params: Promise.resolve({ caseId: 'case-1' }) }
      );
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.referralStatus).toBe('MATCHED');
      expect(data.specialistName).toBe('Dr. Mueller');
    });

    it('admin can progress referral through the full lifecycle', async () => {
      mockSession('ADMIN');
      (prisma.case.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        serviceType: 'EUROPEAN_REFERRAL',
      });

      const statuses = ['SEARCHING', 'MATCHED', 'SCHEDULED', 'COMPLETED', 'CLOSED'];
      for (const status of statuses) {
        (prisma.referralCoordination.upsert as ReturnType<typeof vi.fn>).mockResolvedValue({
          caseId: 'case-1',
          referralStatus: status,
        });

        const res = await updateReferral(
          createRequest({ referralStatus: status }),
          { params: Promise.resolve({ caseId: 'case-1' }) }
        );
        const data = await res.json();
        expect(res.status).toBe(200);
        expect(data.referralStatus).toBe(status);
      }
    });

    it('patient cannot update referral coordination', async () => {
      mockSession('PATIENT');

      const res = await updateReferral(
        createRequest({ referralStatus: 'MATCHED' }),
        { params: Promise.resolve({ caseId: 'case-1' }) }
      );
      expect(res.status).toBe(403);
    });

    it('validates invalid referral status values', async () => {
      mockSession('ADMIN');
      (prisma.case.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        serviceType: 'EUROPEAN_REFERRAL',
      });

      const res = await updateReferral(
        createRequest({ referralStatus: 'INVALID_STATUS' }),
        { params: Promise.resolve({ caseId: 'case-1' }) }
      );
      expect(res.status).toBe(400);
    });

    it('returns 400 when updating non-referral case', async () => {
      mockSession('ADMIN');
      (prisma.case.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        serviceType: 'SPECIALIST_OPINION',
      });

      const res = await updateReferral(
        createRequest({ referralStatus: 'MATCHED' }),
        { params: Promise.resolve({ caseId: 'case-1' }) }
      );
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe('Not a referral case');
    });
  });

  describe('Authorization', () => {
    it('returns 401 when not authenticated', async () => {
      (getServerSession as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      const res = await getReferral({} as Request, { params: Promise.resolve({ caseId: 'case-1' }) });
      expect(res.status).toBe(401);
    });

    it('returns 401 for unauthenticated PATCH', async () => {
      (getServerSession as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      const res = await updateReferral(
        createRequest({ referralStatus: 'MATCHED' }),
        { params: Promise.resolve({ caseId: 'case-1' }) }
      );
      expect(res.status).toBe(401);
    });
  });
});
