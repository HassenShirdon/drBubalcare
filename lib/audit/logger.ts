import { prisma } from '@/lib/db';
import type { LogAuditEventParams } from './types';

export const AUDIT_ACTIONS = {
  // Auth
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  REGISTER: 'REGISTER',
  PASSWORD_CHANGE: 'PASSWORD_CHANGE',
  PASSWORD_RESET: 'PASSWORD_RESET',

  // Cases
  CASE_CREATE: 'CASE_CREATE',
  CASE_STATUS_CHANGE: 'CASE_STATUS_CHANGE',
  CASE_ASSIGN_SPECIALIST: 'CASE_ASSIGN_SPECIALIST',
  DISPUTE_FILED: 'DISPUTE_FILED',
  DISPUTE_RESOLVED: 'DISPUTE_RESOLVED',

  // Opinions
  OPINION_DRAFT_CREATED: 'OPINION_DRAFT_CREATED',
  OPINION_SIGNED: 'OPINION_SIGNED',
  OPINION_DELIVERED: 'OPINION_DELIVERED',

  // AI Operations
  AI_PRESCREEN_GENERATED: 'AI_PRESCREEN_GENERATED',
  AI_SYNTHESIS_GENERATED: 'AI_SYNTHESIS_GENERATED',
  AI_SUMMARY_GENERATED: 'AI_SUMMARY_GENERATED',

  // File Access
  RECORD_UPLOADED: 'RECORD_UPLOADED',
  RECORD_ACCESSED: 'RECORD_ACCESSED',
  RECORD_DELETED: 'RECORD_DELETED',

  // Admin
  SPECIALIST_VERIFIED: 'SPECIALIST_VERIFIED',
  CASE_OVERRIDE: 'CASE_OVERRIDE',
  PEER_REVIEW_ASSIGNED: 'PEER_REVIEW_ASSIGNED',

  // Data
  DATA_EXPORT_REQUESTED: 'DATA_EXPORT_REQUESTED',
  DATA_DELETION_REQUESTED: 'DATA_DELETION_REQUESTED',
  CONSENT_GIVEN: 'CONSENT_GIVEN',
  CONSENT_REVOKED: 'CONSENT_REVOKED',
} as const;

export async function logAuditEvent(params: LogAuditEventParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        resourceType: params.resourceType,
        resourceId: params.resourceId,
        ...(params.before !== undefined && { before: params.before }),
        ...(params.after !== undefined && { after: params.after }),
        ...(params.metadata !== undefined && { metadata: params.metadata }),
      },
    });
  } catch (error) {
    console.error('[AuditLogger] Failed to create audit log entry:', error);
  }
}
