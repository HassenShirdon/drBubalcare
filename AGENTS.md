# Dr. Bubal Care: AI-Assisted Diagnostic Coordination

This document defines the AI feature layer and diagnostic coordination architecture powering the Dr. Bubal Care platform. Built on the principle that **AI surfaces; specialists decide**, this system automates the coordination layer while ensuring every clinical decision is made by a board-certified human specialist.

---

## 1. System Mission & Identity

Dr. Bubal Care is an AI-assisted diagnostic coordination platform. It bridges geographical barriers between patients and board-certified specialists by automating the coordination layer — not the clinical judgment.

**Core Principle:** *"AI surfaces; specialists decide."*

Every case closes with a human-signed written opinion. AI pre-screens, routes, and synthesizes — but never diagnoses.

**Core Capabilities:**

* **Smart Case Routing:** Automatically matches cases to the correct specialist by subspecialty and availability.
* **AI Pre-screening:** Reads clinical notes and flags key findings before the specialist opens the case.
* **Plain-language Summary:** Translates specialist reports into patient-friendly language with no medical jargon.
* **Multi-opinion Synthesis:** When multiple specialists review a case, AI synthesizes areas of agreement and disagreement.
* **Follow-up Q&A:** Answers patient questions within the documented scope of the written opinion.
* **Result Trend Analysis:** Tracks longitudinal lab trends and flags statistically significant changes.

**Platform Scope:** Direct diagnostic coordination platform modeled on MedSecOp's architecture, adapted for Dr. Bubal Care's target market.

---

## 2. User Roles & Portals

Dr. Bubal Care serves three user roles, each with a dedicated portal and clear journey.

| Role | Portal | Description |
|------|--------|-------------|
| **Patient** | `patient.drbubalcare.com` | Register, start cases, upload records, receive opinions, ask follow-ups, track trends |
| **Specialist (Doctor)** | `doctor.drbubalcare.com` | Review assigned cases, write opinions, access AI pre-screening, manage availability |
| **Admin** | `admin.drbubalcare.com` | Case routing oversight, system health, analytics, dispute resolution |

### Patient Journey

1. **Register** — Name, email, country, password. Under 2 minutes.
2. **Start a case** — Select review type (image review, result interpretation, direct consultation). Upload slides, DICOM scans, or lab reports. Files encrypted on upload.
3. **Choose a service and pay** — Single-expert or panel review. See exact price before confirming.
4. **AI pre-screening** — Reviews clinical notes, flags key findings for incoming specialist. Takes a few minutes.
5. **Specialist reviews** — Board-certified specialist matched by subspecialty reviews materials alongside AI pre-screen. Target: 24-48 hours.
6. **Receive report** — Structured written opinion — clinical findings, impression, recommended next steps. Plain-language summary included.
7. **Follow-up** — Ask questions via AI assistant (within scope of written opinion). Or book direct consultation.

### Specialist Journey

1. **Register & verify** — Provide credentials and medical registration number. Verification within 24-48 hours.
2. **Set availability** — Subspecialties, available hours, case capacity.
3. **Receive cases** — AI-routed cases arrive with pre-screening attached.
4. **Write opinion** — Structured format — findings, clinical impression, recommended next steps.
5. **Sign and submit** — Human signature closes the case. AI never signs.

### Admin Oversight

* Monitor case routing accuracy and specialist response times
* Handle urgent/critical findings (immediate phone/WhatsApp contact)
* Review disputes and assign peer reviews
* Manage specialist onboarding and verification
* System health dashboards and compliance audit reviews

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

The platform includes six AI features that assist real specialists — not replace them. All AI outputs are logged, versioned, and auditable. Every output is watermarked as "AI-Generated Draft" and requires human specialist sign-off.

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 1 | **Intelligent Case Routing** | Analyzes case metadata (diagnosis type, tissue site, urgency flags) and matches to most appropriate specialist by subspecialty and current availability. Eliminates manual triage. | `Planned` |
| 2 | **AI Pre-screening** | Before specialist opens case, reads clinical notes and prior reports. Produces structured pre-screen: key findings, differentials to consider, urgent flags. Specialist reviews human record; AI surfaces what matters first. | `Planned` |
| 3 | **Plain-language Summary** | Translates specialist's written opinion into patient-friendly language. No medical jargon. Written as if by a trusted GP. | `Planned` |
| 4 | **Multi-opinion Synthesis** | When case receives opinions from 2-4 specialists, synthesizes areas of agreement and disagreement into consensus summary. Saves patient from manually reconciling conflicting reports. | `Planned` |
| 5 | **Follow-up Q&A** | After report delivery, patient asks questions. AI answers within documented scope of written opinion. Reduces support load, gives patients clarity faster. | `Planned` |
| 6 | **Result Trend Analysis** | For patients with repeat lab tests, tracks longitudinal trends and flags statistically significant changes. Early-warning signal for coordinators and physicians. | `Planned` |

### AI Safety Principles

* **PHI-safe Prompting:** Identifiable data (names, DOB, MRN) is stripped before any LLM call. Clinical content only reaches the model.
* **Documented Reasoning:** All AI outputs are logged, versioned, and auditable — meeting clinical governance standards.
* **Human Sign-off:** Every case closes with a human-signed written opinion. AI surfaces; specialists decide.
* **No Clinical Diagnosis:** AI is strictly forbidden from offering definitive clinical diagnoses. All outputs are watermarked as "AI-Generated Drafts."

---

## 5. Core Workflows

### 5.1 Patient Case Workflow (Specialist Opinion)

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

### 5.2 Specialist Review Workflow

```
Register → Verify Credentials → Set Availability → Receive Cases → Write Opinion → Sign & Submit
```

1. **Register:** Provide credentials and medical registration number. Verification within 24-48 hours.
2. **Set availability:** Subspecialties, available hours, case capacity.
3. **Receive cases:** AI-routed cases arrive with pre-screening attached.
4. **Write opinion:** Structured format — findings, clinical impression, recommended next steps.
5. **Sign and submit:** Human signature closes the case. AI never signs.

### 5.3 Admin Oversight Workflow

* Monitor case routing accuracy and specialist response times
* Handle urgent/critical findings (immediate phone/WhatsApp contact)
* Review disputes and assign peer reviews
* Manage specialist onboarding and verification
* System health dashboards and compliance audit reviews

---

## 6. Database Schema & State Management

### Existing Models (from Prisma schema)

* `User` — Base user with role (PATIENT, DOCTOR, ADMIN)
* `Doctor` — Specialist profile (specialty, experience, rating, bio)
* `DoctorService` — Services offered by a doctor
* `LabResult` — Patient lab results with metrics and trends
* `LabMetric` — Individual lab test values with reference ranges
* `LabTrendPoint` — Longitudinal lab data points
* `Appointment` — Patient-doctor appointments
* `Post` — Blog/news posts
* `Service` — Platform service definitions

### New Models (to be added)

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

* `Case.status`: `OPEN` → `AI_PRE_SCREENED` → `UNDER_REVIEW` → `OPINION_READY` → `CLOSED`
* `Case.status`: Any → `DISPUTED` (if patient raises dispute)
* `SpecialistOpinion.status`: `DRAFT` → `SIGNED` → `DELIVERED`

### Role-Based Data Access

**Patient:**
* Read: Own `cases`, `case_records`, `specialist_opinions`, `plain_language_summaries`, `follow_up_questions`
* Write: New `cases`, `case_records`, `follow_up_questions`

**Specialist (Doctor):**
* Read: Assigned `cases`, `case_records`, `ai_prescreens`
* Write: `specialist_opinions` (draft → sign)

**Admin:**
* Read: All `cases`, `audit_logs`, platform metrics
* Write: Case status overrides, dispute resolution, specialist verification

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
