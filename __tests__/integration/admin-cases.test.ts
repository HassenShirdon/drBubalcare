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
    },
    doctor: {
      findMany: vi.fn(),
    },
  },
}));

import { GET as getAdminCases } from '@/app/api/admin/cases/route';
import { GET as getAdminSpecialists } from '@/app/api/admin/specialists/route';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { mockSession } from '../helpers';

describe('Admin API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/admin/cases', () => {
    it('returns 401 without auth', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const res = await getAdminCases();
      expect(res.status).toBe(401);
    });

    it('returns 403 for non-admin role', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('DOCTOR', 'doctor-1'));

      const res = await getAdminCases();
      expect(res.status).toBe(403);
    });

    it('returns all cases with patient, specialist, and referral info', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('ADMIN', 'admin-1'));
      const mockCases = [
        {
          id: 'case-1',
          status: 'OPEN',
          createdAt: new Date('2024-06-01'),
          patient: { name: 'Alice', email: 'alice@test.com' },
          specialist: { name: 'Dr. A', email: 'dr.a@test.com' },
          referralCoordination: { referralStatus: 'SEARCHING' },
        },
        {
          id: 'case-2',
          status: 'CLOSED',
          createdAt: new Date('2024-05-01'),
          patient: { name: 'Bob', email: 'bob@test.com' },
          specialist: null,
          referralCoordination: null,
        },
      ];
      vi.mocked(prisma.case.findMany).mockResolvedValue(mockCases as any);

      const res = await getAdminCases();
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toHaveLength(2);
      expect(data[0].patient.name).toBe('Alice');
      expect(data[0].referralCoordination.referralStatus).toBe('SEARCHING');
      expect(prisma.case.findMany).toHaveBeenCalledWith({
        include: {
          patient: { select: { name: true, email: true } },
          specialist: { select: { name: true, email: true } },
          referralCoordination: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('returns empty array when no cases exist', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('ADMIN', 'admin-1'));
      vi.mocked(prisma.case.findMany).mockResolvedValue([]);

      const res = await getAdminCases();
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual([]);
    });
  });

  describe('GET /api/admin/specialists', () => {
    it('returns 401 without auth', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const res = await getAdminSpecialists();
      expect(res.status).toBe(401);
    });

    it('returns 403 for non-admin role', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('DOCTOR', 'doctor-1'));

      const res = await getAdminSpecialists();
      expect(res.status).toBe(403);
    });

    it('returns specialists list with user info', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('ADMIN', 'admin-1'));
      const mockDoctors = [
        {
          id: 'doc-1',
          specialty: 'Cardiology',
          experience: 10,
          rating: 4.5,
          createdAt: new Date('2024-01-01'),
          user: { id: 'u-1', name: 'Dr. A', email: 'dr.a@test.com', createdAt: new Date('2024-01-01') },
        },
        {
          id: 'doc-2',
          specialty: 'Neurology',
          experience: 8,
          rating: 4.2,
          createdAt: new Date('2024-02-01'),
          user: { id: 'u-2', name: 'Dr. B', email: 'dr.b@test.com', createdAt: new Date('2024-02-01') },
        },
      ];
      vi.mocked(prisma.doctor.findMany).mockResolvedValue(mockDoctors as any);

      const res = await getAdminSpecialists();
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toHaveLength(2);
      expect(data[0].user.name).toBe('Dr. A');
      expect(data[1].user.name).toBe('Dr. B');
      expect(prisma.doctor.findMany).toHaveBeenCalledWith({
        include: {
          user: { select: { id: true, name: true, email: true, createdAt: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    });
  });
});
