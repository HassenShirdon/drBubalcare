# European Specialist Referral Service — Design

## Overview

A new service type that lets patients find and connect with board-certified specialists in Europe. Dr. Bubal Care acts as the coordination layer — matching, scheduling, records transfer, and follow-up — without processing payment (handled directly between patient and specialist).

## Principle

> "Dr. Bubal Care connects; specialists consult; payment is between them."

## 1. Data Model

### New Enum: `ConsultationType`

```
IN_PERSON
VIRTUAL
```

### New Enum: `ReferralStatus`

```
SEARCHING   → Coordinator is actively looking for specialist matches
MATCHED     → Specialist identified, details presented to patient
SCHEDULED   → Consultation date agreed between patient and specialist
COMPLETED   → Consultation took place
CLOSED      → Case wrapped up (follow-up done, no further action)
```

### New Model: `ReferralCoordination`

```prisma
model ReferralCoordination {
  id               String         @id @default(cuid())
  caseId           String         @unique
  referralStatus   ReferralStatus @default(SEARCHING)
  specialistName   String?
  specialistEmail  String?
  clinic           String?
  country          String?
  consultationType ConsultationType?
  coordinatorNotes String?        @db.Text
  scheduledAt      DateTime?
  completedAt      DateTime?
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt

  case             Case           @relation(fields: [caseId], references: [id], onDelete: Cascade)
}
```

### Modified: `ServiceType` Enum

Add `EUROPEAN_REFERRAL` to existing values:
```
SPECIALIST_OPINION
RESULT_INTERPRETATION
FOLLOW_UP
TREND_ANALYSIS
EUROPEAN_REFERRAL    // NEW
```

### Modified: `Case.status` Mapping

For `EUROPEAN_REFERRAL` cases, the status progression is:
- `OPEN` — Patient submitted referral request
- `UNDER_REVIEW` — Coordinator working on matching
- `CLOSED` — Case completed and wrapped up
- `DISPUTED` — Patient raised an issue

`AI_PRE_SCREENED` and `OPINION_READY` do not apply to this service type.

## 2. Workflow & State Machine

```
┌──────────┐     ┌──────────────┐     ┌──────────┐     ┌───────────┐     ┌───────────┐     ┌──────┐
│  OPEN    │────▶│ UNDER_REVIEW │────▶│ CLOSED   │
│ (Case)   │     │ (Case)       │     │ (Case)   │
└──────────┘     │ SEARCHING    │     └──────────┘
                 │ (Referral)   │
                 └──────┬───────┘
                        │
                 ┌──────▼───────┐     ┌──────────────┐     ┌────────────────┐
                 │  MATCHED     │────▶│  SCHEDULED   │────▶│  COMPLETED     │
                 │ (Referral)   │     │ (Referral)   │     │ (Referral)     │
                 └──────────────┘     └──────────────┘     └────────────────┘
```

| Step | Action | Case.status | referralStatus |
|------|--------|-------------|----------------|
| Patient creates case | `POST /api/cases` | OPEN | — |
| Coordinator picks up | Admin updates case | UNDER_REVIEW | SEARCHING |
| Specialist found | Coordinator populates match | UNDER_REVIEW | MATCHED |
| Consultation scheduled | Coordinator sets date | UNDER_REVIEW | SCHEDULED |
| Consultation done | Coordinator marks complete | UNDER_REVIEW | COMPLETED |
| Case wrapped up | Admin closes case | CLOSED | CLOSED |
| Issue raised | Admin/admin marks dispute | DISPUTED | (unchanged) |

## 3. API Surface

### Existing endpoints (reused)

| Method | Route | What changes |
|--------|-------|-------------|
| `GET /api/cases` | Patient sees all cases including referrals | Add include for `referralCoordination` |
| `POST /api/cases` | Create case with `serviceType: EUROPEAN_REFERRAL` | Add to Zod schema validation |

### New endpoints

| Method | Route | Role | Purpose |
|--------|-------|------|---------|
| `GET /api/referrals/[caseId]` | Patient, Coordinator, Admin | View full referral coordination details |
| `PATCH /api/referrals/[caseId]` | Admin (Coordinator) | Update specialist match, status, notes |

### Record upload

Reuses existing `POST /api/cases/[id]/records` — patients can attach referral letters, medical history, or any supporting documents just like other case types.

## 4. Role Access

| Action | Patient | Admin/Coordinator |
|--------|---------|------------------|
| Create referral case | ✓ | — |
| View own referral status | ✓ | ✓ |
| Update coordination details | — | ✓ |
| Change Case.status (close, dispute) | — | ✓ |
| Upload records | ✓ | — |

No new role needed. Admins handle coordination. A dedicated `COORDINATOR` role can be split out in the future if volume demands it.

## 5. What Does NOT Change

- **Payment:** Not handled. Patient and specialist arrange directly.
- **Auth:** Existing middleware and role guards unchanged.
- **Audit logging:** Reuses existing `AuditLog` model — actions on referrals are logged.
- **Follow-up:** Once consultation is done, existing `FollowUpQuestion` model can be used if the specialist provides a written opinion through the platform (optional).
- **File upload:** Reuses `CaseRecord` model — no new upload infrastructure.

## 6. Out of Scope (Phase 1)

- Dedicated Coordinator role and portal — admins handle via existing admin portal
- Multi-language support for European specialist discovery
- Automated specialist matching based on credentials — coordinator does manual matching
- In-platform video/telemedicine — consultation happens outside
- Payment processing through the platform
- Specialist verification on the European side — assumed the coordinator verifies offline
