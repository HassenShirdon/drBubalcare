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
      count: vi.fn(),
    },
    doctor: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

function mockRequest(url = 'http://localhost') {
  const parsedUrl = new URL(url);
  const searchParams = new URLSearchParams(parsedUrl.search);
  return {
    nextUrl: {
      searchParams: {
        get: (key: string) => searchParams.get(key),
      },
    },
  } as any;
}

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

      const res = await getAdminCases(mockRequest());
      expect(res.status).toBe(401);
    });

    it('returns 403 for non-admin role', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('DOCTOR', 'doctor-1'));

      const res = await getAdminCases(mockRequest());
      expect(res.status).toBe(403);
    });

    it('returns paginated cases with patient, specialist, and referral info', async () => {
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
      vi.mocked(prisma.case.count).mockResolvedValue(2);

      const res = await getAdminCases(mockRequest());
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.data).toHaveLength(2);
      expect(body.total).toBe(2);
      expect(body.data[0].patient.name).toBe('Alice');
      expect(body.data[0].referralCoordination.referralStatus).toBe('SEARCHING');
      expect(prisma.case.findMany).toHaveBeenCalledWith({
        take: 50,
        skip: 0,
        include: {
          patient: { select: { name: true, email: true } },
          specialist: { select: { name: true, email: true } },
          referralCoordination: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('respects take/skip query params', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('ADMIN', 'admin-1'));
      vi.mocked(prisma.case.findMany).mockResolvedValue([]);
      vi.mocked(prisma.case.count).mockResolvedValue(10);

      const res = await getAdminCases(mockRequest('http://localhost?take=10&skip=5'));
      await res.json();

      expect(prisma.case.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 10, skip: 5 })
      );
    });

    it('returns empty data when no cases exist', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('ADMIN', 'admin-1'));
      vi.mocked(prisma.case.findMany).mockResolvedValue([]);
      vi.mocked(prisma.case.count).mockResolvedValue(0);

      const res = await getAdminCases(mockRequest());
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.data).toEqual([]);
      expect(body.total).toBe(0);
    });
  });

  describe('GET /api/admin/specialists', () => {
    it('returns 401 without auth', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const res = await getAdminSpecialists(mockRequest());
      expect(res.status).toBe(401);
    });

    it('returns 403 for non-admin role', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('DOCTOR', 'doctor-1'));

      const res = await getAdminSpecialists(mockRequest());
      expect(res.status).toBe(403);
    });

    it('returns paginated specialists list with user info', async () => {
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
      vi.mocked(prisma.doctor.count).mockResolvedValue(2);

      const res = await getAdminSpecialists(mockRequest());
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.data).toHaveLength(2);
      expect(body.total).toBe(2);
      expect(body.data[0].user.name).toBe('Dr. A');
      expect(body.data[1].user.name).toBe('Dr. B');
      expect(prisma.doctor.findMany).toHaveBeenCalledWith({
        take: 50,
        skip: 0,
        include: {
          user: { select: { id: true, name: true, email: true, createdAt: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    });
  });
});
