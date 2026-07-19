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
    auditLog: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

import { GET } from '@/app/api/admin/audit-logs/route';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';

function mockSession(role: string, id: string) {
  return { user: { role, id } };
}

describe('Audit Logs API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 without session', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);
    const res = await GET(new Request('http://localhost?limit=10&offset=0'));
    expect(res.status).toBe(401);
  });

  it('returns 403 for non-admin users', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'patient-1'));
    const res = await GET(new Request('http://localhost?limit=10&offset=0'));
    expect(res.status).toBe(403);
  });

  it('returns paginated audit logs for admin', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession('ADMIN', 'admin-1'));
    vi.mocked(prisma.auditLog.findMany).mockResolvedValue([]);
    vi.mocked(prisma.auditLog.count).mockResolvedValue(0);

    const res = await GET(new Request('http://localhost?limit=10&offset=0'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('logs');
    expect(body).toHaveProperty('total');
  });

  it('filters by action', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession('ADMIN', 'admin-1'));
    vi.mocked(prisma.auditLog.findMany).mockResolvedValue([]);
    vi.mocked(prisma.auditLog.count).mockResolvedValue(0);

    const res = await GET(new Request('http://localhost?limit=10&offset=0&action=LOGIN'));
    expect(res.status).toBe(200);
    expect(prisma.auditLog.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ action: 'LOGIN' }),
      })
    );
  });
});
