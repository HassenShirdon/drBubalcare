import { prisma } from '@/lib/db';
import { logAuditEvent, AUDIT_ACTIONS } from '@/lib/audit/logger';
import { notifyAdmin, NOTIFICATION_TYPES } from '@/lib/notifications/service';
import type { FileDisputeParams, PeerReviewCandidate } from './types';

export async function fileDispute(params: FileDisputeParams) {
  const dispute = await prisma.dispute.create({
    data: {
      caseId: params.caseId,
      patientId: params.patientId,
      opinionId: params.opinionId,
      reason: params.reason,
      status: 'PENDING',
    },
  });

  await logAuditEvent({
    userId: params.patientId,
    action: AUDIT_ACTIONS.DISPUTE_FILED,
    resourceType: 'Dispute',
    resourceId: dispute.id,
    metadata: { caseId: params.caseId, opinionId: params.opinionId },
  });

  await notifyAdmin({
    type: NOTIFICATION_TYPES.DISPUTE_FILED,
    message: `Patient filed a dispute for case ${params.caseId}`,
    metadata: { disputeId: dispute.id, caseId: params.caseId },
  });

  return dispute;
}

export async function getPeerReviewCandidates(disputeId: string): Promise<PeerReviewCandidate[]> {
  const dispute = await prisma.dispute.findUnique({
    where: { id: disputeId },
    include: {
      opinion: {
        include: {
          case: {
            include: { specialist: { include: { doctorProfile: true } } },
          },
        },
      },
    },
  });

  if (!dispute) return [];

  const originalSpecialistId = dispute.opinion.specialistId;
  const specialty = dispute.opinion.case.specialist?.doctorProfile?.specialty;

  if (!specialty) return [];

  const candidates = await prisma.doctor.findMany({
    where: {
      specialty,
      verified: true,
      userId: { not: originalSpecialistId },
    },
    include: { user: { select: { name: true, email: true } } },
    take: 3,
  });

  return candidates.map((c) => ({
    userId: c.userId,
    name: c.user.name,
    email: c.user.email,
    specialty: c.specialty,
  }));
}

export async function triageDispute(
  disputeId: string,
  valid: boolean,
  adminNotes?: string
) {
  const dispute = await prisma.dispute.findUnique({ where: { id: disputeId } });
  if (!dispute) throw new Error('Dispute not found');
  if (dispute.status !== 'OPEN') {
    throw new Error(`Dispute must be OPEN to triage, current status: ${dispute.status}`);
  }

  const status = valid ? 'UNDER_REVIEW' : 'DISMISSED';
  return prisma.dispute.update({
    where: { id: disputeId },
    data: { status, adminNotes },
  });
}

export async function assignPeerReview(disputeId: string, specialistId: string) {
  const dispute = await prisma.dispute.findUnique({
    where: { id: disputeId },
    select: { caseId: true },
  });

  if (!dispute) throw new Error('Dispute not found');

  const opinion = await prisma.specialistOpinion.create({
    data: {
      caseId: dispute.caseId,
      specialistId,
      content: '',
      status: 'DRAFT',
    },
  });

  await prisma.dispute.update({
    where: { id: disputeId },
    data: {
      status: 'PEER_REVIEW_ASSIGNED',
      peerReviewOpinionId: opinion.id,
    },
  });

  await logAuditEvent({
    userId: specialistId,
    action: AUDIT_ACTIONS.PEER_REVIEW_ASSIGNED,
    resourceType: 'Dispute',
    resourceId: disputeId,
    metadata: { peerReviewOpinionId: opinion.id },
  });

  return opinion;
}

export async function resolveDispute(
  disputeId: string,
  resolution: string,
  adminNotes?: string
) {
  const existing = await prisma.dispute.findUnique({ where: { id: disputeId } });
  if (!existing) throw new Error('Dispute not found');
  if (existing.status !== 'PEER_REVIEW_ASSIGNED' && existing.status !== 'UNDER_REVIEW') {
    throw new Error(`Dispute must be PEER_REVIEW_ASSIGNED or UNDER_REVIEW to resolve, current status: ${existing.status}`);
  }

  const dispute = await prisma.dispute.update({
    where: { id: disputeId },
    data: {
      status: 'RESOLVED',
      resolution,
      adminNotes,
      resolvedAt: new Date(),
    },
  });

  await logAuditEvent({
    userId: 'system-admin',
    action: AUDIT_ACTIONS.DISPUTE_RESOLVED,
    resourceType: 'Dispute',
    resourceId: disputeId,
    metadata: { resolution },
  });

  return dispute;
}
