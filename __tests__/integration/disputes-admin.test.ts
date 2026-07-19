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
    dispute: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

vi.mock('@/lib/disputes/service', () => ({
  triageDispute: vi.fn(),
  getPeerReviewCandidates: vi.fn(),
  assignPeerReview: vi.fn(),
  resolveDispute: vi.fn(),
}));

import { GET as listGet } from '@/app/api/admin/disputes/route';
import { GET as detailGet } from '@/app/api/admin/disputes/[id]/route';
import { POST as triagePost } from '@/app/api/admin/disputes/[id]/triage/route';
import { GET as candidatesGet } from '@/app/api/admin/disputes/[id]/peer-review-candidates/route';
import { POST as assignPost } from '@/app/api/admin/disputes/[id]/assign-peer-review/route';
import { POST as resolvePost } from '@/app/api/admin/disputes/[id]/resolve/route';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { triageDispute, getPeerReviewCandidates, assignPeerReview, resolveDispute } from '@/lib/disputes/service';

function mockSession(role: string, id: string) {
  return { user: { role, id } };
}

describe('Admin Dispute Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('List disputes (GET /api/admin/disputes)', () => {
    it('returns 401 without session', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);
      const res = await listGet(new Request('http://localhost'));
      expect(res.status).toBe(401);
    });

    it('returns 403 for non-admin', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'p-1'));
      const res = await listGet(new Request('http://localhost'));
      expect(res.status).toBe(403);
    });

    it('returns disputes for admin', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('ADMIN', 'admin-1'));
      vi.mocked(prisma.dispute.findMany).mockResolvedValue([]);
      const res = await listGet(new Request('http://localhost'));
      expect(res.status).toBe(200);
    });

    it('filters by status', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('ADMIN', 'admin-1'));
      vi.mocked(prisma.dispute.findMany).mockResolvedValue([]);
      const res = await listGet(new Request('http://localhost?status=PENDING'));
      expect(res.status).toBe(200);
      expect(prisma.dispute.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'PENDING' }),
        })
      );
    });
  });

  describe('Dispute detail (GET /api/admin/disputes/[id])', () => {
    it('returns 401 without session', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);
      const res = await detailGet(
        new Request('http://localhost'),
        { params: Promise.resolve({ id: 'd-1' }) }
      );
      expect(res.status).toBe(401);
    });

    it('returns 403 for non-admin', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'p-1'));
      const res = await detailGet(
        new Request('http://localhost'),
        { params: Promise.resolve({ id: 'd-1' }) }
      );
      expect(res.status).toBe(403);
    });

    it('returns dispute detail for admin', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('ADMIN', 'admin-1'));
      vi.mocked(prisma.dispute.findUnique).mockResolvedValue({ id: 'd-1', status: 'PENDING' } as any);
      const res = await detailGet(
        new Request('http://localhost'),
        { params: Promise.resolve({ id: 'd-1' }) }
      );
      expect(res.status).toBe(200);
    });

    it('returns 404 for missing dispute', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('ADMIN', 'admin-1'));
      vi.mocked(prisma.dispute.findUnique).mockResolvedValue(null);
      const res = await detailGet(
        new Request('http://localhost'),
        { params: Promise.resolve({ id: 'd-missing' }) }
      );
      expect(res.status).toBe(404);
    });
  });

  describe('Triage (POST /api/admin/disputes/[id]/triage)', () => {
    it('returns 403 for non-admin', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'p-1'));
      const req = { json: async () => ({ valid: true }) };
      const res = await triagePost(req as Request, { params: Promise.resolve({ id: 'd-1' }) });
      expect(res.status).toBe(403);
    });

    it('calls service for admin', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('ADMIN', 'admin-1'));
      vi.mocked(triageDispute).mockResolvedValue({} as any);
      const req = { json: async () => ({ valid: true, adminNotes: 'Looks valid' }) };
      const res = await triagePost(req as Request, { params: Promise.resolve({ id: 'd-1' }) });
      expect(res.status).toBe(200);
      expect(triageDispute).toHaveBeenCalledWith('d-1', true, 'Looks valid');
    });

    it('returns 400 for invalid input', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('ADMIN', 'admin-1'));
      const req = { json: async () => ({}) };
      const res = await triagePost(req as Request, { params: Promise.resolve({ id: 'd-1' }) });
      expect(res.status).toBe(400);
    });
  });

  describe('Peer review candidates (GET /api/admin/disputes/[id]/peer-review-candidates)', () => {
    it('returns 403 for non-admin', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'p-1'));
      const res = await candidatesGet(
        new Request('http://localhost'),
        { params: Promise.resolve({ id: 'd-1' }) }
      );
      expect(res.status).toBe(403);
    });

    it('returns candidates for admin', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('ADMIN', 'admin-1'));
      vi.mocked(getPeerReviewCandidates).mockResolvedValue([]);
      const res = await candidatesGet(
        new Request('http://localhost'),
        { params: Promise.resolve({ id: 'd-1' }) }
      );
      expect(res.status).toBe(200);
      expect(getPeerReviewCandidates).toHaveBeenCalledWith('d-1');
    });
  });

  describe('Assign peer review (POST /api/admin/disputes/[id]/assign-peer-review)', () => {
    it('returns 403 for non-admin', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'p-1'));
      const req = { json: async () => ({ specialistId: 'doc-2' }) };
      const res = await assignPost(req as Request, { params: Promise.resolve({ id: 'd-1' }) });
      expect(res.status).toBe(403);
    });

    it('calls service for admin', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('ADMIN', 'admin-1'));
      vi.mocked(assignPeerReview).mockResolvedValue({ id: 'opinion-1' } as any);
      const req = { json: async () => ({ specialistId: 'doc-2' }) };
      const res = await assignPost(req as Request, { params: Promise.resolve({ id: 'd-1' }) });
      expect(res.status).toBe(200);
      expect(assignPeerReview).toHaveBeenCalledWith('d-1', 'doc-2');
    });

    it('returns 400 for invalid input', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('ADMIN', 'admin-1'));
      const req = { json: async () => ({}) };
      const res = await assignPost(req as Request, { params: Promise.resolve({ id: 'd-1' }) });
      expect(res.status).toBe(400);
    });
  });

  describe('Resolve (POST /api/admin/disputes/[id]/resolve)', () => {
    it('returns 403 for non-admin', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'p-1'));
      const req = { json: async () => ({ resolution: 'Peer review confirmed original opinion' }) };
      const res = await resolvePost(req as Request, { params: Promise.resolve({ id: 'd-1' }) });
      expect(res.status).toBe(403);
    });

    it('calls service for admin', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('ADMIN', 'admin-1'));
      vi.mocked(resolveDispute).mockResolvedValue({} as any);
      const req = { json: async () => ({ resolution: 'Peer review confirmed original opinion' }) };
      const res = await resolvePost(req as Request, { params: Promise.resolve({ id: 'd-1' }) });
      expect(res.status).toBe(200);
      expect(resolveDispute).toHaveBeenCalled();
    });

    it('returns 400 for short resolution', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('ADMIN', 'admin-1'));
      const req = { json: async () => ({ resolution: 'Short' }) };
      const res = await resolvePost(req as Request, { params: Promise.resolve({ id: 'd-1' }) });
      expect(res.status).toBe(400);
    });
  });
});
