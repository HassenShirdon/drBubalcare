# Dr. Bubal Care — Implementation Plan

> Based on the rewritten AGENTS.md architecture. Follow this plan to build the platform phase by phase.

---

## Overview

Dr. Bubal Care is an AI-assisted diagnostic coordination platform modeled on MedSecOp. Real board-certified specialists make all clinical decisions. AI pre-screens, routes, and synthesizes — but never diagnoses.

**Core Principle:** *"AI surfaces; specialists decide."*

---

## Phase 1: Foundation (Weeks 1-2) ✅ DONE

### Step 1: Update Prisma Schema

Add 7 new models and 3 enums to `prisma/schema.prisma`:

```prisma
enum CaseStatus {
  OPEN
  AI_PRE_SCREENED
  UNDER_REVIEW
  OPINION_READY
  CLOSED
  DISPUTED
}

enum OpinionStatus {
  DRAFT
  SIGNED
  DELIVERED
  DISPUTED
}

enum ServiceType {
  SPECIALIST_OPINION
  RESULT_INTERPRETATION
  FOLLOW_UP
  TREND_ANALYSIS
}

model Case {
  id           String             @id @default(cuid())
  patientId    String
  serviceType  ServiceType
  status       CaseStatus         @default(OPEN)
  createdAt    DateTime           @default(now())
  updatedAt    DateTime           @updatedAt
  patient      User               @relation(fields: [patientId], references: [id])
  records      CaseRecord[]
  opinions     SpecialistOpinion[]
  aiPrescreens AIPrescreen[]
}

model CaseRecord {
  id         String   @id @default(cuid())
  caseId     String
  fileUrl    String
  fileType   String
  fileName   String
  uploadedAt DateTime @default(now())
  case       Case     @relation(fields: [caseId], references: [id])
}

model SpecialistOpinion {
  id           String               @id @default(cuid())
  caseId       String
  specialistId String
  content      String
  status       OpinionStatus        @default(DRAFT)
  signedAt     DateTime?
  createdAt    DateTime             @default(now())
  case         Case                 @relation(fields: [caseId], references: [id])
  specialist   User                 @relation(fields: [specialistId], references: [id])
  plainSummary PlainLanguageSummary?
  followUps    FollowUpQuestion[]
}

model AIPrescreen {
  id           String   @id @default(cuid())
  caseId       String
  findings     String
  differentials String?
  urgentFlags  String?
  generatedAt  DateTime @default(now())
  case         Case     @relation(fields: [caseId], references: [id])
}

model PlainLanguageSummary {
  id          String   @id @default(cuid())
  opinionId   String
  content     String
  generatedAt DateTime @default(now())
  opinion     SpecialistOpinion @relation(fields: [opinionId], references: [id])
}

model FollowUpQuestion {
  id        String   @id @default(cuid())
  opinionId String
  question  String
  answer    String
  scopeNote String?
  createdAt DateTime @default(now())
  opinion   SpecialistOpinion @relation(fields: [opinionId], references: [id])
}

model AuditLog {
  id           String   @id @default(cuid())
  userId       String
  action       String
  resourceType String
  resourceId   String
  metadata     Json?
  timestamp    DateTime @default(now())
  user         User     @relation(fields: [userId], references: [id])
}
```

Run migration:
```bash
npx prisma migrate dev --name add-case-models
```

### Step 2: Build Patient Case Creation

**Files to create/modify:**

| File | Purpose |
|------|---------|
| `app/patient/cases/page.tsx` | List patient's cases |
| `app/patient/cases/new/page.tsx` | Start new case form |
| `app/api/cases/route.ts` | GET (list) + POST (create) |
| `app/api/cases/[id]/route.ts` | GET single case |
| `lib/schemas/case.ts` | Zod validation for case creation |
| `lib/hooks/useCases.ts` | React Query hook for cases |

**Flow:**
```
Patient clicks "Start Case" → Selects service type → Uploads files → Submits → Case created with status OPEN
```

### Step 3: Build File Upload

**Options:**
- **Supabase Storage** (recommended) — built-in, encrypted, signed URLs
- **AWS S3** — more control, use presigned URLs
- **Cloudinary** — simpler API, good for images

**Implementation:**
```typescript
// lib/upload.ts
export async function uploadCaseRecord(caseId: string, file: File) {
  // 1. Upload to storage bucket
  // 2. Get signed URL (expires in 1 hour)
  // 3. Save CaseRecord to database
  // 4. Return record
}
```

### Step 4: Basic Case Status Tracking

Add a case status component that shows the pipeline:
```
OPEN → AI_PRE_SCREENED → UNDER_REVIEW → OPINION_READY → CLOSED
```

**File:** `components/case-status-tracker.tsx`

### Phase 1 Implementation Summary

**Files created/modified:**
- `prisma/schema.prisma` — Added 3 enums (CaseStatus, OpinionStatus, ServiceType) + 7 models (Case, CaseRecord, SpecialistOpinion, AIPrescreen, PlainLanguageSummary, FollowUpQuestion, AuditLog)
- `prisma/migrations/20260718104648_add_case_models/migration.sql` — Auto-generated migration
- `lib/schemas/case.schema.ts` — Zod validation for case creation
- `lib/schemas/index.ts` — Updated barrel export
- `lib/hooks/use-cases.ts` — React Query hooks (useCases, useCase, useCreateCase)
- `lib/hooks/index.ts` — Updated barrel export
- `app/api/cases/route.ts` — GET (list) + POST (create) API routes
- `app/api/cases/[id]/route.ts` — GET single case API route
- `app/api/cases/[id]/records/route.ts` — POST (upload) + GET (list) file records
- `app/patient/cases/page.tsx` — Patient cases list page
- `app/patient/cases/new/page.tsx` — New case creation form
- `app/patient/cases/[id]/page.tsx` — Case detail page with records, opinions, AI pre-screen
- `components/case-status-tracker.tsx` — Visual status pipeline component
- `components/file-upload.tsx` — Drag-and-drop file upload component
- `components/PatientLayout.tsx` — Added "My Cases" link to sidebar and mobile nav
- `app/patient/page.tsx` — Added "Start Case" quick action to dashboard

**What works:**
- Patients can create cases (select service type + description)
- Patients can view their cases list with status indicators
- Patients can view case details with status tracker
- Patients can upload files (PDF, JPEG, PNG, WebP) to cases
- File uploads saved to `public/uploads/` with database records
- API routes with proper auth checks (patient owns case, doctor assigned)
- Role-based case listing (patient sees own, doctor sees assigned, admin sees all)

---

## Phase 2: Specialist Portal (Weeks 3-4)

### Step 1: Specialist Registration & Verification

Extend the existing doctor signup flow:
- Add medical registration number field
- Add verification status (PENDING → VERIFIED → REJECTED)
- Add subspecialty field (pathology, radiology, etc.)

**Modify:** `lib/schemas/auth.ts`, `app/auth/signup/doctor/page.tsx`

### Step 2: Case Routing (Manual First)

Before building AI routing, start with manual assignment:

```typescript
// app/api/admin/cases/route.ts
// Admin sees all OPEN cases, manually assigns to specialist
export async function assignCase(caseId: string, specialistId: string) {
  await prisma.case.update({
    where: { id: caseId },
    data: { status: 'UNDER_REVIEW' }
  })
  // Create notification for specialist
}
```

**Admin page:** `app/admin/cases/page.tsx` — table of all cases with assign dropdown

### Step 3: Opinion Writing

**Files to create:**

| File | Purpose |
|------|---------|
| `app/doctor/cases/[id]/page.tsx` | Case detail view for specialist |
| `app/doctor/cases/[id]/opinion/page.tsx` | Opinion writing form |
| `components/opinion-editor.tsx` | Rich text editor for opinion |
| `app/api/opinions/route.ts` | POST (create draft) |
| `app/api/opinions/[id]/sign/route.ts` | POST (sign and submit) |

**Opinion structure:**
```markdown
## Clinical Findings
[What the specialist observed]

## Clinical Impression
[Their interpretation]

## Recommended Next Steps
[What should happen next]
```

### Step 4: Report Delivery

Once specialist signs, the opinion status changes to `SIGNED` → `DELIVERED`:
- Patient gets notification
- Plain-language summary generated (Phase 3)
- Case status → `OPINION_READY`

---

## Phase 3: AI Features (Weeks 7-8)

### Step 1: Intelligent Case Routing

**Service:** Match cases to specialists by subspecialty

```typescript
// lib/ai/case-router.ts
export async function routeCase(caseId: string) {
  const case = await prisma.case.findUnique({ where: { id: caseId } })
  
  // 1. Extract clinical metadata from uploaded files
  // 2. Query available specialists by subspecialty
  // 3. Score by: subspecialty match, availability, rating
  // 4. Assign to top match
  // 5. Update case status to UNDER_REVIEW
}
```

**LLM call:** Use Claude to extract diagnosis type and tissue site from clinical notes
**Trigger:** On case creation or admin click

### Step 2: AI Pre-screening

**Service:** Before specialist opens case, AI reads clinical notes

```typescript
// lib/ai/prescreen.ts
export async function generatePrescreen(caseId: string) {
  const caseRecords = await prisma.caseRecord.findMany({
    where: { caseId }
  })
  
  // 1. Strip PHI (names, DOB, MRN) from clinical content
  // 2. Send to Claude with structured prompt
  // 3. Parse response into: findings, differentials, urgentFlags
  // 4. Save to AIPrescreen table
  // 5. Update case status to AI_PRE_SCREENED
}
```

**Prompt template:**
```
You are a clinical pre-screening assistant. Analyze the following clinical notes and provide:
1. Key findings (bullet points)
2. Differential diagnoses to consider
3. Urgent flags (if any)

IMPORTANT: This is an AI-generated draft. It must be reviewed by a board-certified specialist.

Clinical content:
{PHI_STRIPPED_CONTENT}
```

**PHI stripping function:**
```typescript
// lib/ai/phi-strip.ts
export function stripPHI(text: string): string {
  // Remove names, DOB, MRN, addresses, phone numbers
  // Use regex patterns + LLM verification
  return cleanedText
}
```

### Step 3: Plain-language Summary

**Service:** Translate specialist opinion into patient-friendly language

```typescript
// lib/ai/plain-language.ts
export async function generatePlainSummary(opinionId: string) {
  const opinion = await prisma.specialistOpinion.findUnique({
    where: { id: opinionId }
  })
  
  // 1. Strip PHI
  // 2. Send opinion content to Claude
  // 3. Prompt: "Rewrite this medical report in plain language..."
  // 4. Save to PlainLanguageSummary table
}
```

**Trigger:** After specialist signs opinion

---

## Phase 4: Advanced AI (Weeks 9-10)

### Step 1: Multi-opinion Synthesis

When 2-4 specialists give opinions on the same case:

```typescript
// lib/ai/synthesis.ts
export async function synthesizeOpinions(caseId: string) {
  const opinions = await prisma.specialistOpinion.findMany({
    where: { caseId, status: 'DELIVERED' }
  })
  
  // 1. Strip PHI from all opinions
  // 2. Send to Claude: "Compare these specialist opinions..."
  // 3. Output: areas of agreement, disagreement, consensus summary
  // 4. Save synthesis to case
}
```

### Step 2: Follow-up Q&A

After report delivery, patient asks questions:

```typescript
// lib/ai/followup.ts
export async function answerFollowUp(
  opinionId: string, 
  question: string
) {
  const opinion = await prisma.specialistOpinion.findUnique({
    where: { id: opinionId }
  })
  
  // 1. Strip PHI from question and opinion
  // 2. Send to Claude with opinion as context
  // 3. Prompt: "Answer within the scope of this opinion..."
  // 4. If question goes beyond scope, respond: "Please book a consultation"
  // 5. Save Q&A to FollowUpQuestion table
}
```

### Step 3: Result Trend Analysis

For patients with repeat lab tests:

```typescript
// lib/ai/trends.ts
export async function analyzeTrends(patientId: string) {
  const labResults = await prisma.labResult.findMany({
    where: { patientId },
    include: { metrics: true, trends: true },
    orderBy: { date: 'asc' }
  })
  
  // 1. Group metrics by test name
  // 2. Calculate statistical significance of changes
  // 3. Flag values that are trending up/down significantly
  // 4. Generate alerts for coordinator/physician
}
```

---

## Phase 5: Compliance & Scale (Weeks 11-12)

### Step 1: Audit Logging

Add middleware that logs every data access:

```typescript
// lib/audit.ts
export async function logAudit(
  userId: string,
  action: string,
  resourceType: string,
  resourceId: string,
  metadata?: any
) {
  await prisma.auditLog.create({
    data: { userId, action, resourceType, resourceId, metadata }
  })
}
```

**Where to call:**
- Every API route that reads/writes patient data
- Every AI feature that processes clinical content
- Every file upload/download

### Step 2: Row-Level Security

In Supabase, configure policies:
```sql
-- Patients can only see their own cases
CREATE POLICY "patient_own_cases" ON cases
  FOR SELECT USING (patient_id = auth.uid());

-- Specialists can only see assigned cases
CREATE POLICY "specialist_assigned_cases" ON cases
  FOR SELECT USING (specialist_id = auth.uid());
```

### Step 3: Dispute Resolution

```typescript
// app/api/cases/[id]/dispute/route.ts
export async function raiseDispute(caseId: string, reason: string) {
  await prisma.case.update({
    where: { id: caseId },
    data: { status: 'DISPUTED' }
  })
  // Notify admin
  // Admin reviews and assigns peer review
}
```

---

## Implementation Timeline

| Week | Focus | Deliverable |
|------|-------|-------------|
| 1-2 | Schema + Case creation | Patient can start cases and upload files |
| 3-4 | Specialist portal | Specialist can view cases and write opinions |
| 5-6 | File upload + storage | Encrypted file storage with signed URLs |
| 7-8 | AI pre-screening | AI reads clinical notes before specialist |
| 9-10 | Plain-language summary + Case routing | Reports translated, cases auto-matched |
| 11-12 | Follow-up Q&A + Trends | Advanced AI features |
| 13-14 | Audit logging + compliance | GDPR/HIPAA controls |
| 15-16 | Dispute resolution + Edge cases | Full production readiness |

---

## Key Technical Decisions

| Decision | Recommendation | Why |
|----------|---------------|-----|
| **File storage** | Supabase Storage | Already using Supabase, built-in encryption, signed URLs |
| **LLM provider** | Anthropic Claude | MedSecOp uses it, best for clinical text |
| **PDF parsing** | pdf-parse or pdf2json | Extract text from uploaded lab reports |
| **Image analysis** | Claude Vision API | For DICOM scans and slide images |
| **Rich text editor** | TipTap (already in project) | Consistent with existing codebase |
| **Email notifications** | Resend or SendGrid | For case status updates |
| **WhatsApp** | Twilio API | For urgent findings and diaspora coordination |

---

## Testing Strategy

Since there's no test setup yet, add one:

```bash
# Install
npm install -D vitest @testing-library/react @testing-library/jest-dom

# vitest.config.ts
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts']
  }
})
```

**Test what matters most:**
1. PHI stripping function (security critical)
2. Case status transitions (business logic)
3. Opinion signing flow (audit trail)
4. API route auth checks (access control)

---

## Edge Cases to Handle

| Scenario | Handling |
|----------|----------|
| **Urgent/critical findings** | Specialist identifies critical finding → immediate phone/WhatsApp contact, not just portal notification |
| **No specialist matched** | If no specialist matched within 4 hours → admin alerted, patient notified with revised ETA |
| **Incomplete upload** | Files unreadable or insufficient → specialist flags case, patient notified with specific instructions |
| **Dispute resolution** | Patient not satisfied → admin reviews, peer review assigned at no extra cost |
| **AI hallucination risk** | All AI outputs watermarked as "AI-Generated Drafts" — never presented as clinical diagnosis |
| **Specialist unavailability** | Backup matching queue — if primary specialist unavailable, auto-route to next available |
| **Payment failure** | Case not initiated until payment confirmed. Patient notified with retry options |
