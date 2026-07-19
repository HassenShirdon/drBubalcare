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

vi.mock('@/lib/edge-cases/service', () => ({
  checkUnmatchedCases: vi.fn(),
  flagIncompleteUpload: vi.fn(),
}));

vi.mock('@/lib/notifications/service', () => ({
  notifyAdmin: vi.fn(),
  notifyPatient: vi.fn(),
  NOTIFICATION_TYPES: { URGENT_FINDING: 'URGENT_FINDING' },
}));

vi.mock('@/lib/db', () => ({
  prisma: {
    case: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
  authOptions: {},
}));

import { POST as cronPost } from '@/app/api/cron/check-no-specialist/route';
import { POST as flagPost } from '@/app/api/cases/[id]/flag-incomplete/route';
import { checkUnmatchedCases, flagIncompleteUpload } from '@/lib/edge-cases/service';
import { getServerSession } from 'next-auth';

function mockSession(role: string, id: string) {
  return { user: { role, id } };
}

describe('Edge Case Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Cron: check-no-specialist', () => {
    it('calls checkUnmatchedCases', async () => {
      process.env.CRON_SECRET = 'test-secret';
      vi.mocked(checkUnmatchedCases).mockResolvedValue();
      const res = await cronPost(
        new Request('http://localhost', {
          method: 'POST',
          headers: { Authorization: 'Bearer test-secret' },
        })
      );
      expect(res.status).toBe(200);
      expect(checkUnmatchedCases).toHaveBeenCalled();
      delete process.env.CRON_SECRET;
    });

    it('returns 401 without valid auth header', async () => {
      process.env.CRON_SECRET = 'test-secret';
      const res = await cronPost(new Request('http://localhost', { method: 'POST' }));
      expect(res.status).toBe(401);
      delete process.env.CRON_SECRET;
    });
  });

  describe('Flag incomplete upload', () => {
    it('returns 401 without session', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);
      const res = await flagPost(
        { json: async () => ({ instructions: 'Upload missing files' }) } as Request,
        { params: Promise.resolve({ id: 'case-1' }) }
      );
      expect(res.status).toBe(401);
    });

    it('returns 403 for non-doctor', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'patient-1'));
      const res = await flagPost(
        { json: async () => ({ instructions: 'Upload missing files' }) } as Request,
        { params: Promise.resolve({ id: 'case-1' }) }
      );
      expect(res.status).toBe(403);
    });

    it('calls flagIncompleteUpload for doctor', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('DOCTOR', 'doc-1'));
      vi.mocked(flagIncompleteUpload).mockResolvedValue();
      const res = await flagPost(
        { json: async () => ({ instructions: 'Upload missing files' }) } as Request,
        { params: Promise.resolve({ id: 'case-1' }) }
      );
      expect(res.status).toBe(200);
      expect(flagIncompleteUpload).toHaveBeenCalledWith('case-1', 'doc-1', 'Upload missing files');
    });
  });
});
