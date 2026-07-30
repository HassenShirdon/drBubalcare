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
    labResult: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
    },
  },
}));

import { GET as listLabResults } from '@/app/api/lab-results/route';
import { GET as getLabResult } from '@/app/api/lab-results/[id]/route';
import { GET as pendingReview } from '@/app/api/lab-results/pending-review/route';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { mockSession, idParamsRequest } from '../helpers';

describe('Lab Results API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/lab-results', () => {
    it('returns 401 without auth', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const res = await listLabResults(new Request('http://localhost:3000/api/lab-results'));
      expect(res.status).toBe(401);
    });

    it('returns patient lab results with metrics ordered by date desc', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'patient-1'));
      const mockResults = [
        { id: 'lr-1', patientId: 'patient-1', name: 'Blood Test', date: new Date('2024-06-01'), metrics: [{ name: 'WBC', value: 5.5, unit: 'K/uL', referenceRange: '4.5-11.0' }] },
        { id: 'lr-2', patientId: 'patient-1', name: 'Lipid Panel', date: new Date('2024-05-01'), metrics: [] },
      ];
      vi.mocked(prisma.labResult.findMany).mockResolvedValue(mockResults as any);

      vi.mocked(prisma.labResult.count as any).mockResolvedValue(2);

      const res = await listLabResults(new Request('http://localhost:3000/api/lab-results'));
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.data).toHaveLength(2);
      expect(json.data[0].name).toBe('Blood Test');
      expect(json.data[1].name).toBe('Lipid Panel');
      expect(json.total).toBe(2);
      expect(json.take).toBe(50);
      expect(json.skip).toBe(0);
      expect(prisma.labResult.findMany).toHaveBeenCalledWith({
        where: { patientId: 'patient-1' },
        include: { metrics: true },
        orderBy: { date: 'desc' },
        take: 50,
        skip: 0,
      });
    });
  });

  describe('GET /api/lab-results/[id]', () => {
    it('returns 401 without auth', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const res = await getLabResult({} as Request, idParamsRequest('lr-1'));
      expect(res.status).toBe(401);
    });

    it('returns lab result with metrics and trends', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'patient-1'));
      const mockResult = { id: 'lr-1', patientId: 'patient-1', name: 'Blood Test', date: new Date(), metrics: [], trends: [] };
      vi.mocked(prisma.labResult.findUnique).mockResolvedValue(mockResult as any);

      const res = await getLabResult({} as Request, idParamsRequest('lr-1'));
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.id).toBe('lr-1');
    });

    it('returns 403 when accessing another patient lab result', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'patient-1'));
      vi.mocked(prisma.labResult.findUnique).mockResolvedValue({ id: 'lr-1', patientId: 'patient-2' } as any);

      const res = await getLabResult({} as Request, idParamsRequest('lr-1'));
      expect(res.status).toBe(403);
    });

    it('returns 404 when lab result not found', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'patient-1'));
      vi.mocked(prisma.labResult.findUnique).mockResolvedValue(null);

      const res = await getLabResult({} as Request, idParamsRequest('nonexistent'));
      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/lab-results/pending-review', () => {
    it('returns 401 without auth', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const res = await pendingReview();
      expect(res.status).toBe(401);
    });

    it('returns lab results needing review with patient info', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('DOCTOR', 'doctor-1'));
      const mockResults = [
        {
          id: 'lr-1',
          name: 'Blood Test',
          status: 'REVIEW_NEEDED',
          date: new Date('2024-06-01'),
          patient: { name: 'Alice', age: 32, gender: 'female' },
          metrics: [{ name: 'WBC', value: 15.5, unit: 'K/uL', referenceRange: '4.5-11.0', status: 'HIGH' }],
        },
      ];
      vi.mocked(prisma.labResult.findMany).mockResolvedValue(mockResults as any);

      const res = await pendingReview();
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toHaveLength(1);
      expect(data[0].patient.name).toBe('Alice');
      expect(data[0].metrics[0].status).toBe('HIGH');
    });

    it('returns empty array when no pending reviews', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('DOCTOR', 'doctor-1'));
      vi.mocked(prisma.labResult.findMany).mockResolvedValue([]);

      const res = await pendingReview();
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual([]);
    });

    it('returns 403 when patient accesses pending-review', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'patient-1'));

      const res = await pendingReview();

      expect(res.status).toBe(403);
      const body = await res.json();
      expect(body.error).toBe('Only specialists and admins can view pending reviews');
    });
  });
});
