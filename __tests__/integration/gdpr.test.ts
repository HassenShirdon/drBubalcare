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

vi.mock('@/lib/gdpr/service', () => ({
  getConsent: vi.fn(),
  updateConsent: vi.fn(),
  requestDeletion: vi.fn(),
  confirmDeletion: vi.fn(),
  cancelDeletion: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
  prisma: {
    dataDeletionRequest: { findMany: vi.fn() },
    user: { findUnique: vi.fn() },
  },
}));

vi.mock('@/lib/audit/logger', () => ({
  logAuditEvent: vi.fn(),
  AUDIT_ACTIONS: {
    DATA_EXPORT_REQUESTED: 'DATA_EXPORT_REQUESTED',
  },
}));

import { GET as consentGet, POST as consentPost } from '@/app/api/patient/consent/route';
import { POST as dataExportPost } from '@/app/api/patient/data-export/route';
import { POST as deletionPost } from '@/app/api/patient/data-deletion/route';
import { POST as confirmPost } from '@/app/api/patient/data-deletion/confirm/route';
import { POST as cancelPost } from '@/app/api/patient/data-deletion/cancel/route';
import { GET as dataRequestsGet } from '@/app/api/admin/data-requests/route';
import { getServerSession } from 'next-auth';
import {
  getConsent,
  updateConsent,
  requestDeletion,
  confirmDeletion,
  cancelDeletion,
} from '@/lib/gdpr/service';
import { prisma } from '@/lib/db';
import { logAuditEvent } from '@/lib/audit/logger';

function mockSession(role: string, id: string) {
  return { user: { role, id } };
}

describe('GDPR API Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Consent', () => {
    it('GET returns 401 without session', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);
      const res = await consentGet();
      expect(res.status).toBe(401);
    });

    it('GET returns 403 for non-patient', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('DOCTOR', 'd-1'));
      const res = await consentGet();
      expect(res.status).toBe(403);
    });

    it('GET returns consent for patient', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'p-1'));
      vi.mocked(getConsent).mockResolvedValue([]);
      const res = await consentGet();
      expect(res.status).toBe(200);
      expect(getConsent).toHaveBeenCalledWith('p-1');
    });

    it('POST returns 401 without session', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);
      const req = { json: async () => ({ consentType: 'AI_PROCESSING', granted: true }) };
      const res = await consentPost(req as Request);
      expect(res.status).toBe(401);
    });

    it('POST returns 400 for invalid body', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'p-1'));
      const req = { json: async () => ({ consentType: 'INVALID' }) };
      const res = await consentPost(req as Request);
      expect(res.status).toBe(400);
    });

    it('POST updates consent', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'p-1'));
      vi.mocked(updateConsent).mockResolvedValue();
      const req = { json: async () => ({ consentType: 'AI_PROCESSING', granted: true }) };
      const res = await consentPost(req as Request);
      expect(res.status).toBe(200);
      expect(updateConsent).toHaveBeenCalledWith('p-1', 'AI_PROCESSING', true);
    });
  });

  describe('Deletion', () => {
    it('POST returns 401 without session', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);
      const res = await deletionPost({ json: async () => ({}) } as Request);
      expect(res.status).toBe(401);
    });

    it('POST requests deletion', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'p-1'));
      vi.mocked(requestDeletion).mockResolvedValue({ id: 'del-1' } as any);
      const res = await deletionPost({ json: async () => ({}) } as Request);
      expect(res.status).toBe(200);
      expect(requestDeletion).toHaveBeenCalledWith('p-1');
    });

    it('POST returns 400 when deletion request fails', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'p-1'));
      vi.mocked(requestDeletion).mockRejectedValue(new Error('Deletion request already pending'));
      const res = await deletionPost({ json: async () => ({}) } as Request);
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error).toBe('Deletion request already pending');
    });

    it('confirm returns 401 without session', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);
      const res = await confirmPost({ json: async () => ({}) } as Request);
      expect(res.status).toBe(401);
    });

    it('confirm returns 200 on success', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'p-1'));
      vi.mocked(confirmDeletion).mockResolvedValue({} as any);
      const res = await confirmPost({ json: async () => ({}) } as Request);
      expect(res.status).toBe(200);
      expect(confirmDeletion).toHaveBeenCalledWith('p-1');
    });

    it('confirm returns 400 on error', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'p-1'));
      vi.mocked(confirmDeletion).mockRejectedValue(new Error('No pending deletion request'));
      const res = await confirmPost({ json: async () => ({}) } as Request);
      expect(res.status).toBe(400);
    });

    it('cancel returns 401 without session', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);
      const res = await cancelPost({ json: async () => ({}) } as Request);
      expect(res.status).toBe(401);
    });

    it('cancel returns 200 on success', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'p-1'));
      vi.mocked(cancelDeletion).mockResolvedValue({} as any);
      const res = await cancelPost({ json: async () => ({}) } as Request);
      expect(res.status).toBe(200);
      expect(cancelDeletion).toHaveBeenCalledWith('p-1');
    });

    it('cancel returns 400 on error', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'p-1'));
      vi.mocked(cancelDeletion).mockRejectedValue(new Error('No pending deletion request'));
      const res = await cancelPost({ json: async () => ({}) } as Request);
      expect(res.status).toBe(400);
    });
  });

  describe('Data Export', () => {
    it('POST returns 401 without session', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);
      const res = await dataExportPost();
      expect(res.status).toBe(401);
    });

    it('POST returns patient data with audit log', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'p-1'));
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        name: 'Test Patient',
        email: 'test@example.com',
        createdAt: new Date(),
        cases: [],
        labResults: [],
        consentRecords: [],
      } as any);
      vi.mocked(logAuditEvent).mockResolvedValue();

      const res = await dataExportPost();
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.format).toBe('json');
      expect(body.data).toHaveProperty('name');
      expect(body.data).toHaveProperty('email');
      expect(logAuditEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'p-1',
          action: 'DATA_EXPORT_REQUESTED',
          resourceType: 'User',
          resourceId: 'p-1',
        })
      );
    });

    it('POST returns 404 when patient not found', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'p-1'));
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const res = await dataExportPost();
      expect(res.status).toBe(404);
    });
  });

  describe('Admin Data Requests', () => {
    it('GET returns 401 without session', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);
      const res = await dataRequestsGet();
      expect(res.status).toBe(401);
    });

    it('GET returns 403 for non-admin', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'p-1'));
      const res = await dataRequestsGet();
      expect(res.status).toBe(403);
    });

    it('GET returns deletion requests for admin', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('ADMIN', 'admin-1'));
      vi.mocked(prisma.dataDeletionRequest.findMany).mockResolvedValue([]);
      const res = await dataRequestsGet();
      expect(res.status).toBe(200);
    });
  });
});
