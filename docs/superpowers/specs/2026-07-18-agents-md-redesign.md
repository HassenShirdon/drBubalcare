# AGENTS.md Redesign Specification

**Date:** 2026-07-18
**Status:** Approved
**Approach:** Full vision with status tracking

---

## 1. System Mission & Identity

Dr. Bubal Care is an AI-assisted diagnostic coordination platform. It bridges geographical barriers between patients and board-certified specialists by automating the coordination layer — not the clinical judgment.

**Core principle:** *"AI surfaces; specialists decide."*

Every case closes with a human-signed written opinion. AI pre-screens, routes, and synthesizes — but never diagnoses.

**Core Capabilities:**
- Smart case routing to the correct specialist by subspecialty and availability
- AI pre-screening that flags key findings before the specialist opens the case
- Plain-language report translation for patient understanding
- Multi-opinion synthesis when multiple specialists review a case
- Longitudinal lab trend analysis with anomaly detection
- Follow-up Q&A within the documented scope of written opinions

**Platform scope:** Direct clone of MedSecOp's diagnostic coordination model, adapted for Dr. Bubal Care's target market.

---

## 2. User Roles & Portals

### Patient Portal (`patient.drbubalcare.com`)

**Journey:**
1. Register (name, email, country, password — under 2 minutes)
2. Start a new case (select service type, upload slides/scans/reports — files encrypted on upload)
3. Choose a service and pay (single-expert or panel review — see price before confirming)
4. AI pre-screening runs (flags key findings for incoming specialist)
5. Specialist reviews case alongside AI pre-screen (target: 24-48 hours)
6. Receive written report (clinical findings, impression, recommended next steps + plain-language summary)
7. Ask follow-up questions (AI answers within scope, or book direct consultation)

### Specialist Portal (`doctor.drbubalcare.com`)

**Journey:**
1. Register and verify credentials (provide medical registration number — verification within 24-48 hours)
2. Set availability and subspecialties
3. Receive routed cases with AI pre-screening
4. Write structured opinion (findings, clinical impression, recommended next steps)
5. Sign and submit — case closed with human signature

### Admin Portal (`admin.drbubalcare.com`)

**Responsibilities:**
- Monitor case routing and specialist availability
- Handle edge cases (urgent findings, no specialist matched, incomplete uploads)
- Review disputes and assign peer reviews
- System health, analytics, platform metrics
- Audit log review for compliance

---

## 3. Core Services

| Service | Description | Status |
|---------|-------------|--------|
| **Specialist Opinions** | Submit slides, scans, or reports → matched to board-certified specialist → written opinion within 24-48h | `Planned` |
| **Result Interpretation** | Already have results but unclear → plain-language written explanation from qualified specialist | `Planned` |
| **Follow-up Consultations** | After receiving report, patient asks questions → AI answers within scope, or book live consultation | `Planned` |
| **Lab Test Trend Analysis** | Repeat lab tests tracked longitudinally → AI flags statistically significant changes over time | `Planned` |

---

## 4. AI Feature Layer

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 1 | **Intelligent Case Routing** | Analyzes case metadata (diagnosis type, tissue site, urgency flags) and matches to most appropriate specialist by subspecialty and current availability. Eliminates manual triage. | `Planned` |
| 2 | **AI Pre-screening** | Before specialist opens case, reads clinical notes and prior reports. Produces structured pre-screen: key findings, differentials to consider, urgent flags. Specialist reviews human record; AI surfaces what matters first. | `Planned` |
| 3 | **Plain-language Summary** | Translates specialist's written opinion into patient-friendly language. No medical jargon. Written as if by a trusted GP. | `Planned` |
| 4 | **Multi-opinion Synthesis** | When case receives opinions from 2-4 specialists, synthesizes areas of agreement and disagreement into consensus summary. Saves patient from manually reconciling conflicting reports. | `Planned` |
| 5 | **Follow-up Q&A** | After report delivery, patient asks questions. AI answers within documented scope of written opinion. Reduces support load, gives patients clarity faster. | `Planned` |
| 6 | **Result Trend Analysis** | For patients with repeat lab tests, tracks longitudinal trends and flags statistically significant changes. Early-warning signal for coordinators and physicians. | `Planned` |

**All AI outputs are:**
- Logged, versioned, and auditable (meeting clinical governance standards)
- Watermarked as "AI-Generated Drafts" — never presented as clinical diagnoses
- Processed with PHI-safe prompting (identifiable data stripped before LLM calls)

---

## 5. Core Workflows

### Patient Journey (Specialist Opinion)

```
Register → Start Case → Upload Records → Pay → AI Pre-screening → Specialist Reviews → Written Report Delivered → Follow-up Q&A
```

1. **Register:** Name, email, country, password. Under 2 minutes.
2. **Start case:** Select review type (image review, result interpretation, direct consultation). Upload slides, DICOM scans, or lab reports. Files encrypted on upload.
3. **Choose service and pay:** Single-expert or panel review. Pay by card (USD) or local payment method. See exact price before confirming.
4. **AI pre-screening:** Reviews clinical notes, flags key findings for incoming specialist. Takes a few minutes.
5. **Specialist reviews:** Board-certified specialist matched by subspecialty reviews materials alongside AI pre-screen. Target: 24-48 hours.
6. **Receive report:** Structured written opinion in portal — clinical findings, impression, recommended next steps. Plain-language summary included.
7. **Follow-up:** Ask questions about report via AI assistant. Or book direct consultation for live conversation.

### Specialist Journey

```
Register → Verify Credentials → Set Availability → Receive Cases → Write Opinion → Sign & Submit
```

1. **Register:** Provide credentials and medical registration number. Verification within 24-48 hours.
2. **Set availability:** Subspecialties, available hours, case capacity.
3. **Receive cases:** AI-routed cases arrive with pre-screening attached.
4. **Write opinion:** Structured format — findings, clinical impression, recommended next steps.
5. **Sign and submit:** Human signature closes the case. AI never signs.

### Admin Oversight

- Monitor routing accuracy and specialist response times
- Handle urgent/critical findings (immediate phone/WhatsApp contact)
- Review disputes and assign peer reviews
- Manage specialist onboarding and verification
- System health dashboards and compliance audit reviews

---

## 6. Database Schema & State Management

### Existing Models (keep as-is from Prisma schema)

- `User` — base user with role (PATIENT, DOCTOR, ADMIN)
- `Doctor` — specialist profile (specialty, experience, rating, bio)
- `DoctorService` — services offered by a doctor
- `LabResult` — patient lab results with metrics and trends
- `LabMetric` — individual lab test values with reference ranges
- `LabTrendPoint` — longitudinal lab data points
- `Appointment` — patient-doctor appointments
- `Post` — blog/news posts
- `Service` — platform service definitions

### New Models (to be added to Prisma schema)

| Model | Purpose | Key Fields |
|-------|---------|-----------|
| `Case` | A patient's diagnostic case | `id`, `patientId`, `serviceType`, `status` (CaseStatus), `createdAt`, `updatedAt` |
| `CaseRecord` | Uploaded files (slides, scans, reports) | `id`, `caseId`, `fileUrl`, `fileType`, `fileName`, `uploadedAt` |
| `SpecialistOpinion` | Written opinion from specialist | `id`, `caseId`, `specialistId`, `content`, `status` (OpinionStatus), `signedAt`, `createdAt` |
| `AIPrescreen` | AI pre-screening output | `id`, `caseId`, `findings`, `differentials`, `urgentFlags`, `generatedAt` |
| `PlainLanguageSummary` | Patient-friendly translation | `id`, `opinionId`, `content`, `generatedAt` |
| `FollowUpQuestion` | Patient follow-up Q&A | `id`, `opinionId`, `question`, `answer`, `scopeNote`, `createdAt` |
| `AuditLog` | HIPAA/GDPR compliance logging | `id`, `userId`, `action`, `resourceType`, `resourceId`, `metadata`, `timestamp` |

### New Enums

| Enum | Values |
|------|--------|
| `CaseStatus` | `OPEN`, `AI_PRE_SCREENED`, `UNDER_REVIEW`, `OPINION_READY`, `CLOSED`, `DISPUTED` |
| `OpinionStatus` | `DRAFT`, `SIGNED`, `DELIVERED`, `DISPUTED` |
| `ServiceType` | `SPECIALIST_OPINION`, `RESULT_INTERPRETATION`, `FOLLOW_UP`, `TREND_ANALYSIS` |

### State Transitions

- `Case.status`: `OPEN` → `AI_PRE_SCREENED` → `UNDER_REVIEW` → `OPINION_READY` → `CLOSED`
- `Case.status`: Any → `DISPUTED` (if patient raises dispute)
- `SpecialistOpinion.status`: `DRAFT` → `SIGNED` → `DELIVERED`

### Role-Based Data Access

**Patient:**
- Read: Own `cases`, `case_records`, `specialist_opinions`, `plain_language_summaries`, `follow_up_questions`
- Write: New `cases`, `case_records`, `follow_up_questions`

**Specialist (Doctor):**
- Read: Assigned `cases`, `case_records`, `ai_prescreens`
- Write: `specialist_opinions` (draft → sign)

**Admin:**
- Read: All `cases`, `audit_logs`, platform metrics
- Write: Case status overrides, dispute resolution, specialist verification

---

## 7. Security & Compliance (GDPR + HIPAA)

| Principle | Implementation |
|-----------|---------------|
| **PHI-safe Prompting** | Strip all identifiable data (names, DOB, MRN) before any LLM call. Clinical content only reaches the model. |
| **Audit Logging** | Every read/write to patient data logged with `AuditLog` — who, what, when, which resource. |
| **Data Minimization** | AI features process only the clinical data needed for the specific task. |
| **Encryption at rest** | Supabase/PostgreSQL encryption for stored PHI. |
| **Encryption in transit** | TLS 1.3 for all data transmission. |
| **Signed URLs** | Short-lived, expiring URLs for file access — expire immediately after extraction task completes. |
| **Right to erasure** | GDPR Article 17 — patients can request full data deletion via admin. |
| **Consent management** | Explicit consent for AI processing, stored in database. |
| **Incident response** | Breach notification within 72 hours (GDPR) / without unreasonable delay (HIPAA). |
| **Access controls** | Row-level security in Supabase. Users can only access their own data (or assigned cases for specialists). |

---

## 8. Edge Case Handling

| Scenario | Handling |
|----------|----------|
| **Urgent/critical findings** | Specialist identifies critical finding → immediate phone/WhatsApp contact, not just portal notification. Admin alerted. |
| **No specialist matched** | If no specialist matched within 4 hours → admin alerted, patient notified with revised ETA. |
| **Incomplete upload** | Files unreadable or insufficient → specialist flags case, patient notified with specific instructions on what's missing. |
| **Dispute resolution** | Patient not satisfied with opinion → admin reviews case, peer review assigned at no extra cost. |
| **AI hallucination risk** | All AI outputs watermarked as "AI-Generated Drafts" — never presented as clinical diagnosis. Specialist must review and sign. |
| **Specialist unavailability** | Backup matching queue — if primary specialist unavailable, auto-route to next available specialist in same subspecialty. |
| **Payment failure** | Case not initiated until payment confirmed. Patient notified with retry options. |

---

## Implementation Phases

### Phase 1: Foundation
- Database schema updates (new models and enums)
- Patient registration and case creation
- File upload with encryption
- Basic case status tracking

### Phase 2: Specialist Portal
- Specialist registration and verification
- Case routing (manual first, then AI)
- Opinion writing and signing
- Report delivery

### Phase 3: AI Features
- Intelligent case routing
- AI pre-screening
- Plain-language summary generation

### Phase 4: Advanced AI
- Multi-opinion synthesis
- Follow-up Q&A
- Result trend analysis

### Phase 5: Compliance & Scale
- Full audit logging
- GDPR/HIPAA compliance controls
- Dispute resolution workflow
- Edge case handling automation
