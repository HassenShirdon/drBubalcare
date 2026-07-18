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

## 3. Core Workflows

### 3.1 Lab Test Analysis & Risk Flagging

When a patient uploads a lab report via `/lab-analysis`, the system executes an automated extraction and interpretation pipeline.

1. **Ingestion:** Document is uploaded and logged in `medical_records` with `status = 'pending_extraction'`.
2. **Extraction (Lab Agent):** The agent reads the PDF/Image, extracts tabular data (Test Name, Value, Normal Range).
3. **Risk Flagging (Lab Agent):** Compares `result_value` against `normal_range`. If the value falls outside parameters, the agent sets `is_abnormal = TRUE`.
4. **Drafting:** Generates a patient-friendly interpretation (e.g., *"Your HbA1c is 7.2% – above normal range"*).
5. **Human-in-the-Loop (HITL):** The extracted structured data and drafted interpretation are routed to the Doctor Dashboard for one-click approval before saving to the `lab_tests` table.

### 3.2 The Intelligent Dossier (Second Opinions)

To facilitate seamless global second opinions without administrative bloat, the system automatically prepares the case for the reviewing doctor.

1. **Aggregation:** The Dossier Synthesizer collects the original diagnosis, all uploaded `medical_records`, and patient history from the database.
2. **Normalization:** Messy, unstructured doctor notes are translated and structured into a standard chronological medical timeline.
3. **Smart Matching:** Based on the synthesized summary, the system queries the `doctors` table to recommend the best match (e.g., `specialization = 'Cardiology'` AND `is_global_network = TRUE`).
4. **Delivery:** The generated "Intelligent Dossier" is attached to the `second_opinions` record with `status = 'under_review'`, ready for the specialist.

---

## 4. Database Integration & State Management

Agents require robust access control and state persistence. The system interfaces directly with the PostgreSQL/Supabase schema defined in the core PRD.

### Role-Based Data Access (RBA)

* **Patients (`role = 'patient'`):**
* Agents can read: `patients` profile, own `appointments`, `medical_records`, `lab_tests`, `second_opinions`.
* Agents can write: New `medical_records` (uploads), initial `appointments` booking requests.


* **Doctors (`role = 'doctor'`):**
* Agents can read: Assigned patient dossiers, `appointments`, `medical_records`.
* Agents can write: Updates to `lab_tests` (confirming interpretations), `second_opinions` (submitting recommendations).


* **Admins (`role = 'admin'`):**
* Agents can read/write: Global platform metrics, `blog_posts` generation, system health.



### Agent State Transitions

Agents track their task progress by updating the `status` enums in the database:

* `appointments.status`: Transitions from `pending` ➔ `confirmed` (via Supervisor Agent scheduling).
* `second_opinions.status`: Transitions from `submitted` ➔ `under_review` (via Dossier Agent).

---

## 5. Security & Compliance Guardrails

As a health-tech platform handling sensitive Protected Health Information (PHI), the agent architecture enforces strict data handling protocols:

* **Zero-Retention Memory:** Worker agents are instantiated amnesic. They fetch context directly from secure Supabase queries per session and do not retain cross-session memory in the LLM context window.
* **Hallucination Mitigation (Grounding):** The Lab Analysis Agent is strictly forbidden from offering definitive clinical diagnoses. All agent outputs are explicitly watermarked as "AI-Generated Drafts" requiring human physician sign-off (HITL).
* **Encrypted Payloads:** When passing file URLs (S3/Supabase Buckets) to the Vision Model for extraction, the system utilizes short-lived, signed URLs that expire immediately after the extraction task is complete.
