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
      findMany: vi.fn(),
      findFirst: vi.fn(),
    },
  },
}));

import { GET as listCases } from '@/app/api/doctor/cases/route';
import { GET as getCase } from '@/app/api/doctor/cases/[id]/route';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { mockSession, idParamsRequest } from '../helpers';

describe('Doctor Cases API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/doctor/cases', () => {
    it('returns 401 without auth', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const res = await listCases();
      expect(res.status).toBe(401);
    });

    it('returns 403 for non-doctor role', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'patient-1'));

      const res = await listCases();
      expect(res.status).toBe(403);
    });

    it('returns doctor assigned cases with patient and opinion info', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('DOCTOR', 'doc-1'));
      const mockCases = [
        {
          id: 'case-1',
          specialistId: 'doc-1',
          status: 'UNDER_REVIEW',
          createdAt: new Date('2024-06-01'),
          patient: { name: 'Alice', age: 32, gender: 'female' },
          opinions: [{ id: 'op-1', status: 'DRAFT', signedAt: null }],
        },
        {
          id: 'case-2',
          specialistId: 'doc-1',
          status: 'OPEN',
          createdAt: new Date('2024-05-01'),
          patient: { name: 'Bob', age: 45, gender: 'male' },
          opinions: [],
        },
      ];
      vi.mocked(prisma.case.findMany).mockResolvedValue(mockCases as any);

      const res = await listCases();
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toHaveLength(2);
      expect(data[0].patient.name).toBe('Alice');
      expect(data[1].patient.name).toBe('Bob');
      expect(prisma.case.findMany).toHaveBeenCalledWith({
        where: { specialistId: 'doc-1' },
        include: {
          patient: { select: { name: true, age: true, gender: true } },
          opinions: {
            where: { specialistId: 'doc-1' },
            select: { id: true, status: true, signedAt: true },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('GET /api/doctor/cases/[id]', () => {
    it('returns 401 without auth', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const res = await getCase({} as Request, idParamsRequest('case-1'));
      expect(res.status).toBe(401);
    });

    it('returns 403 for non-doctor role', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'patient-1'));

      const res = await getCase({} as Request, idParamsRequest('case-1'));
      expect(res.status).toBe(403);
    });

    it('returns specific case with full details for doctor', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('DOCTOR', 'doc-1'));
      const mockCase = {
        id: 'case-1',
        specialistId: 'doc-1',
        status: 'UNDER_REVIEW',
        patient: { name: 'Alice', age: 32, gender: 'female' },
        records: [{ id: 'rec-1', fileName: 'scan.pdf' }],
        aiPrescreens: [{ id: 'ps-1', findings: 'Key finding' }],
        opinions: [{ id: 'op-1', status: 'DRAFT', specialist: { name: 'Dr. A' } }],
      };
      vi.mocked(prisma.case.findFirst).mockResolvedValue(mockCase as any);

      const res = await getCase({} as Request, idParamsRequest('case-1'));
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.id).toBe('case-1');
      expect(data.records).toHaveLength(1);
      expect(data.aiPrescreens).toHaveLength(1);
    });

    it('returns 404 when case not assigned to doctor', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('DOCTOR', 'doc-1'));
      vi.mocked(prisma.case.findFirst).mockResolvedValue(null);

      const res = await getCase({} as Request, idParamsRequest('not-my-case'));
      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.error).toBe('Case not found');
    });
  });
});
