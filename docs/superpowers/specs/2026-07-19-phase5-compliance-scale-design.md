# Phase 5: Compliance & Scale — Design Spec

## Overview

Phase 5 implements four compliance and operational areas for the Dr. Bubal Care platform: audit logging, dispute resolution, GDPR compliance, and edge case automation. Built as independent modules with shared foundations.

**Approach:** Modular — each area is independent, testable, and can be reviewed separately. Shared utilities (audit logger, notification service) are built first.

---

## 1. Shared Foundation

### 1.1 Audit Logger Utility

Single function called by all modules to record audit events.

**File:** `lib/audit/logger.ts`

```typescript
logAuditEvent({
  userId: string,
  action: string,        // e.g., 'CASE_STATUS_CHANGE'
  resourceType: string,  // e.g., 'Case'
  resourceId: string,    // e.g., case ID
  before?: Json,         // previous state (for modifications)
  after?: Json,          // new state (for modifications)
  metadata?: Json        // additional context
})
```

**Schema change:** Add `before` and `after` Json fields to `AuditLog` model:

```prisma
model AuditLog {
  id           String   @id @default(cuid())
  userId       String
  action       String
  resourceType String
  resourceId   String
  before       Json?    // NEW: previous state
  after        Json?    // NEW: new state
  metadata     Json?
  timestamp    DateTime @default(now())

  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### 1.2 Notification Service

Handles admin alerts and patient notifications.

**File:** `lib/notifications/service.ts`

```typescript
notifyAdmin({ type: string, message: string, metadata?: Json })
notifyPatient({ patientId: string, type: string, message: string })
```

Notification types:
- `URGENT_FINDING` — critical clinical finding identified
- `DISPUTE_FILED` — patient filed a dispute
- `DATA_EXPORT_REQUESTED` — patient requested data export
- `DATA_DELETION_REQUESTED` — patient requested data deletion
- `NO_SPECIALIST_MATCHED` — case open > 4 hours without specialist
- `INCOMPLETE_UPLOAD` — specialist flagged incomplete upload
- `PAYMENT_FAILED` — payment processing failed

---

## 2. Audit Logging Module

### 2.1 Scope

**Actions to log (all categories):**

| Category | Actions |
|----------|---------|
| Auth | login, logout, register, password_change, password_reset |
| Cases | create, status_change, assign_specialist, dispute_filed, dispute_resolved |
| Opinions | draft_created, opinion_signed, opinion_delivered |
| AI Operations | prescreen_generated, synthesis_generated, summary_generated |
| File Access | record_uploaded, record_accessed, record_deleted |
| Admin | specialist_verified, case_override, peer_review_assigned |
| Data | data_export_requested, data_deletion_requested, consent_given, consent_revoked |

### 2.2 Retention Policy

- **Active logs:** 1 year in main database
- **Archive:** 1-3 years in cold storage (S3/GCS archival tier)
- **Delete:** After 3 years

**Implementation:** Cron job runs daily:
1. Archive logs older than 1 year to cold storage
2. Delete logs older than 3 years from main database

### 2.3 Access Control

- **Admin only** — only platform admins can view audit logs
- No patient or specialist access to audit logs

### 2.4 Alert Rules

Basic alerts for critical events (trigger `notifyAdmin()`):

| Event | Alert Condition |
|-------|-----------------|
| Failed login | > 5 failed logins within 15 minutes |
| Dispute filed | Every dispute filing |
| Data export requested | Every export request |
| Data deletion requested | Every deletion request |
| Urgent finding | Every urgent/critical finding flagged by specialist |

### 2.5 API Routes

- `GET /api/admin/audit-logs` — list logs with pagination, filters (userId, action, resourceType, date range)

### 2.6 Pages

- `app/admin/audit-logs/page.tsx` — log list with filters and search

---

## 3. Dispute Resolution Module

### 3.1 Workflow

```
Patient files dispute → Admin triages (valid/invalid) → If valid, peer review assigned → Both opinions compared → Resolution with documented reasoning
```

**State transitions:**
- `DisputeStatus`: `PENDING` → `UNDER_REVIEW` → `PEER_REVIEW_ASSIGNED` → `RESOLVED` | `DISMISSED`

### 3.2 New Models

```prisma
enum DisputeStatus {
  PENDING
  UNDER_REVIEW
  PEER_REVIEW_ASSIGNED
  RESOLVED
  DISMISSED
}

model Dispute {
  id              String   @id @default(cuid())
  caseId          String
  patientId       String
  opinionId       String
  reason          String   @db.Text
  status          DisputeStatus @default(PENDING)
  adminNotes      String?  @db.Text
  resolution      String?  @db.Text
  peerReviewOpinionId String?  // link to peer review opinion
  createdAt       DateTime @default(now())
  resolvedAt      DateTime?

  case            Case     @relation(fields: [caseId], references: [id], onDelete: Cascade)
  patient         User     @relation(fields: [patientId], references: [id], onDelete: Cascade)
  opinion         SpecialistOpinion @relation(fields: [opinionId], references: [id], onDelete: Cascade)
  peerReviewOpinion SpecialistOpinion? @relation(fields: [peerReviewOpinionId], references: [id], onDelete: SetNull)
}
```

**Add relations to existing models:**
- `Case.disputes Dispute[]`
- `User.disputes Dispute[]` (as patient)
- `SpecialistOpinion.dispute Dispute?` (as original opinion)
- `SpecialistOpinion.peerReviewFor Dispute?` (as peer review)

### 3.3 Peer Review Selection

**Semi-automatic:**
1. System queries specialists by same subspecialty as original specialist
2. Excludes original specialist
3. Ranks by availability and case load
4. Returns top 3 candidates
5. Admin selects one

**API:** `GET /api/admin/disputes/[id]/peer-review-candidates` — returns top 3 specialists

### 3.4 Specialist Notification

**Delayed notification:** Original specialist is notified only after dispute resolution is complete. Notification includes:
- Case ID (no dispute details)
- Outcome summary
- Link to case for records

### 3.5 Refund Handling

**Manual:** Admin handles refunds case-by-case outside the system. No automatic refund processing. Dispute record provides audit trail for financial decisions.

### 3.6 API Routes

- `POST /api/cases/[id]/disputes` — patient files dispute (creates Dispute record, logs audit event, notifies admin)
- `GET /api/admin/disputes` — list all disputes with filters (status, date range)
- `GET /api/admin/disputes/[id]` — get dispute detail
- `POST /api/admin/disputes/[id]/triage` — admin marks valid/invalid
- `GET /api/admin/disputes/[id]/peer-review-candidates` — get top 3 peer reviewers
- `POST /api/admin/disputes/[id]/assign-peer-review` — assign peer reviewer (creates new SpecialistOpinion in DRAFT status)
- `POST /api/admin/disputes/[id]/resolve` — admin resolves dispute (sets resolution, logs audit event, notifies original specialist)

### 3.7 Pages

- `app/patient/cases/[id]/dispute/page.tsx` — file dispute form (reason textarea, submit button)
- `app/admin/disputes/page.tsx` — dispute list with status filters
- `app/admin/disputes/[id]/page.tsx` — dispute detail: original opinion, reason, triage actions, peer review assignment, resolution form

---

## 4. GDPR Compliance Module

### 4.1 Data Subject Rights

**Standard GDPR rights:**
1. Right to access (data export) — implemented via PDF export
2. Right to erasure (data deletion) — implemented with 30-day grace period
3. Right to rectification (data correction) — handled by existing profile edit functionality; patients can update name, email, and other profile fields directly
4. Right to portability (machine-readable export — implemented as PDF for this platform)

### 4.2 Consent Management

**Consent types:**
- `AI_PROCESSING` — consent for AI features (pre-screening, synthesis, summaries)
- `DATA_SHARING` — consent for sharing data with specialists

**New models:**

```prisma
model ConsentRecord {
  id          String   @id @default(cuid())
  patientId   String
  consentType String   // 'AI_PROCESSING' | 'DATA_SHARING'
  granted     Boolean
  grantedAt   DateTime?
  revokedAt   DateTime?

  patient     User     @relation(fields: [patientId], references: [id], onDelete: Cascade)

  @@unique([patientId, consentType])
}
```

**Add relation to User:** `User.consentRecords ConsentRecord[]`

### 4.3 Data Export

**Format:** PDF only (patient-facing, human-readable)

**Process:**
1. Patient requests export via settings page
2. System generates PDF with all patient data (profile, cases, opinions, lab results)
3. PDF is made available for download (signed URL, 24-hour expiry)
4. Audit log entry created

### 4.4 Right to Erasure

**Grace period:** 30 days

**Process:**
1. Patient requests deletion via settings page
2. System creates `DataDeletionRequest` with `executeAt = now + 30 days`
3. Patient receives confirmation email/notification
4. Within 30 days: patient can cancel deletion
5. After 30 days: system executes deletion (anonymize patient data, delete files)
6. Audit log entry created (retained for 3 years even after deletion)

**New models:**

```prisma
enum DeletionStatus {
  PENDING
  CONFIRMED
  COMPLETED
  CANCELLED
}

model DataDeletionRequest {
  id          String   @id @default(cuid())
  patientId   String
  status      DeletionStatus @default(PENDING)
  requestedAt DateTime
  executeAt   DateTime  // requestedAt + 30 days
  completedAt DateTime?

  patient     User     @relation(fields: [patientId], references: [id], onDelete: Cascade)
}
```

**Add relation to User:** `User.deletionRequests DataDeletionRequest[]`

### 4.5 API Routes

- `POST /api/patient/consent` — grant/revoke consent
- `GET /api/patient/consent` — get consent status
- `POST /api/patient/data-export` — request PDF export
- `GET /api/patient/data-export/download` — download export PDF (signed URL)
- `POST /api/patient/data-deletion` — request deletion (starts 30-day grace)
- `POST /api/patient/data-deletion/confirm` — double confirm deletion
- `POST /api/patient/data-deletion/cancel` — cancel within grace period
- `GET /api/admin/data-requests` — list all data requests (exports + deletions)

### 4.6 Pages

- `app/patient/settings/privacy/page.tsx` — consent toggles, data export button, data deletion request button
- `app/admin/data-requests/page.tsx` — admin view of all data requests with status

---

## 5. Edge Case Automation Module

### 5.1 Automated Scenarios

| Scenario | Trigger | Action |
|----------|---------|--------|
| **Urgent/critical findings** | Specialist signs opinion with urgent flags | Admin alert + patient notification |
| **No specialist matched** | Case status OPEN for > 4 hours | Admin alert + patient notification with revised ETA |
| **Incomplete upload** | Specialist flags case via endpoint | Patient notification with specific instructions |
| **Specialist unavailability** | Primary specialist not available | Auto-route to next available specialist in same subspecialty |
| **Payment failure** | Payment webhook failure | Auto-retry (3 attempts) + patient notification |

### 5.2 Implementation

**Cron jobs (run via Vercel Cron or external scheduler):**

1. **No specialist matched check** — every 30 minutes
   - Query: cases with status `OPEN` and `createdAt > 4 hours ago`
   - Action: `notifyAdmin()` + `notifyPatient()`

2. **Payment retry** — every 15 minutes
   - Query: cases with failed payments and retry count < 3
   - Action: retry payment, increment retry count

**Webhooks/listeners:**

1. **Urgent finding alert** — triggered after `SpecialistOpinion` sign
   - Check: if opinion contains urgent flags (from AI prescreen or specialist notation)
   - Action: `notifyAdmin({ type: 'URGENT_FINDING' })` + `notifyPatient()`

2. **Incomplete upload flag** — triggered by specialist endpoint
   - Action: `notifyPatient({ type: 'INCOMPLETE_UPLOAD', message: instructions })`

**Routing logic:**

1. **Backup specialist routing** — triggered during case assignment
   - Check: primary specialist availability
   - If unavailable: query next available specialist in same subspecialty
   - Assign to backup specialist

### 5.3 API Routes

- `POST /api/admin/edge-cases/urgent-alert` — manual urgent alert trigger (for testing/admin override)
- `GET /api/admin/edge-cases/pending` — list cases needing attention (no specialist, incomplete, etc.)
- `POST /api/cases/[id]/flag-incomplete` — specialist flags incomplete upload
- `GET /api/admin/edge-cases/stats` — summary stats (avg time to match, incomplete rate, etc.)

### 5.4 Pages

- `app/admin/edge-cases/page.tsx` — dashboard showing pending edge cases with actions
- `app/admin/edge-cases/stats/page.tsx` — stats and metrics (optional, lower priority)

---

## 6. Database Schema Summary

### New Enums

```prisma
enum DisputeStatus {
  PENDING
  UNDER_REVIEW
  PEER_REVIEW_ASSIGNED
  RESOLVED
  DISMISSED
}

enum DeletionStatus {
  PENDING
  CONFIRMED
  COMPLETED
  CANCELLED
}
```

### New Models

| Model | Purpose |
|-------|---------|
| `Dispute` | Patient dispute against a specialist opinion |
| `ConsentRecord` | Patient consent for AI processing and data sharing |
| `DataDeletionRequest` | GDPR right to erasure requests with 30-day grace |

### Modified Models

| Model | Changes |
|-------|---------|
| `AuditLog` | Add `before` Json?, `after` Json? fields |
| `Case` | Add `disputes Dispute[]` relation |
| `User` | Add `disputes Dispute[]`, `consentRecords ConsentRecord[]`, `deletionRequests DataDeletionRequest[]` relations |
| `SpecialistOpinion` | Add `dispute Dispute?`, `peerReviewFor Dispute?` relations |

---

## 7. Implementation Order

1. **Shared Foundation** — Audit logger utility + Notification service
2. **Audit Logging** — Schema update + logger integration + admin page
3. **Edge Case Automation** — Cron jobs + routing logic + admin dashboard
4. **Dispute Resolution** — New models + workflow + admin pages
5. **GDPR Compliance** — Consent + export + deletion + patient settings page

---

## 8. Testing Strategy

- Unit tests for audit logger utility
- Integration tests for dispute workflow (file → triage → peer review → resolve)
- Integration tests for GDPR flows (consent, export, deletion with grace period)
- E2E tests for edge case automation (no specialist matched, urgent finding alerts)
- All tests use existing Vitest setup

---

## 9. Compliance Checklist

- [ ] All patient data access logged in AuditLog
- [ ] Audit logs retained for 3 years
- [ ] Admin-only access to audit logs
- [ ] Consent records stored before AI processing
- [ ] Data export available as PDF
- [ ] Data deletion with 30-day grace period
- [ ] Dispute workflow with documented reasoning
- [ ] Peer review process for disputed opinions
- [ ] Urgent finding alerts within minutes
- [ ] No specialist matched alerts within 4 hours
- [ ] All AI outputs watermarked as "AI-Generated Drafts"
