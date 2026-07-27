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

vi.mock('@/lib/ai/prescreen', () => ({
  generatePrescreen: vi.fn(),
}));

vi.mock('@/lib/ai/routing', () => ({
  matchSpecialist: vi.fn(),
}));

vi.mock('@/lib/ai/summary', () => ({
  generateSummary: vi.fn(),
}));

vi.mock('@/lib/ai/synthesis', () => ({
  generateSynthesis: vi.fn(),
}));

vi.mock('@/lib/ai/followup', () => ({
  answerFollowUp: vi.fn(),
}));

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
  authOptions: {},
}));

vi.mock('@/lib/db', () => ({
  prisma: {
    trendAnalysis: {
      findMany: vi.fn(),
    },
    specialistOpinion: {
      findUnique: vi.fn(),
    },
  },
}));

import { POST as prescreenPost } from '@/app/api/ai/prescreen/[caseId]/route';
import { POST as routingPost } from '@/app/api/ai/route/[caseId]/route';
import { POST as summaryPost } from '@/app/api/ai/summary/[opinionId]/route';
import { POST as synthesisPost } from '@/app/api/ai/synthesis/[caseId]/route';
import { POST as followupPost } from '@/app/api/ai/followup/route';
import { GET as trendsGet } from '@/app/api/ai/trends/[patientId]/route';
import { generatePrescreen } from '@/lib/ai/prescreen';
import { matchSpecialist } from '@/lib/ai/routing';
import { generateSummary } from '@/lib/ai/summary';
import { generateSynthesis } from '@/lib/ai/synthesis';
import { answerFollowUp } from '@/lib/ai/followup';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';

function createRequestWithSecret(secret?: string): Request {
  const headers = new Headers();
  if (secret !== undefined) {
    headers.set('x-internal-secret', secret);
  }
  return new Request('http://localhost', { method: 'POST', headers }) as unknown as Request;
}

function prescreenParams(caseId: string) {
  return { params: Promise.resolve({ caseId }) };
}

function routingParams(caseId: string) {
  return { params: Promise.resolve({ caseId }) };
}

function summaryParams(opinionId: string) {
  return { params: Promise.resolve({ opinionId }) };
}

function synthesisParams(caseId: string) {
  return { params: Promise.resolve({ caseId }) };
}

function trendsParams(patientId: string) {
  return { params: Promise.resolve({ patientId }) };
}

function createRequestWithBody(body: unknown): Request {
  return { json: async () => body } as unknown as Request;
}

function mockSession(role: string, id: string) {
  return { user: { role, id } };
}

describe('AI Routes - Auth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.INTERNAL_API_SECRET = 'test-secret';
  });

  describe('Pre-screening route', () => {
    it('returns 401 without x-internal-secret header', async () => {
      const res = await prescreenPost(createRequestWithSecret(undefined), prescreenParams('case-1'));
      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.error).toBe('Unauthorized');
    });

    it('returns 401 with wrong x-internal-secret', async () => {
      const res = await prescreenPost(createRequestWithSecret('wrong-secret'), prescreenParams('case-1'));
      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.error).toBe('Unauthorized');
    });

    it('returns 500 when generatePrescreen throws', async () => {
      vi.mocked(generatePrescreen).mockRejectedValue(new Error('DB connection failed'));
      const res = await prescreenPost(createRequestWithSecret('test-secret'), prescreenParams('nonexistent-case'));
      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body.error).toBe('Pre-screening failed');
    });
  });

  describe('Routing route', () => {
    it('returns 401 without x-internal-secret header', async () => {
      const res = await routingPost(createRequestWithSecret(undefined), routingParams('case-1'));
      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.error).toBe('Unauthorized');
    });

    it('returns 401 with wrong x-internal-secret', async () => {
      const res = await routingPost(createRequestWithSecret('wrong-secret'), routingParams('case-1'));
      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.error).toBe('Unauthorized');
    });

    it('returns 500 when matchSpecialist throws', async () => {
      vi.mocked(matchSpecialist).mockRejectedValue(new Error('No specialists available'));
      const res = await routingPost(createRequestWithSecret('test-secret'), routingParams('nonexistent-case'));
      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body.error).toBe('Routing failed');
    });
  });

  describe('Summary route', () => {
    it('returns 401 without x-internal-secret header', async () => {
      const res = await summaryPost(createRequestWithSecret(undefined), summaryParams('opinion-1'));
      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.error).toBe('Unauthorized');
    });

    it('returns 401 with wrong x-internal-secret', async () => {
      const res = await summaryPost(createRequestWithSecret('wrong-secret'), summaryParams('opinion-1'));
      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.error).toBe('Unauthorized');
    });

    it('returns 500 when generateSummary throws', async () => {
      vi.mocked(generateSummary).mockRejectedValue(new Error('Opinion not found'));
      const res = await summaryPost(createRequestWithSecret('test-secret'), summaryParams('nonexistent-opinion'));
      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body.error).toBe('Summary generation failed');
    });
  });

  describe('Synthesis route', () => {
    it('returns 401 without x-internal-secret header', async () => {
      const res = await synthesisPost(createRequestWithSecret(undefined), synthesisParams('case-1'));
      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.error).toBe('Unauthorized');
    });

    it('returns 401 with wrong x-internal-secret', async () => {
      const res = await synthesisPost(createRequestWithSecret('wrong-secret'), synthesisParams('case-1'));
      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.error).toBe('Unauthorized');
    });

    it('returns 500 when generateSynthesis throws', async () => {
      vi.mocked(generateSynthesis).mockRejectedValue(new Error('Case not found'));
      const res = await synthesisPost(createRequestWithSecret('test-secret'), synthesisParams('nonexistent-case'));
      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body.error).toBe('Synthesis generation failed');
    });
  });

  describe('Follow-up route', () => {
    it('returns 401 without session', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);
      const res = await followupPost(createRequestWithBody({ opinionId: 'op-1', question: 'What does this mean?' }));
      expect(res.status).toBe(401);
    });

    it('returns 400 without required fields', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'patient-1'));
      const res = await followupPost(createRequestWithBody({}));
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error).toBe('opinionId and question are required');
    });

    it('returns 500 when answerFollowUp throws', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'patient-1'));
      vi.mocked(prisma.specialistOpinion.findUnique).mockResolvedValue({
        id: 'opinion-1',
        case: { patientId: 'patient-1' },
      });
      vi.mocked(answerFollowUp).mockRejectedValue(new Error('Opinion not found'));
      const res = await followupPost(createRequestWithBody({ opinionId: 'opinion-1', question: 'What does this mean?' }));
      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body.error).toBe('Follow-up Q&A failed');
    });
  });

  describe('Trends route', () => {
    it('returns 401 without session', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);
      const res = await trendsGet(createRequestWithBody({}) as unknown as Request, trendsParams('patient-1'));
      expect(res.status).toBe(401);
    });

    it('returns 403 when accessing other patient trends', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'patient-1'));
      const res = await trendsGet(createRequestWithBody({}) as unknown as Request, trendsParams('patient-2'));
      expect(res.status).toBe(403);
      const body = await res.json();
      expect(body.error).toBe('Forbidden');
    });

    it('returns 200 with trends for own data', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'patient-1'));
      vi.mocked(prisma.trendAnalysis.findMany).mockResolvedValue([]);
      const res = await trendsGet(createRequestWithBody({}) as unknown as Request, trendsParams('patient-1'));
      expect(res.status).toBe(200);
    });
  });
});
