# Audit Logging

Audit logging implementation, schema, query patterns, and best practices for HIPAA/GDPR compliance.

## Overview

Every read/write to patient data is logged in an immutable `AuditLog` record — capturing who, what, when, and which resource. Audit logs are retained for 7 years to meet regulatory requirements.

**Core Principle:** If it touches PHI, it gets logged.

---

## Audit Log Schema

```prisma
model AuditLog {
  id           String   @id @default(cuid())
  userId       String   // Who performed the action
  action       String   // What action was taken
  resourceType String   // Which type of resource was affected
  resourceId   String   // ID of the affected resource
  before       Json?    // State before change (for updates)
  after        Json?    // State after change
  metadata     Json?    // Additional context (IP, user agent, etc.)
  timestamp    DateTime @default(now())

  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Field Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | String | Yes | Unique identifier (CUID) |
| `userId` | String | Yes | ID of user who performed the action |
| `action` | String | Yes | Action type (e.g., `CREATE`, `READ`, `UPDATE`, `DELETE`) |
| `resourceType` | String | Yes | Model name (e.g., `Case`, `SpecialistOpinion`) |
| `resourceId` | String | Yes | ID of the affected resource |
| `before` | Json | No | Resource state before change (for modifications) |
| `after` | Json | No | Resource state after change |
| `metadata` | Json | No | Contextual data (IP address, user agent, etc.) |
| `timestamp` | DateTime | Yes | Auto-set to `now()` on creation |

---

## Logged Actions by Category

### Authentication Events

| Action | When Logged | Metadata Captured |
|--------|-------------|-------------------|
| `USER_REGISTERED` | New account created | `role`, `email` (hashed) |
| `USER_LOGGED_IN` | Successful login | `ip`, `userAgent`, `method` |
| `LOGIN_FAILED` | Failed login attempt | `ip`, `userAgent`, `reason` |
| `USER_LOGGED_OUT` | Session ended | `sessionDuration` |
| `PASSWORD_CHANGED` | Password updated | — |
| `SESSION_EXPIRED` | Session timeout | `lastActivity` |

### Case Lifecycle Events

| Action | When Logged | Before/After Captured |
|--------|-------------|----------------------|
| `CASE_CREATED` | Patient creates case | — / `{ serviceType, status: OPEN }` |
| `CASE_ROUTED` | System assigns specialist | `{ specialistId: null }` / `{ specialistId, routingAlgorithm }` |
| `CASE_STATUS_CHANGED` | Case status updated | `{ status: oldStatus }` / `{ status: newStatus }` |
| `CASE_ACCESSED` | User views case | — / `{ viewedBy, timestamp }` |

### Specialist Opinion Events

| Action | When Logged | Before/After Captured |
|--------|-------------|----------------------|
| `OPINION_DRAFTED` | Specialist starts opinion | — / `{ status: DRAFT }` |
| `OPINION_SIGNED` | Specialist signs opinion | `{ status: DRAFT }` / `{ status: SIGNED, signedAt }` |
| `OPINION_DELIVERED` | Opinion sent to patient | `{ status: SIGNED }` / `{ status: DELIVERED, deliveredAt }` |

### File Access Events

| Action | When Logged | Metadata Captured |
|--------|-------------|-------------------|
| `FILE_UPLOADED` | Patient uploads case record | `fileType`, `fileSize`, `fileName` |
| `FILE_ACCESSED` | User views/downloads file | `accessType` (view/download), `signedUrlExpiry` |
| `FILE_DELETED` | File removed | `fileName`, `fileType` |

### AI Feature Events

| Action | When Logged | Metadata Captured |
|--------|-------------|-------------------|
| `AI_PRESCREEN_GENERATED` | Pre-screening complete | `model`, `tokenCount`, `findingsLength` |
| `AI_SUMMARY_GENERATED` | Plain-language summary created | `model`, `tokenCount`, `opinionId` |
| `AI_SYNTHESIS_GENERATED` | Multi-opinion synthesis complete | `model`, `opinionCount` |
| `AI_FOLLOW_UP_ANSWERED` | Follow-up question answered | `model`, `scopeNote`, `withinScope` |
| `AI_TREND_ANALYZED` | Trend analysis complete | `metricName`, `significantChange` |
| `PHI_STRIPPED` | PHI removed before LLM call | `fieldsRemoved`, `promptHash` |
| `PHI_LEAK_DETECTED` | PHI found in AI output | `leakedFields`, `outputHash` — **Critical alert** |

### Data Subject Rights Events

| Action | When Logged | Metadata Captured |
|--------|-------------|-------------------|
| `DATA_EXPORT_REQUESTED` | Patient requests data export | `formats` |
| `DATA_EXPORTED` | Export file generated | `recordCount`, `fileSize` |
| `DELETION_REQUESTED` | Patient requests data deletion | `executeAt` |
| `DELETION_CONFIRMED` | Patient confirms deletion | — |
| `DELETION_COMPLETED` | Data permanently deleted | `recordsDeleted`, `duration` |
| `CONSENT_GRANTED` | Patient grants consent | `consentType` |
| `CONSENT_REVOKED` | Patient revokes consent | `consentType` |

### Admin Events

| Action | When Logged | Before/After Captured |
|--------|-------------|----------------------|
| `ADMIN_OVERRIDE` | Admin changes case status | `{ status: oldStatus }` / `{ status: newStatus, reason }` |
| `SPECIALIST_VERIFIED` | Specialist credentials approved | `{ verified: false }` / `{ verified: true }` |
| `SPECIALIST_REJECTED` | Specialist credentials rejected | `{ verified: false }` / `{ verified: false, reason }` |
| `DISPUTE_RESOLVED` | Dispute resolved by admin | `{ status: PENDING/UNDER_REVIEW }` / `{ status: RESOLVED, resolution }` |
| `PEER_REVIEW_ASSIGNED` | Peer review assigned | `{ peerReviewOpinionId: null }` / `{ peerReviewOpinionId }` |

---

## Logging Implementation

### Core Logging Function

```typescript
import { prisma } from '@/lib/prisma';

interface AuditLogEntry {
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

async function logAudit(entry: AuditLogEntry): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: entry.userId,
        action: entry.action,
        resourceType: entry.resourceType,
        resourceId: entry.resourceId,
        before: entry.before ?? undefined,
        after: entry.after ?? undefined,
        metadata: {
          ...entry.metadata,
          ip: entry.metadata?.ip ?? null,
          userAgent: entry.metadata?.userAgent ?? null,
        },
      },
    });
  } catch (error) {
    // Audit logging failure is a critical error
    console.error('AUDIT_LOG_FAILURE', { entry, error });
    // In production: alert immediately, queue for retry
  }
}
```

### Middleware Integration

```typescript
// API route middleware for automatic audit logging
function withAuditLogging(
  handler: (req: NextRequest, context: AuditContext) => Promise<Response>
) {
  return async (req: NextRequest) => {
    const session = await getServerSession();
    const context: AuditContext = {
      userId: session?.user?.id ?? 'anonymous',
      ip: req.headers.get('x-forwarded-for') ?? 'unknown',
      userAgent: req.headers.get('user-agent') ?? 'unknown',
    };

    const response = await handler(req, context);
    return response;
  };
}
```

### PHI Access Logging

```typescript
// Log every access to resources containing PHI
async function logPHIAccess(
  userId: string,
  resourceType: string,
  resourceId: string,
  accessType: 'READ' | 'WRITE',
  metadata: Record<string, unknown>
) {
  await logAudit({
    userId,
    action: `${resourceType}_${accessType}`,
    resourceType,
    resourceId,
    metadata: {
      ...metadata,
      phiAccess: true,
      accessType,
    },
  });
}
```

### State Change Logging

```typescript
// Log state transitions with before/after snapshots
async function logStateChange(
  userId: string,
  resourceType: string,
  resourceId: string,
  before: Record<string, unknown>,
  after: Record<string, unknown>,
  action: string
) {
  await logAudit({
    userId,
    action,
    resourceType,
    resourceId,
    before,
    after,
  });
}
```

---

## Retention Policy

| Data Type | Retention | Justification | Storage |
|-----------|-----------|---------------|---------|
| All audit logs | 7 years | HIPAA (45 CFR §164.530(j)), GDPR compliance | PostgreSQL |
| AI prompts/outputs (no PHI) | 7 years | Audit trail for AI decisions | AuditLog metadata |
| Consent records | 7 years | Proof of GDPR consent | `ConsentRecord` model |
| Data deletion requests | 7 years | Proof of GDPR compliance | `DataDeletionRequest` model |
| Breach notifications | 7 years | HIPAA breach documentation | Separate breach register |

### Archival Strategy

```sql
-- Archive logs older than 1 year to cold storage
-- (Run annually as part of compliance maintenance)

-- 1. Export logs older than 1 year
COPY (
  SELECT * FROM audit_logs
  WHERE timestamp < NOW() - INTERVAL '1 year'
) TO '/archive/audit_logs_YYYY.csv';

-- 2. After verifying archive integrity, delete from production
DELETE FROM audit_logs
WHERE timestamp < NOW() - INTERVAL '1 year';

-- NOTE: Never delete without archival. 7-year retention is mandatory.
```

---

## Access Control

### Who Can Read Audit Logs

| Role | Access Level | Conditions |
|------|-------------|------------|
| **Admin** | Full read access | Admin role verified |
| **Patient** | Own access events only | Session authenticated |
| **Specialist** | No access | — |

### Who Can Write Audit Logs

| Role | Access Level | Conditions |
|------|-------------|------------|
| **System** | Automatic logging | API middleware, application code |
| **Admin** | No direct writes | Audit logs are append-only |
| **Patient** | No direct writes | — |
| **Specialist** | No direct writes | — |

### Immutability

Audit logs are **append-only** — no user or system role can update or delete individual log entries.

```sql
-- PostgreSQL: Prevent updates and deletes on audit_logs
CREATE POLICY "audit_logs_immutable" ON audit_logs
  FOR UPDATE USING (false);

CREATE POLICY "audit_logs_no_delete" ON audit_logs
  FOR DELETE USING (false);
```

---

## Alert Rules

### Critical Alerts (Immediate)

| Alert | Trigger | Response |
|-------|---------|----------|
| **PHI leak detected** | AI output contains patient identifiers | Block output, alert admin, pause AI features |
| **Unauthorized PHI access** | User accesses data not assigned to them | Block access, alert admin, review logs |
| **Bulk data download** | > 5 file downloads in 5 minutes from single user | Alert admin, review user activity |
| **Failed authentication spike** | > 10 failed logins from single IP in 1 hour | Rate limit IP, alert admin |
| **Audit log write failure** | `logAudit()` throws error | Critical alert, queue for retry |

### Warning Alerts (Same-Day)

| Alert | Trigger | Response |
|-------|---------|----------|
| **Unusual access pattern** | Specialist accesses cases outside normal hours | Flag for review |
| **Consent revoked** | Patient revokes AI processing consent | Pause AI features for patient |
| **Data deletion requested** | Patient requests account deletion | Queue for admin review |

### Implementation

```typescript
// Alert evaluation (runs on each audit log write)
async function evaluateAlerts(entry: AuditLogEntry): Promise<void> {
  if (entry.action === 'PHI_LEAK_DETECTED') {
    await sendCriticalAlert({
      type: 'PHI_BREACH',
      details: entry.metadata,
      severity: 'CRITICAL',
    });
    await pauseAIFeaturesForCase(entry.resourceId);
  }

  if (entry.action === 'FILE_ACCESSED') {
    const recentDownloads = await prisma.auditLog.count({
      where: {
        userId: entry.userId,
        action: 'FILE_ACCESSED',
        timestamp: { gte: subMinutes(new Date(), 5) },
      },
    });

    if (recentDownloads > 5) {
      await sendWarningAlert({
        type: 'BULK_DOWNLOAD',
        userId: entry.userId,
        downloadCount: recentDownloads,
      });
    }
  }
}
```

---

## Querying Audit Logs

### Common Queries

**Get all actions for a specific case:**

```sql
SELECT * FROM audit_logs
WHERE resource_type = 'Case' AND resource_id = 'case-id-here'
ORDER BY timestamp DESC;
```

**Get all PHI access for a patient (via their cases):**

```sql
SELECT al.*
FROM audit_logs al
JOIN cases c ON al.resource_id = c.id
WHERE c.patient_id = 'patient-id-here'
  AND al.metadata->>'phiAccess' = 'true'
ORDER BY al.timestamp DESC;
```

**Get all actions by a specific user:**

```sql
SELECT * FROM audit_logs
WHERE user_id = 'user-id-here'
ORDER BY timestamp DESC
LIMIT 100;
```

**Get failed login attempts:**

```sql
SELECT * FROM audit_logs
WHERE action = 'LOGIN_FAILED'
  AND timestamp > NOW() - INTERVAL '24 hours'
ORDER BY timestamp DESC;
```

**Get all data deletion requests and their status:**

```sql
SELECT
  ddr.id,
  ddr.status,
  ddr.requested_at,
  ddr.completed_at,
  u.email,
  al.timestamp as last_audit_event
FROM data_deletion_requests ddr
JOIN users u ON ddr.patient_id = u.id
LEFT JOIN audit_logs al ON al.resource_id = ddr.id
  AND al.resource_type = 'DataDeletionRequest'
ORDER BY ddr.requested_at DESC;
```

### Admin Dashboard Queries

**Compliance summary (last 30 days):**

```sql
SELECT
  action,
  COUNT(*) as count,
  MIN(timestamp) as first_occurrence,
  MAX(timestamp) as last_occurrence
FROM audit_logs
WHERE timestamp > NOW() - INTERVAL '30 days'
GROUP BY action
ORDER BY count DESC;
```

**AI feature usage:**

```sql
SELECT
  action,
  COUNT(*) as count,
  AVG((metadata->>'tokenCount')::int) as avg_tokens
FROM audit_logs
WHERE action LIKE 'AI_%'
  AND timestamp > NOW() - INTERVAL '30 days'
GROUP BY action;
```

---

## Best Practices

### Logging Do's

| Practice | Reason |
|----------|--------|
| Log every PHI access | HIPAA requirement |
| Include IP and user agent | Forensic investigation capability |
| Use structured metadata | Enables powerful querying |
| Log before/after for changes | Supports audit trail reconstruction |
| Set timestamps server-side | Prevents client-side manipulation |
| Use CUIDs for log IDs | Unique, sortable, no sequential exposure |
| Alert on log failures | Logging failure is a critical security event |

### Logging Don'ts

| Anti-Pattern | Risk |
|-------------|------|
| Log PHI in action metadata | Exposes sensitive data in audit logs |
| Log passwords or tokens | Security vulnerability |
| Allow log deletion | Destroys compliance evidence |
| Use client-provided timestamps | Timestamps can be manipulated |
| Log at DEBUG level in production | Performance impact, potential PHI exposure |
| Skip logging for "minor" actions | Compliance gaps |

### What to Log vs. Not Log

| Always Log | Never Log |
|-----------|-----------|
| PHI access (read/write) | Passwords or password hashes |
| Case status changes | Full PHI in metadata |
| AI feature invocations | API keys or secrets |
| File uploads/downloads | Session tokens |
| Consent changes | Credit card numbers |
| Authentication events | Raw AI prompts with PHI |
| Admin overrides | — |
| Dispute filings | — |
| Data export/deletion requests | — |

---

## Related Documentation

- [Security Model](../architecture/security-model.md) — RBAC, encryption, access controls
- [GDPR](./gdpr.md) — GDPR compliance requirements
- [HIPAA](./hipaa.md) — HIPAA compliance requirements
- [Database Schema](../database/schema-reference.md) — `AuditLog` model definition
- [Monitoring](../deployment/monitoring.md) — Alert configuration and monitoring
