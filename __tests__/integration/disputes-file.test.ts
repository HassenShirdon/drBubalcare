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

vi.mock('@/lib/disputes/service', () => ({
  fileDispute: vi.fn(),
}));

import { POST } from '@/app/api/cases/[id]/disputes/route';
import { getServerSession } from 'next-auth';
import { fileDispute } from '@/lib/disputes/service';

function mockSession(role: string, id: string) {
  return { user: { role, id } };
}

describe('File Dispute API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 without session', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);
    const req = { json: async () => ({ reason: 'Test dispute reason that is long enough' }) };
    const res = await POST(req as Request, { params: Promise.resolve({ id: 'case-1' }) });
    expect(res.status).toBe(401);
  });

  it('returns 403 for non-patient', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession('DOCTOR', 'doc-1'));
    const req = { json: async () => ({ reason: 'Test dispute reason that is long enough' }) };
    const res = await POST(req as Request, { params: Promise.resolve({ id: 'case-1' }) });
    expect(res.status).toBe(403);
  });

  it('returns 400 for invalid input', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'patient-1'));
    const req = { json: async () => ({ reason: 'Short' }) };
    const res = await POST(req as Request, { params: Promise.resolve({ id: 'case-1' }) });
    expect(res.status).toBe(400);
  });

  it('creates dispute for valid patient request', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'patient-1'));
    vi.mocked(fileDispute).mockResolvedValue({ id: 'dispute-1' } as any);
    const req = { json: async () => ({ reason: 'This is a detailed dispute reason that meets the minimum length requirement' }) };
    const res = await POST(req as Request, { params: Promise.resolve({ id: 'case-1' }) });
    expect(res.status).toBe(201);
    expect(fileDispute).toHaveBeenCalled();
  });
});
