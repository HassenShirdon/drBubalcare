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

## 5. Security & Compliance Guardrails

As a health-tech platform handling sensitive Protected Health Information (PHI), the agent architecture enforces strict data handling protocols:

* **Zero-Retention Memory:** Worker agents are instantiated amnesic. They fetch context directly from secure Supabase queries per session and do not retain cross-session memory in the LLM context window.
* **Hallucination Mitigation (Grounding):** The Lab Analysis Agent is strictly forbidden from offering definitive clinical diagnoses. All agent outputs are explicitly watermarked as "AI-Generated Drafts" requiring human physician sign-off (HITL).
* **Encrypted Payloads:** When passing file URLs (S3/Supabase Buckets) to the Vision Model for extraction, the system utilizes short-lived, signed URLs that expire immediately after the extraction task is complete.
