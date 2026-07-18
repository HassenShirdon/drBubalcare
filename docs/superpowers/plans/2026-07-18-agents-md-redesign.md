# AGENTS.md Redesign — Phase 1: Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the AGENTS.md file to accurately reflect Dr. Bubal Care's architecture as a MedSecOp-style diagnostic coordination platform with AI-assisted features and real specialist decisions.

**Architecture:** Rewrite AGENTS.md with 8 sections: Mission, Roles, Services, AI Features, Workflows, Database Schema, Security/Compliance, Edge Cases. Each feature marked with implementation status. Core principle: "AI surfaces; specialists decide."

**Tech Stack:** Markdown documentation only — no code changes in this phase.

## Global Constraints

- AGENTS.md is the single source of truth for the platform's agent/AI architecture
- All AI features must be described as tools assisting real doctors, not replacing them
- Must align with existing Prisma schema (User, Doctor, LabResult, Appointment, etc.)
- New models needed: Case, CaseRecord, SpecialistOpinion, AIPrescreen, PlainLanguageSummary, FollowUpQuestion, AuditLog
- New enums needed: CaseStatus, OpinionStatus, ServiceType
- Compliance: GDPR + HIPAA with PHI-safe prompting, audit logging
- User roles: Patient, Specialist (Doctor), Admin
- 4 services: Specialist opinions, Result interpretation, Follow-up consultations, Lab test trend analysis
- 6 AI features: Case routing, Pre-screening, Plain-language summary, Multi-opinion synthesis, Follow-up Q&A, Trend analysis

---

### Task 1: Rewrite AGENTS.md — Section 1 (Mission & Identity)

**Files:**
- Modify: `AGENTS.md:1-17`

**Interfaces:**
- Consumes: None (first section)
- Produces: New Section 1 content for AGENTS.md

- [ ] **Step 1: Replace Section 1 content**

Replace lines 1-17 of AGENTS.md with:

```markdown
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
```

- [ ] **Step 2: Verify the replacement**

Read `AGENTS.md` lines 1-25 and confirm Section 1 is correctly replaced.

- [ ] **Step 3: Commit**

```bash
git add AGENTS.md
git commit -m "docs: rewrite AGENTS.md Section 1 — Mission & Identity"
```

---

### Task 2: Rewrite AGENTS.md — Section 2 (User Roles & Portals)

**Files:**
- Modify: `AGENTS.md` (append after Section 1)

**Interfaces:**
- Consumes: Section 1 (mission statement)
- Produces: Section 2 content

- [ ] **Step 1: Replace Section 2 content**

Replace the existing "Multi-Agent Topology" section (lines 20-29) with:

```markdown
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
```

- [ ] **Step 2: Verify the replacement**

Read `AGENTS.md` and confirm Section 2 replaces the old "Multi-Agent Topology" table.

- [ ] **Step 3: Commit**

```bash
git add AGENTS.md
git commit -m "docs: rewrite AGENTS.md Section 2 — User Roles & Portals"
```

---

### Task 3: Rewrite AGENTS.md — Section 3 (Core Services)

**Files:**
- Modify: `AGENTS.md` (append after Section 2)

**Interfaces:**
- Consumes: Section 2 (user roles)
- Produces: Section 3 content

- [ ] **Step 1: Replace Section 3 content**

Replace the existing "Core Workflows" section (lines 33-52) with:

```markdown
---

## 3. Core Services

| Service | Description | Status |
|---------|-------------|--------|
| **Specialist Opinions** | Submit slides, scans, or reports → matched to board-certified specialist → written opinion within 24-48h | `Planned` |
| **Result Interpretation** | Already have results but unclear → plain-language written explanation from qualified specialist | `Planned` |
| **Follow-up Consultations** | After receiving report, patient asks questions → AI answers within scope, or book live consultation | `Planned` |
| **Lab Test Trend Analysis** | Repeat lab tests tracked longitudinally → AI flags statistically significant changes over time | `Planned` |
```

- [ ] **Step 2: Verify the replacement**

Read `AGENTS.md` and confirm Section 3 replaces the old "Core Workflows" section.

- [ ] **Step 3: Commit**

```bash
git add AGENTS.md
git commit -m "docs: rewrite AGENTS.md Section 3 — Core Services"
```

---

### Task 4: Rewrite AGENTS.md — Section 4 (AI Feature Layer)

**Files:**
- Modify: `AGENTS.md` (append after Section 3)

**Interfaces:**
- Consumes: Section 3 (services)
- Produces: Section 4 content

- [ ] **Step 1: Add Section 4 after Section 3**

```markdown
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
```

- [ ] **Step 2: Verify the addition**

Read `AGENTS.md` and confirm Section 4 is present after Section 3.

- [ ] **Step 3: Commit**

```bash
git add AGENTS.md
git commit -m "docs: add AGENTS.md Section 4 — AI Feature Layer"
```

---

### Task 5: Rewrite AGENTS.md — Section 5 (Core Workflows)

**Files:**
- Modify: `AGENTS.md` (append after Section 4)

**Interfaces:**
- Consumes: Section 4 (AI features)
- Produces: Section 5 content

- [ ] **Step 1: Add Section 5 after Section 4**

```markdown
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
```

- [ ] **Step 2: Verify the addition**

Read `AGENTS.md` and confirm Section 5 is present.

- [ ] **Step 3: Commit**

```bash
git add AGENTS.md
git commit -m "docs: add AGENTS.md Section 5 — Core Workflows"
```

---

### Task 6: Rewrite AGENTS.md — Section 6 (Database Schema)

**Files:**
- Modify: `AGENTS.md` (append after Section 5)

**Interfaces:**
- Consumes: Existing Prisma schema (`prisma/schema.prisma`)
- Produces: Section 6 content

- [ ] **Step 1: Add Section 6 after Section 5**

```markdown
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
```

- [ ] **Step 2: Verify the addition**

Read `AGENTS.md` and confirm Section 6 is present.

- [ ] **Step 3: Commit**

```bash
git add AGENTS.md
git commit -m "docs: add AGENTS.md Section 6 — Database Schema"
```

---

### Task 7: Rewrite AGENTS.md — Section 7 (Security & Compliance)

**Files:**
- Modify: `AGENTS.md` (append after Section 6)

**Interfaces:**
- Consumes: Section 6 (database schema, AuditLog model)
- Produces: Section 7 content

- [ ] **Step 1: Add Section 7 after Section 6**

```markdown
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
```

- [ ] **Step 2: Verify the addition**

Read `AGENTS.md` and confirm Section 7 is present.

- [ ] **Step 3: Commit**

```bash
git add AGENTS.md
git commit -m "docs: add AGENTS.md Section 7 — Security & Compliance"
```

---

### Task 8: Rewrite AGENTS.md — Section 8 (Edge Cases)

**Files:**
- Modify: `AGENTS.md` (append after Section 7)

**Interfaces:**
- Consumes: Section 7 (compliance framework)
- Produces: Section 8 content (final section)

- [ ] **Step 1: Add Section 8 after Section 7**

```markdown
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

### Phase 1: Foundation ✅ Current
* Database schema updates (new models and enums)
* Patient registration and case creation
* File upload with encryption
* Basic case status tracking

### Phase 2: Specialist Portal
* Specialist registration and verification
* Case routing (manual first, then AI)
* Opinion writing and signing
* Report delivery

### Phase 3: AI Features
* Intelligent case routing
* AI pre-screening
* Plain-language summary generation

### Phase 4: Advanced AI
* Multi-opinion synthesis
* Follow-up Q&A
* Result trend analysis

### Phase 5: Compliance & Scale
* Full audit logging
* GDPR/HIPAA compliance controls
* Dispute resolution workflow
* Edge case handling automation
```

- [ ] **Step 2: Verify the complete file**

Read the entire `AGENTS.md` file and confirm all 8 sections are present and correctly ordered.

- [ ] **Step 3: Final commit**

```bash
git add AGENTS.md
git commit -m "docs: complete AGENTS.md rewrite — all 8 sections"
```

---

### Task 9: Verify AGENTS.md Completeness

**Files:**
- Read: `AGENTS.md` (full file)
- Read: `docs/superpowers/specs/2026-07-18-agents-md-redesign.md` (spec)

**Interfaces:**
- Consumes: All previous tasks (Sections 1-8)
- Produces: Verification that AGENTS.md matches the spec

- [ ] **Step 1: Read the full AGENTS.md**

Read the complete `AGENTS.md` file from start to finish.

- [ ] **Step 2: Cross-check against spec**

Verify each section in AGENTS.md matches the corresponding section in the spec:
- Section 1: Mission matches spec Section 1
- Section 2: Roles match spec Section 2
- Section 3: Services match spec Section 3
- Section 4: AI features match spec Section 4
- Section 5: Workflows match spec Section 5
- Section 6: Schema matches spec Section 6
- Section 7: Compliance matches spec Section 7
- Section 8: Edge cases match spec Section 8

- [ ] **Step 3: Check for placeholders**

Search AGENTS.md for any "TBD", "TODO", or incomplete sections. Fix if found.

- [ ] **Step 4: Final verification commit (if changes were made)**

```bash
git add AGENTS.md
git commit -m "docs: AGENTS.md verification and cleanup"
```
