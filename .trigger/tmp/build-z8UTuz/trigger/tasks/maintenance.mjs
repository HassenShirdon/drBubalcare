import {
  prisma
} from "../../chunk-M366MOAD.mjs";
import {
  schedules_exports
} from "../../chunk-UTPLH5KB.mjs";
import "../../chunk-N2VJDWOE.mjs";
import "../../chunk-UT4CBAZP.mjs";
import {
  __name,
  init_esm
} from "../../chunk-JUPALWCH.mjs";

// trigger/tasks/maintenance.ts
init_esm();

// lib/edge-cases/service.ts
init_esm();

// lib/notifications/service.ts
init_esm();
var NOTIFICATION_TYPES = {
  URGENT_FINDING: "URGENT_FINDING",
  DISPUTE_FILED: "DISPUTE_FILED",
  DATA_EXPORT_REQUESTED: "DATA_EXPORT_REQUESTED",
  DATA_DELETION_REQUESTED: "DATA_DELETION_REQUESTED",
  NO_SPECIALIST_MATCHED: "NO_SPECIALIST_MATCHED",
  INCOMPLETE_UPLOAD: "INCOMPLETE_UPLOAD",
  PAYMENT_FAILED: "PAYMENT_FAILED"
};
var ADMIN_USER_ID = "system-admin";
async function notifyAdmin(params) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: ADMIN_USER_ID,
        action: "ADMIN_ALERT",
        resourceType: "Notification",
        resourceId: `ADMIN_${params.type}`,
        metadata: {
          type: params.type,
          message: params.message,
          ...params.metadata
        }
      }
    });
  } catch (error) {
    console.error("[NotificationService] Failed to create admin alert:", error);
  }
}
__name(notifyAdmin, "notifyAdmin");
async function notifyPatient(params) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.patientId,
        action: "PATIENT_NOTIFICATION",
        resourceType: "Notification",
        resourceId: `PATIENT_${params.type}`,
        metadata: {
          type: params.type,
          message: params.message,
          ...params.metadata
        }
      }
    });
  } catch (error) {
    console.error("[NotificationService] Failed to create patient notification:", error);
  }
}
__name(notifyPatient, "notifyPatient");

// lib/edge-cases/service.ts
var FOUR_HOURS_MS = 4 * 60 * 60 * 1e3;
async function checkUnmatchedCases() {
  const cutoff = new Date(Date.now() - FOUR_HOURS_MS);
  const unmatchedCases = await prisma.case.findMany({
    where: {
      status: "OPEN",
      specialistId: null,
      createdAt: { lt: cutoff }
    },
    select: { id: true, patientId: true, createdAt: true }
  });
  for (const c of unmatchedCases) {
    await notifyAdmin({
      type: NOTIFICATION_TYPES.NO_SPECIALIST_MATCHED,
      message: `Case ${c.id} has been open for over 4 hours without a specialist`,
      metadata: { caseId: c.id, patientId: c.patientId }
    });
    await notifyPatient({
      patientId: c.patientId,
      type: NOTIFICATION_TYPES.NO_SPECIALIST_MATCHED,
      message: "We are working to assign a specialist to your case. You will be notified once assigned.",
      metadata: { caseId: c.id }
    });
  }
}
__name(checkUnmatchedCases, "checkUnmatchedCases");

// lib/gdpr/service.ts
init_esm();

// lib/audit/logger.ts
init_esm();
var AUDIT_ACTIONS = {
  // Auth
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  REGISTER: "REGISTER",
  PASSWORD_CHANGE: "PASSWORD_CHANGE",
  PASSWORD_RESET: "PASSWORD_RESET",
  // Cases
  CASE_CREATE: "CASE_CREATE",
  CASE_STATUS_CHANGE: "CASE_STATUS_CHANGE",
  CASE_ASSIGN_SPECIALIST: "CASE_ASSIGN_SPECIALIST",
  DISPUTE_FILED: "DISPUTE_FILED",
  DISPUTE_RESOLVED: "DISPUTE_RESOLVED",
  // Opinions
  OPINION_DRAFT_CREATED: "OPINION_DRAFT_CREATED",
  OPINION_SIGNED: "OPINION_SIGNED",
  OPINION_DELIVERED: "OPINION_DELIVERED",
  // AI Operations
  AI_PRESCREEN_GENERATED: "AI_PRESCREEN_GENERATED",
  AI_SYNTHESIS_GENERATED: "AI_SYNTHESIS_GENERATED",
  AI_SUMMARY_GENERATED: "AI_SUMMARY_GENERATED",
  // File Access
  RECORD_UPLOADED: "RECORD_UPLOADED",
  RECORD_ACCESSED: "RECORD_ACCESSED",
  RECORD_DELETED: "RECORD_DELETED",
  // Admin
  SPECIALIST_VERIFIED: "SPECIALIST_VERIFIED",
  CASE_OVERRIDE: "CASE_OVERRIDE",
  PEER_REVIEW_ASSIGNED: "PEER_REVIEW_ASSIGNED",
  // Data
  DATA_EXPORT_REQUESTED: "DATA_EXPORT_REQUESTED",
  DATA_DELETION_REQUESTED: "DATA_DELETION_REQUESTED",
  DATA_DELETION_EXECUTED: "DATA_DELETION_EXECUTED",
  CONSENT_GIVEN: "CONSENT_GIVEN",
  CONSENT_REVOKED: "CONSENT_REVOKED"
};
async function logAuditEvent(params) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        resourceType: params.resourceType,
        resourceId: params.resourceId,
        ...params.before !== void 0 && { before: params.before },
        ...params.after !== void 0 && { after: params.after },
        ...params.metadata !== void 0 && { metadata: params.metadata }
      }
    });
  } catch (error) {
    console.error("[AuditLogger] Failed to create audit log entry:", error);
  }
}
__name(logAuditEvent, "logAuditEvent");

// lib/gdpr/service.ts
var ANON_ID = "[DELETED]";
async function executePendingDeletions() {
  const now = /* @__PURE__ */ new Date();
  const requests = await prisma.dataDeletionRequest.findMany({
    where: {
      status: "CONFIRMED",
      executeAt: { lte: now },
      completedAt: null
    }
  });
  for (const req of requests) {
    try {
      await prisma.user.update({
        where: { id: req.patientId },
        data: {
          name: ANON_ID,
          email: `deleted-${req.patientId}@anonymous`,
          emailVerified: null,
          image: null,
          passwordHash: null
        }
      });
      await prisma.consentRecord.deleteMany({ where: { patientId: req.patientId } });
      await prisma.appointment.deleteMany({ where: { patientId: req.patientId } });
      await prisma.labResult.deleteMany({ where: { patientId: req.patientId } });
      await prisma.trendAnalysis.deleteMany({ where: { patientId: req.patientId } });
      await prisma.followUpQuestion.deleteMany({
        where: { opinion: { case: { patientId: req.patientId } } }
      });
      const doctor = await prisma.doctor.findUnique({ where: { userId: req.patientId } });
      if (doctor) {
        await prisma.doctorService.deleteMany({ where: { doctorId: doctor.id } });
        await prisma.appointment.deleteMany({ where: { doctorId: doctor.id } });
        await prisma.doctor.delete({ where: { userId: req.patientId } });
      }
      await prisma.dataDeletionRequest.update({
        where: { id: req.id },
        data: { status: "COMPLETED", completedAt: now }
      });
      await logAuditEvent({
        userId: req.patientId,
        action: AUDIT_ACTIONS.DATA_DELETION_EXECUTED,
        resourceType: "DataDeletionRequest",
        resourceId: req.id,
        metadata: { status: "COMPLETED", executedAt: now.toISOString() }
      });
    } catch (error) {
      console.error(`[GDPR] Failed to execute deletion ${req.id}:`, error);
    }
  }
  return requests.length;
}
__name(executePendingDeletions, "executePendingDeletions");

// trigger/tasks/maintenance.ts
var checkNoSpecialistTask = schedules_exports.task({
  id: "check-no-specialist",
  cron: "*/15 * * * *",
  run: /* @__PURE__ */ __name(async () => {
    await checkUnmatchedCases();
    return { checked: true };
  }, "run")
});
var executeDeletionTask = schedules_exports.task({
  id: "execute-deletion",
  cron: "0 3 * * *",
  run: /* @__PURE__ */ __name(async () => {
    const count = await executePendingDeletions();
    return { executedDeletions: count };
  }, "run")
});
export {
  checkNoSpecialistTask,
  executeDeletionTask
};
//# sourceMappingURL=maintenance.mjs.map
