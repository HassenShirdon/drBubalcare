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

import { POST as prescreenPost } from '@/app/api/ai/prescreen/[caseId]/route';
import { POST as routingPost } from '@/app/api/ai/route/[caseId]/route';
import { POST as summaryPost } from '@/app/api/ai/summary/[opinionId]/route';
import { generatePrescreen } from '@/lib/ai/prescreen';
import { matchSpecialist } from '@/lib/ai/routing';
import { generateSummary } from '@/lib/ai/summary';

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
});
