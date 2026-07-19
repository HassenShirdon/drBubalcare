import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/db', () => ({
  prisma: {
    dispute: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn(),
    },
    specialistOpinion: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
    doctor: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock('@/lib/audit/logger', () => ({
  logAuditEvent: vi.fn(),
  AUDIT_ACTIONS: { DISPUTE_FILED: 'DISPUTE_FILED', DISPUTE_RESOLVED: 'DISPUTE_RESOLVED', PEER_REVIEW_ASSIGNED: 'PEER_REVIEW_ASSIGNED' },
}));

vi.mock('@/lib/notifications/service', () => ({
  notifyAdmin: vi.fn(),
  NOTIFICATION_TYPES: { DISPUTE_FILED: 'DISPUTE_FILED' },
}));

import { fileDispute, getPeerReviewCandidates, triageDispute, assignPeerReview, resolveDispute } from '@/lib/disputes/service';
import { prisma } from '@/lib/db';
import { logAuditEvent } from '@/lib/audit/logger';
import { notifyAdmin } from '@/lib/notifications/service';

describe('Dispute Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fileDispute creates dispute and logs audit event', async () => {
    vi.mocked(prisma.dispute.create).mockResolvedValue({ id: 'dispute-1' } as any);
    vi.mocked(logAuditEvent).mockResolvedValue();
    vi.mocked(notifyAdmin).mockResolvedValue();

    const result = await fileDispute({
      caseId: 'case-1',
      patientId: 'patient-1',
      opinionId: 'opinion-1',
      reason: 'Diagnosis seems incorrect',
    });

    expect(result.id).toBe('dispute-1');
    expect(prisma.dispute.create).toHaveBeenCalled();
    expect(logAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'DISPUTE_FILED' })
    );
    expect(notifyAdmin).toHaveBeenCalled();
  });

  it('getPeerReviewCandidates excludes original specialist', async () => {
    vi.mocked(prisma.dispute.findUnique).mockResolvedValue({
      opinion: {
        specialistId: 'doc-1',
        case: { specialist: { doctorProfile: { specialty: 'Pathology' } } },
      },
    } as any);
    vi.mocked(prisma.doctor.findMany).mockResolvedValue([
      { userId: 'doc-2', specialty: 'Pathology', user: { name: 'Dr. B', email: 'b@test.com' } },
      { userId: 'doc-3', specialty: 'Pathology', user: { name: 'Dr. C', email: 'c@test.com' } },
    ] as any);

    const candidates = await getPeerReviewCandidates('dispute-1');
    expect(candidates).toHaveLength(2);
    expect(candidates.every((c) => c.userId !== 'doc-1')).toBe(true);
    expect(prisma.doctor.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: { not: 'doc-1' },
        }),
      })
    );
  });

  it('getPeerReviewCandidates returns empty when dispute not found', async () => {
    vi.mocked(prisma.dispute.findUnique).mockResolvedValue(null);

    const candidates = await getPeerReviewCandidates('dispute-999');
    expect(candidates).toHaveLength(0);
  });

  it('triageDispute sets UNDER_REVIEW when valid', async () => {
    vi.mocked(prisma.dispute.update).mockResolvedValue({ id: 'dispute-1', status: 'UNDER_REVIEW' } as any);

    await triageDispute('dispute-1', true, 'Looks valid');

    expect(prisma.dispute.update).toHaveBeenCalledWith({
      where: { id: 'dispute-1' },
      data: { status: 'UNDER_REVIEW', adminNotes: 'Looks valid' },
    });
  });

  it('triageDispute sets DISMISSED when not valid', async () => {
    vi.mocked(prisma.dispute.update).mockResolvedValue({ id: 'dispute-1', status: 'DISMISSED' } as any);

    await triageDispute('dispute-1', false);

    expect(prisma.dispute.update).toHaveBeenCalledWith({
      where: { id: 'dispute-1' },
      data: { status: 'DISMISSED', adminNotes: undefined },
    });
  });

  it('assignPeerReview creates draft opinion and updates dispute', async () => {
    vi.mocked(prisma.dispute.findUnique).mockResolvedValue({ caseId: 'case-1' } as any);
    vi.mocked(prisma.specialistOpinion.create).mockResolvedValue({ id: 'peer-opinion-1' } as any);
    vi.mocked(prisma.dispute.update).mockResolvedValue({} as any);
    vi.mocked(logAuditEvent).mockResolvedValue();

    const result = await assignPeerReview('dispute-1', 'doc-2');

    expect(result.id).toBe('peer-opinion-1');
    expect(prisma.specialistOpinion.create).toHaveBeenCalledWith({
      data: { caseId: 'case-1', specialistId: 'doc-2', content: '', status: 'DRAFT' },
    });
    expect(prisma.dispute.update).toHaveBeenCalledWith({
      where: { id: 'dispute-1' },
      data: { status: 'PEER_REVIEW_ASSIGNED', peerReviewOpinionId: 'peer-opinion-1' },
    });
    expect(logAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'PEER_REVIEW_ASSIGNED' })
    );
  });

  it('assignPeerReview throws when dispute not found', async () => {
    vi.mocked(prisma.dispute.findUnique).mockResolvedValue(null);

    await expect(assignPeerReview('dispute-999', 'doc-2')).rejects.toThrow('Dispute not found');
  });

  it('resolveDispute sets RESOLVED and logs audit', async () => {
    vi.mocked(prisma.dispute.update).mockResolvedValue({ id: 'dispute-1', status: 'RESOLVED' } as any);
    vi.mocked(logAuditEvent).mockResolvedValue();

    const result = await resolveDispute('dispute-1', 'Peer review confirmed original opinion');

    expect(result.status).toBe('RESOLVED');
    expect(prisma.dispute.update).toHaveBeenCalledWith({
      where: { id: 'dispute-1' },
      data: expect.objectContaining({
        status: 'RESOLVED',
        resolution: 'Peer review confirmed original opinion',
      }),
    });
    expect(logAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'DISPUTE_RESOLVED' })
    );
  });
});
