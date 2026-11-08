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

vi.mock('@/lib/db', () => {
  const db = {
    $transaction: vi.fn(),
    specialistOpinion: { findFirst: vi.fn(), create: vi.fn(), update: vi.fn(), count: vi.fn() },
    case: { findFirst: vi.fn(), update: vi.fn() },
    opinionSynthesis: { findUnique: vi.fn() },
    auditLog: { create: vi.fn() },
  };
  db.$transaction.mockImplementation((cb: (tx: typeof db) => unknown) => cb(db));
  return { prisma: db };
});

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn(),
}));

vi.mock('@/lib/audit/logger', () => ({
  logAuditEvent: vi.fn(),
  AUDIT_ACTIONS: {
    OPINION_DRAFT_CREATED: 'OPINION_DRAFT_CREATED',
    OPINION_SIGNED: 'OPINION_SIGNED',
  },
}));

vi.mock('@/lib/ai/summary', () => ({
  generateSummary: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/ai/synthesis', () => ({
  generateSynthesis: vi.fn().mockResolvedValue(undefined),
}));

import { GET, POST } from '@/app/api/doctor/cases/[id]/opinion/route';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limit';
import { generateSummary } from '@/lib/ai/summary';
import { generateSynthesis } from '@/lib/ai/synthesis';
import { mockSession, idParamsRequest, createRequestWithBody } from '../helpers';
import { AUDIT_ACTIONS } from '@/lib/audit/logger';

describe('Doctor Opinion API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(checkRateLimit).mockResolvedValue({ allowed: true, remaining: 19, resetAt: Date.now() + 60000 });
  });

  describe('GET', () => {
    it('returns 401 without auth', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);
      const res = await GET({} as Request, idParamsRequest('case-1'));
      expect(res.status).toBe(401);
    });

    it('returns 403 for non-doctor role', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'patient-1'));
      const res = await GET({} as Request, idParamsRequest('case-1'));
      expect(res.status).toBe(403);
    });

    it('returns opinion when it exists', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('DOCTOR', 'doc-1'));
      const mockOpinion = { id: 'op-1', caseId: 'case-1', content: 'Findings', specialistId: 'doc-1' };
      vi.mocked(prisma.specialistOpinion.findFirst).mockResolvedValue(mockOpinion as any);

      const res = await GET({} as Request, idParamsRequest('case-1'));
      const data = await res.json();
      expect(res.status).toBe(200);
      expect(data.id).toBe('op-1');
    });

    it('returns null when no opinion exists', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('DOCTOR', 'doc-1'));
      vi.mocked(prisma.specialistOpinion.findFirst).mockResolvedValue(null);

      const res = await GET({} as Request, idParamsRequest('case-1'));
      const data = await res.json();
      expect(res.status).toBe(200);
      expect(data).toBeNull();
    });
  });

  describe('POST', () => {
    const CASE_ID = 'case-1';
    const DOCTOR_ID = 'doc-1';
    const VALID_CONTENT = '## Clinical Findings\nMild abnormalities detected.\n\n## Impression\nLikely benign.\n\n## Recommended Next Steps\nSchedule follow-up in 3 months.';

    it('returns 401 without auth', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);
      const res = await POST(createRequestWithBody({ content: VALID_CONTENT, sign: false }), idParamsRequest(CASE_ID));
      expect(res.status).toBe(401);
    });

    it('returns 403 for non-doctor role', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'patient-1'));
      const res = await POST(createRequestWithBody({ content: VALID_CONTENT, sign: false }), idParamsRequest(CASE_ID));
      expect(res.status).toBe(403);
    });

    it('creates draft opinion successfully', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('DOCTOR', DOCTOR_ID));
      vi.mocked(prisma.case.findFirst).mockResolvedValue({ id: CASE_ID, specialistId: DOCTOR_ID } as any);
      vi.mocked(prisma.specialistOpinion.findFirst).mockResolvedValue(null);
      vi.mocked(prisma.specialistOpinion.create).mockResolvedValue({
        id: 'op-1', caseId: CASE_ID, specialistId: DOCTOR_ID,
        content: VALID_CONTENT, status: 'DRAFT', signedAt: null,
      } as any);

      const res = await POST(createRequestWithBody({ content: VALID_CONTENT, sign: false }), idParamsRequest(CASE_ID));
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.status).toBe('DRAFT');
      expect(prisma.specialistOpinion.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          caseId: CASE_ID, specialistId: DOCTOR_ID,
          content: VALID_CONTENT, status: 'DRAFT', signedAt: null,
        }),
      });
      expect(AUDIT_ACTIONS.OPINION_DRAFT_CREATED);
    });

    it('signs opinion and transitions case status', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('DOCTOR', DOCTOR_ID));
      vi.mocked(prisma.case.findFirst).mockResolvedValue({ id: CASE_ID, specialistId: DOCTOR_ID } as any);
      vi.mocked(prisma.specialistOpinion.findFirst).mockResolvedValue(null);
      vi.mocked(prisma.specialistOpinion.create).mockResolvedValue({
        id: 'op-1', caseId: CASE_ID, specialistId: DOCTOR_ID,
        content: VALID_CONTENT, status: 'SIGNED', signedAt: new Date(),
      } as any);
      vi.mocked(prisma.opinionSynthesis.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.specialistOpinion.count).mockResolvedValue(1);

      const res = await POST(createRequestWithBody({ content: VALID_CONTENT, sign: true }), idParamsRequest(CASE_ID));
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.status).toBe('SIGNED');
      expect(prisma.case.update).toHaveBeenCalledWith({
        where: { id: CASE_ID },
        data: { status: 'OPINION_READY' },
      });
    });

    it('rejects signing with empty sections', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('DOCTOR', DOCTOR_ID));
      vi.mocked(prisma.case.findFirst).mockResolvedValue({ id: CASE_ID, specialistId: DOCTOR_ID } as any);

      const badContent = '## Clinical Findings\n\n\n\n## Impression\n\n\n\n## Recommended Next Steps\n\n';
      const res = await POST(createRequestWithBody({ content: badContent, sign: true }), idParamsRequest(CASE_ID));
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain('must have content');
    });

    it('rejects signing with missing sections', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('DOCTOR', DOCTOR_ID));
      vi.mocked(prisma.case.findFirst).mockResolvedValue({ id: CASE_ID, specialistId: DOCTOR_ID } as any);

      const incompleteContent = '## Clinical Findings\nSomething';
      const res = await POST(createRequestWithBody({ content: incompleteContent, sign: true }), idParamsRequest(CASE_ID));
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain('Missing section');
    });

    it('rejects editing already signed opinion', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('DOCTOR', DOCTOR_ID));
      vi.mocked(prisma.case.findFirst).mockResolvedValue({ id: CASE_ID, specialistId: DOCTOR_ID } as any);
      vi.mocked(prisma.specialistOpinion.findFirst).mockResolvedValue({
        id: 'op-1', caseId: CASE_ID, specialistId: DOCTOR_ID, status: 'SIGNED',
      } as any);

      const res = await POST(createRequestWithBody({ content: VALID_CONTENT, sign: false }), idParamsRequest(CASE_ID));
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain('already signed');
    });

    it('rejects when rate limited', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('DOCTOR', DOCTOR_ID));
      vi.mocked(checkRateLimit).mockResolvedValue({ allowed: false, remaining: 0, resetAt: Date.now() + 60000 });

      const res = await POST(createRequestWithBody({ content: VALID_CONTENT, sign: false }), idParamsRequest(CASE_ID));
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain('Too many requests');
    });

    it('rejects content exceeding max length', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('DOCTOR', DOCTOR_ID));
      const longContent = 'x'.repeat(100_001);

      const res = await POST(createRequestWithBody({ content: longContent, sign: false }), idParamsRequest(CASE_ID));
      expect(res.status).toBe(400);
    });

    it('rejects when case not assigned to doctor', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('DOCTOR', DOCTOR_ID));
      vi.mocked(prisma.case.findFirst).mockResolvedValue(null);

      const res = await POST(createRequestWithBody({ content: VALID_CONTENT, sign: false }), idParamsRequest(CASE_ID));
      expect(res.status).toBe(404);
    });

    it('triggers summary generation on sign', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('DOCTOR', DOCTOR_ID));
      vi.mocked(prisma.case.findFirst).mockResolvedValue({ id: CASE_ID, specialistId: DOCTOR_ID } as any);
      vi.mocked(prisma.specialistOpinion.findFirst).mockResolvedValue(null);
      vi.mocked(prisma.specialistOpinion.create).mockResolvedValue({
        id: 'op-1', caseId: CASE_ID, specialistId: DOCTOR_ID,
        content: VALID_CONTENT, status: 'SIGNED', signedAt: new Date(),
      } as any);
      vi.mocked(prisma.specialistOpinion.count).mockResolvedValue(1);

      await POST(createRequestWithBody({ content: VALID_CONTENT, sign: true }), idParamsRequest(CASE_ID));

      expect(generateSummary).toHaveBeenCalledWith('op-1');
    });
  });
});
