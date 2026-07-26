import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/db', () => ({
  prisma: {
    auditLog: {
      create: vi.fn(),
    },
  },
}));

import { logAuditEvent, AUDIT_ACTIONS } from '@/lib/audit/logger';
import { prisma } from '@/lib/db';

describe('Audit Logger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates an audit log entry with required fields', async () => {
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as any);

    await logAuditEvent({
      userId: 'user-1',
      action: AUDIT_ACTIONS.CASE_CREATE,
      resourceType: 'Case',
      resourceId: 'case-1',
    });

    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: {
        userId: 'user-1',
        action: 'CASE_CREATE',
        resourceType: 'Case',
        resourceId: 'case-1',
      },
    });
  });

  it('includes before/after state when provided', async () => {
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as any);

    await logAuditEvent({
      userId: 'user-1',
      action: AUDIT_ACTIONS.CASE_STATUS_CHANGE,
      resourceType: 'Case',
      resourceId: 'case-1',
      before: { status: 'OPEN' },
      after: { status: 'UNDER_REVIEW' },
    });

    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        before: { status: 'OPEN' },
        after: { status: 'UNDER_REVIEW' },
      }),
    });
  });

  it('includes metadata when provided', async () => {
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as any);

    await logAuditEvent({
      userId: 'user-1',
      action: AUDIT_ACTIONS.LOGIN,
      resourceType: 'User',
      resourceId: 'user-1',
      metadata: { ip: '192.168.1.1', userAgent: 'Mozilla/5.0' },
    });

    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        metadata: { ip: '192.168.1.1', userAgent: 'Mozilla/5.0' },
      }),
    });
  });

  it('logs error but does not throw when prisma fails', async () => {
    vi.mocked(prisma.auditLog.create).mockRejectedValue(new Error('DB error'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(
      logAuditEvent({
        userId: 'user-1',
        action: AUDIT_ACTIONS.LOGIN,
        resourceType: 'User',
        resourceId: 'user-1',
      })
    ).resolves.not.toThrow();

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
