# Training Materials Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create 24 training material files covering patient, specialist, and admin training tracks with consistent module structure, practice scenarios, knowledge checks, and certification system.

**Architecture:** Linear module progression approach with role-specific training tracks. Each module follows a consistent template: learning objectives → content → practice scenario → common mistakes → knowledge check. Shared templates ensure consistency across all modules.

**Tech Stack:** Markdown documentation files only. No code dependencies.

## Global Constraints

- All files created as Markdown in `docs/manual/training/` directory
- Module structure follows template in `docs/superpowers/specs/2026-07-20-training-materials-design.md:80-157`
- Pass thresholds: 80% for patients, 100% for specialists/admins
- 3 questions per knowledge check
- `[PLACEHOLDER: screenshot/video]` markers for visual content
- Cross-reference existing `docs/manual/guides/` for detailed feature documentation
- Content follows writing style guidelines: patients (friendly, clear), specialists (professional, clinical), admins (operational, direct)

---

## File Structure

```
docs/manual/training/
├── README.md                          # Training hub
├── patient-training/
│   ├── 01-getting-started.md
│   ├── 02-your-first-case.md
│   ├── 03-uploading-records.md
│   ├── 04-understanding-reports.md
│   ├── 05-follow-up-and-trends.md
│   ├── 06-account-and-privacy.md
│   └── quiz-answers.md
├── specialist-training/
│   ├── 01-platform-overview.md
│   ├── 02-case-review-basics.md
│   ├── 03-writing-opinions.md
│   ├── 04-ai-features.md
│   ├── 05-critical-findings.md
│   ├── 06-availability-and-capacity.md
│   └── quiz-answers.md
├── admin-training/
│   ├── 01-dashboard-operations.md
│   ├── 02-specialist-verification.md
│   ├── 03-case-routing.md
│   ├── 04-dispute-resolution.md
│   ├── 05-compliance-audit.md
│   └── quiz-answers.md
└── shared/
    ├── module-template.md
    ├── quiz-template.md
    └── glossary.md
```

---

## Task 1: Create Directory Structure and Shared Templates

**Files:**
- Create: `docs/manual/training/README.md`
- Create: `docs/manual/training/shared/module-template.md`
- Create: `docs/manual/training/shared/quiz-template.md`
- Create: `docs/manual/training/shared/glossary.md`

**Interfaces:**
- Consumes: Spec at `docs/superpowers/specs/2026-07-20-training-materials-design.md`
- Produces: Template structure for all subsequent tasks

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p docs/manual/training/{patient-training,specialist-training,admin-training,shared}
```

- [ ] **Step 2: Create module template**

Create `docs/manual/training/shared/module-template.md`:

```markdown
# Module N: [Title]

**Role:** Patient | Specialist | Admin
**Duration:** ~X minutes
**Prerequisites:** [Previous module name or "None"]

## Learning Objectives

After completing this module, you will be able to:

1. [Specific, measurable objective]
2. [Specific, measurable objective]
3. [Specific, measurable objective]

## [Content Section 1]

[Explanatory text with step-by-step instructions]

> **[PLACEHOLDER: screenshot/video]** — [Description of what to capture]

## [Content Section 2]

[Continued content...]

## Practice Scenario

**Scenario:** [Realistic situation description]

**Your task:**
1. [Step-by-step exercise]
2. [Step-by-step exercise]
3. [Step-by-step exercise]

**Expected outcome:** [What success looks like]

## Common Mistakes

| Mistake | Why It's Wrong | What to Do Instead |
|---------|---------------|-------------------|
| [Mistake 1] | [Reason] | [Correct approach] |
| [Mistake 2] | [Reason] | [Correct approach] |

## Knowledge Check

1. **[Question 1]**
   - A) [Option]
   - B) [Option]
   - C) [Option]
   - D) [Option]
   - **Correct answer:** [X] — [Brief explanation]

2. **[Question 2]**
   [Same format...]

3. **[Question 3]**
   [Same format...]

## Summary

In this module, you learned:
- [Key takeaway 1]
- [Key takeaway 2]
- [Key takeaway 3]

## Next Steps

→ **Module N+1:** [Title] — [Brief description of what's next]

---

*Estimated completion time: X minutes*
*Pass threshold: 80% (2/3 correct on knowledge check)*
```

- [ ] **Step 3: Create quiz template**

Create `docs/manual/training/shared/quiz-template.md`:

```markdown
# [Role] Training — Quiz Answers

## Module N: [Title]

1. **[Question]**
   - **Correct answer:** [X]
   - **Explanation:** [Brief explanation]

2. **[Question]**
   - **Correct answer:** [X]
   - **Explanation:** [Brief explanation]

3. **[Question]**
   - **Correct answer:** [X]
   - **Explanation:** [Brief explanation]
```

- [ ] **Step 4: Create glossary**

Create `docs/manual/training/shared/glossary.md`:

```markdown
# Glossary

## Platform Terms

| Term | Definition |
|------|------------|
| **Case** | A patient's request for a specialist opinion on their medical records |
| **Case Status** | The current stage of a case (OPEN → AI_PRE_SCREENED → UNDER_REVIEW → OPINION_READY → CLOSED) |
| **Service Type** | The type of review requested (Specialist Opinion, Result Interpretation, Direct Consultation, Trend Analysis) |
| **Panel Review** | A case reviewed by 2-4 specialists, with AI-generated synthesis |
| **Follow-up Q&A** | Patient questions answered by AI within the scope of the written opinion |

## AI Features

| Term | Definition |
|------|------------|
| **AI Pre-screening** | Automated analysis of clinical records before specialist review; flags key findings |
| **Plain-language Summary** | AI-generated translation of specialist opinion into patient-friendly language |
| **Multi-opinion Synthesis** | AI-generated consensus summary when multiple specialists review the same case |
| **Trend Analysis** | AI-powered longitudinal tracking of lab results with significance flagging |

## Medical Terms

| Term | Definition |
|------|------------|
| **DICOM** | Digital Imaging and Communications in Medicine — standard format for medical images |
| **Histopathology** | Study of tissues under a microscope |
| **Subspecialty** | A focused area within a medical specialty (e.g., Dermatopathology within Pathology) |
| **Clinical Impression** | A specialist's overall assessment based on reviewed records |
| **Differential Diagnosis** | A list of possible conditions that could explain the findings |

## Compliance Terms

| Term | Definition |
|------|------------|
| **GDPR** | General Data Protection Regulation — EU data privacy law |
| **HIPAA** | Health Insurance Portability and Accountability Act — US health data privacy law |
| **PHI** | Protected Health Information — any individually identifiable health information |
| **Audit Log** | Record of who accessed what data, when, and for what purpose |
| **Consent Management** | User control over what data processing they authorize |
```

- [ ] **Step 5: Create README**

Create `docs/manual/training/README.md`:

```markdown
# Training Materials

Welcome to the Dr. Bubal Care training program. These self-paced modules will help you become proficient using the platform.

## Training Tracks

### Patient Training
Learn to use the Dr. Bubal Care patient portal to request specialist opinions, upload records, and understand your reports.

| Module | Title | Duration |
|--------|-------|----------|
| 1 | Getting Started | ~10 min |
| 2 | Your First Case | ~15 min |
| 3 | Uploading Records | ~10 min |
| 4 | Understanding Reports | ~15 min |
| 5 | Follow-up & Trends | ~10 min |
| 6 | Account & Privacy | ~10 min |

**Start:** [Patient Training](patient-training/01-getting-started.md)

---

### Specialist Training
Learn to use the Dr. Bubal Care specialist portal to review cases, write opinions, and use AI features.

| Module | Title | Duration |
|--------|-------|----------|
| 1 | Platform Overview | ~10 min |
| 2 | Case Review Basics | ~20 min |
| 3 | Writing Opinions | ~20 min |
| 4 | AI Features | ~15 min |
| 5 | Critical Findings | ~10 min |
| 6 | Availability & Capacity | ~10 min |

**Start:** [Specialist Training](specialist-training/01-platform-overview.md)

---

### Admin Training
Learn to use the Dr. Bubal Care admin portal to manage cases, verify specialists, and handle disputes.

| Module | Title | Duration |
|--------|-------|----------|
| 1 | Dashboard Operations | ~15 min |
| 2 | Specialist Verification | ~15 min |
| 3 | Case Routing | ~15 min |
| 4 | Dispute Resolution | ~15 min |
| 5 | Compliance & Audit | ~15 min |

**Start:** [Admin Training](admin-training/01-dashboard-operations.md)

---

## Certification

After completing all modules in a track, you'll receive a Certificate of Completion:

- **Patient:** 80% pass threshold (2/3 correct per module)
- **Specialist:** 100% pass threshold (3/3 correct per module)
- **Admin:** 100% pass threshold (3/3 correct per module)

Certificates are valid for 12 months and stored in your profile.

## Resources

- [Glossary](shared/glossary.md) — Medical and platform terminology
- [Module Template](shared/module-template.md) — Structure used for all modules
- [Quiz Template](shared/quiz-template.md) — Format for quiz answers
- [Reference Manuals](../guides/) — Detailed feature documentation
```

- [ ] **Step 6: Commit**

```bash
git add docs/manual/training/
git commit -m "docs: add training directory structure and shared templates"
```

---

## Task 2: Create Patient Training Modules 1-2

**Files:**
- Create: `docs/manual/training/patient-training/01-getting-started.md`
- Create: `docs/manual/training/patient-training/02-your-first-case.md`

**Interfaces:**
- Consumes: Module template from Task 1
- Produces: First two patient modules for subsequent modules to reference

- [ ] **Step 1: Create Module 1 — Getting Started**

Create `docs/manual/training/patient-training/01-getting-started.md`:

```markdown
# Module 1: Getting Started

**Role:** Patient
**Duration:** ~10 minutes
**Prerequisites:** None

## Learning Objectives

After completing this module, you will be able to:

1. Register a Dr. Bubal Care account
2. Set up your patient profile
3. Understand the "AI surfaces; specialists decide" principle
4. Navigate the patient portal dashboard

## Welcome to Dr. Bubal Care

Dr. Bubal Care is an AI-assisted diagnostic coordination platform. It connects you with board-certified specialists around the world. AI helps coordinate your case, but every clinical decision is made by a human specialist.

> **[PLACEHOLDER: screenshot]** — Patient portal homepage showing registration button

## Creating Your Account

1. Go to `patient.drbubalcare.com`
2. Click **"Get Started"** or **"Register"**
3. Fill in your details:
   - Full name
   - Email address
   - Country of residence
   - Password (minimum 8 characters)
4. Click **"Create Account"**
5. Check your email for a verification link
6. Click the link to verify your email

> **[PLACEHOLDER: screenshot]** — Registration form with fields highlighted

**Registration takes under 2 minutes.** You do not need to provide medical credentials — only basic personal information.

## Understanding the Platform

### Core Principle

*"AI surfaces; specialists decide."*

This means:
- **AI assists** — It pre-screens your records, routes your case to the right specialist, and translates medical language into plain English
- **Specialists decide** — Every clinical opinion is written and signed by a board-certified human specialist
- **You stay informed** — You receive notifications at every step and can track your case status

### Your Dashboard

After logging in, you'll see your dashboard:

- **Active Cases** — Cases currently in progress
- **Completed Cases** — Past cases with opinions
- **Notifications** — Updates on case status changes
- **Quick Actions** — Start a new case, view lab trends

> **[PLACEHOLDER: screenshot]** — Patient dashboard with key sections labeled

## Practice Scenario

**Scenario:** You've just heard about Dr. Bubal Care and want to create an account.

**Your task:**
1. Navigate to `patient.drbubalcare.com`
2. Click "Get Started"
3. Fill in your registration details
4. Verify your email address
5. Log in to your new account

**Expected outcome:** You have a verified account and can see the patient dashboard.

## Common Mistakes

| Mistake | Why It's Wrong | What to Do Instead |
|---------|---------------|-------------------|
| Using a work email you don't check | You'll miss important case notifications | Use a personal email you check regularly |
| Skipping email verification | You can't access your account without verification | Check your inbox and click the verification link |
| Sharing your password | Security risk | Keep your password private and use a strong one |

## Knowledge Check

1. **What does "AI surfaces; specialists decide" mean?**
   - A) AI makes all clinical decisions
   - B) AI assists with coordination, but specialists make clinical decisions
   - C) Specialists do all the work without AI
   - D) AI and specialists share equal responsibility
   - **Correct answer:** B — AI handles coordination, but every clinical decision is made by a human specialist.

2. **How long does registration take?**
   - A) 10-15 minutes
   - B) 5-10 minutes
   - C) Under 2 minutes
   - D) About 30 seconds
   - **Correct answer:** C — Registration is designed to be quick, taking under 2 minutes.

3. **What information do you need to register?**
   - A) Medical records and insurance information
   - B) Full name, email, country, and password
   - C) Medical credentials and license number
   - D) Credit card information
   - **Correct answer:** B — Only basic personal information is required for registration.

## Summary

In this module, you learned:
- Dr. Bubal Care connects patients with specialists using AI coordination
- Registration takes under 2 minutes with just basic information
- "AI surfaces; specialists decide" means AI assists, but specialists make clinical decisions
- Your dashboard shows active cases, notifications, and quick actions

## Next Steps

→ **Module 2: Your First Case** — Learn to create a case, choose a service, and submit your first request for a specialist opinion.

---

*Estimated completion time: 10 minutes*
*Pass threshold: 80% (2/3 correct on knowledge check)*
```

- [ ] **Step 2: Create Module 2 — Your First Case**

Create `docs/manual/training/patient-training/02-your-first-case.md`:

```markdown
# Module 2: Your First Case

**Role:** Patient
**Duration:** ~15 minutes
**Prerequisites:** Module 1: Getting Started

## Learning Objectives

After completing this module, you will be able to:

1. Create a new case on the platform
2. Choose the appropriate service type
3. Describe your case effectively
4. Understand the case status flow

## What Is a Case?

A case is your request for a specialist opinion on your medical records. When you create a case, you're asking a board-certified specialist to review your information and provide their professional assessment.

> **[PLACEHOLDER: screenshot]** — "Start a Case" button on dashboard

## Step 1: Choose a Service Type

Click **"Start a Case"** on your dashboard. You'll see four service types:

| Service Type | What You Get | Best For |
|-------------|-------------|----------|
| **Specialist Opinion** | Written opinion from a board-certified specialist | Slides, scans, or reports reviewed by an expert |
| **Result Interpretation** | Plain-language explanation of existing results | You have lab results but need help understanding them |
| **Direct Consultation** | Live video consultation with a specialist | Need to discuss your case directly with a specialist |
| **Trend Analysis** | Longitudinal tracking of lab results over time | Repeat lab tests that need to be tracked for changes |

> **[PLACEHOLDER: screenshot]** — Service type selection screen

**For your first case, choose "Specialist Opinion"** — this is the most common service type.

## Step 2: Describe Your Case

After selecting a service type, you'll describe your situation:

1. **Select the relevant body system or specialty area** (e.g., Pathology, Radiology, Oncology)
2. **Provide a brief description** of your situation
3. **Note any urgency** (Routine, Soon, Urgent)

> **[PLACEHOLDER: screenshot]** — Case description form

**Tips for describing your case:**
- Be specific about your symptoms or condition
- Mention when you first noticed the issue
- Include any relevant medical history
- Note if you have prior records to upload

## Step 3: Upload Records (Preview)

You'll upload your medical records in the next module. For now, know that you can upload:
- Medical images (JPEG, PNG, TIFF)
- DICOM files (.dcm)
- Documents (PDF, DOCX)
- Lab results (PDF, CSV)

## Step 4: Choose a Service and Pay

1. Review your case details
2. Choose **single-expert** or **panel review** (2-4 specialists)
3. See the exact price before confirming
4. Pay by card (USD) or local payment method
5. Your case begins immediately after payment confirmation

> **[PLACEHOLDER: screenshot]** — Payment screen with price breakdown

**Panel Review** gives you opinions from multiple specialists. The AI synthesizes areas of agreement and disagreement.

## Case Status Flow

Once submitted, your case moves through these stages:

```
OPEN → AI_PRE_SCREENED → UNDER_REVIEW → OPINION_READY → CLOSED
```

| Status | What It Means |
|--------|--------------|
| `OPEN` | Case submitted and awaiting processing |
| `AI_PRE_SCREENED` | AI has analyzed your records and flagged key findings for the specialist |
| `UNDER_REVIEW` | A specialist is reviewing your case |
| `OPINION_READY` | Your specialist's opinion is available for viewing |
| `CLOSED` | Case is complete (opinion delivered and acknowledged) |

You receive email notifications at each status change.

> **[PLACEHOLDER: screenshot]** — Case status tracker showing all stages

## Practice Scenario

**Scenario:** You have abnormal blood work from your local doctor and want a specialist opinion.

**Your task:**
1. Click "Start a Case" on your dashboard
2. Select "Specialist Opinion" as the service type
3. Choose "Pathology" as the specialty area
4. Write a brief description: "Abnormal CBC results from my local doctor. Elevated white blood cells and low platelets. Need specialist review."
5. Set urgency to "Soon"
6. Review the price and confirm

**Expected outcome:** Your case is created and you see the case status tracker showing `OPEN`.

## Common Mistakes

| Mistake | Why It's Wrong | What to Do Instead |
|---------|---------------|-------------------|
| Choosing "Direct Consultation" when you need a written opinion | Consultation is live video, not a written assessment | Choose "Specialist Opinion" for written review |
| Being vague in the description | Specialist needs context to provide accurate opinion | Be specific about symptoms, timeline, and concerns |
| Selecting wrong specialty area | Case may be routed to wrong specialist | Research which specialty matches your condition |

## Knowledge Check

1. **What are the four service types?**
   - A) Specialist Opinion, Result Interpretation, Direct Consultation, Trend Analysis
   - B) Consultation, Review, Analysis, Opinion
   - C) Primary, Secondary, Emergency, Routine
   - D) First Opinion, Second Opinion, Third Opinion, Final Opinion
   - **Correct answer:** A — The four service types are Specialist Opinion, Result Interpretation, Direct Consultation, and Trend Analysis.

2. **What does `AI_PRE_SCREENED` status mean?**
   - A) A specialist has reviewed your case
   - B) AI has analyzed your records and flagged key findings
   - C) Your case is closed
   - D) Your payment is being processed
   - **Correct answer:** B — `AI_PRE_SCREENED` means AI has analyzed your records and prepared a pre-screening for the specialist.

3. **What's the difference between single-expert and panel review?**
   - A) Single-expert is faster, panel review is slower
   - B) Single-expert gives one opinion, panel review gives 2-4 opinions with synthesis
   - C) They're the same thing
   - D) Panel review costs more but gives the same result
   - **Correct answer:** B — Single-expert gives one specialist opinion; panel review gives 2-4 opinions with AI-generated synthesis.

## Summary

In this module, you learned:
- A case is your request for a specialist opinion on medical records
- Four service types are available: Specialist Opinion, Result Interpretation, Direct Consultation, Trend Analysis
- Case status flows from OPEN → AI_PRE_SCREENED → UNDER_REVIEW → OPINION_READY → CLOSED
- Panel review provides multiple opinions with AI synthesis

## Next Steps

→ **Module 3: Uploading Records** — Learn to upload medical files correctly, understand security measures, and name files descriptively.

---

*Estimated completion time: 15 minutes*
*Pass threshold: 80% (2/3 correct on knowledge check)*
```

- [ ] **Step 3: Commit**

```bash
git add docs/manual/training/patient-training/01-getting-started.md docs/manual/training/patient-training/02-your-first-case.md
git commit -m "docs: add patient training modules 1-2"
```

---

## Task 3: Create Patient Training Modules 3-4

**Files:**
- Create: `docs/manual/training/patient-training/03-uploading-records.md`
- Create: `docs/manual/training/patient-training/04-understanding-reports.md`

**Interfaces:**
- Consumes: Module template from Task 1, modules 1-2 from Task 2
- Produces: Modules 3-4 for patient track continuity

- [ ] **Step 1: Create Module 3 — Uploading Records**

Create `docs/manual/training/patient-training/03-uploading-records.md`:

```markdown
# Module 3: Uploading Records

**Role:** Patient
**Duration:** ~10 minutes
**Prerequisites:** Module 2: Your First Case

## Learning Objectives

After completing this module, you will be able to:

1. Upload medical files to your case
2. Name files descriptively for easy reference
3. Understand file security and encryption
4. Manage file size and quantity limits

## Supported File Types

| File Type | Examples | Use Case |
|-----------|----------|----------|
| **Medical images** | JPEG, PNG, TIFF | Histopathology slides, X-rays, ultrasounds |
| **DICOM files** | `.dcm` | CT scans, MRI scans, PET scans |
| **Documents** | PDF, DOCX | Lab reports, clinical notes, referral letters |
| **Lab results** | PDF, CSV | Blood work, urinalysis, genetic tests |

> **[PLACEHOLDER: screenshot]** — File upload interface showing supported types

## Uploading Files

1. In your case, click **"Upload Records"**
2. Drag and drop files or click to browse
3. Name each file descriptively
4. Wait for upload confirmation
5. Add notes to each file if needed

> **[PLACEHOLDER: screenshot]** — File upload drag-and-drop interface

### Naming Files Descriptively

**Good names:**
- `CBC Results - January 2026.pdf`
- `Chest X-Ray - Right Side.jpg`
- `Pathology Report - Dr. Smith.pdf`

**Bad names:**
- `file1.pdf`
- `scan.jpg`
- `document.pdf`

**Why it matters:** Descriptive names help specialists quickly identify relevant files and reference them in their opinions.

### Adding Notes

After uploading, you can add notes to each file:
- "This is the latest scan from my oncologist"
- "Shows progression since last visit"
- "Relevant family history included"

## File Size Limits

| Limit | Value |
|-------|-------|
| Maximum file size | 50 MB per file |
| Maximum files per case | 20 files |
| Total storage | 500 MB per patient account |

If your file exceeds 50 MB, try compressing it or contact support for assistance.

## Security and Encryption

Your files are protected by multiple security measures:

1. **Encryption in transit** — Files are encrypted during upload using TLS 1.3
2. **Encryption at rest** — Stored files are encrypted using AES-256
3. **Signed URLs** — Short-lived, expiring URLs for file access
4. **Audit logging** — Every file access is logged for compliance

> **[PLACEHOLDER: diagram]** — File security flow showing encryption at each stage

**Your data is secure.** AI processing strips all personally identifiable information (names, date of birth, medical record numbers) before any analysis.

## Practice Scenario

**Scenario:** You have a lab report PDF and an X-ray image to upload for your case.

**Your task:**
1. Open your case
2. Click "Upload Records"
3. Upload the lab report PDF, naming it "CBC Results - January 2026.pdf"
4. Upload the X-ray image, naming it "Chest X-Ray - Right Side.jpg"
5. Add a note to the X-ray: "Shows abnormal shadow in right lower lobe"
6. Verify both files appear in your case with correct names

**Expected outcome:** Both files are uploaded with descriptive names and the X-ray has a note attached.

## Common Mistakes

| Mistake | Why It's Wrong | What to Do Instead |
|---------|---------------|-------------------|
| Using vague file names | Specialist can't identify files quickly | Use descriptive names with date and type |
| Uploading low-quality images | Specialist can't see details clearly | Use original, uncompressed images when possible |
| Not adding relevant notes | Missing context for the specialist | Add notes explaining significance or history |
| Exceeding file size limits | Upload will fail | Check file size before uploading; compress if needed |

## Knowledge Check

1. **What is the maximum file size per upload?**
   - A) 10 MB
   - B) 25 MB
   - C) 50 MB
   - D) 100 MB
   - **Correct answer:** C — The maximum file size is 50 MB per file.

2. **Why should you name files descriptively?**
   - A) It's required by the system
   - B) It helps specialists quickly identify and reference files
   - C) It makes files upload faster
   - D) It reduces file size
   - **Correct answer:** B — Descriptive names help specialists identify relevant files and reference them in opinions.

3. **What security protects your uploaded files?**
   - A) Only password protection
   - B) Encryption in transit, encryption at rest, signed URLs, and audit logging
   - C) Files are stored publicly
   - D) No security measures are applied
   - **Correct answer:** B — Files are protected by multiple layers: TLS encryption during transfer, AES-256 at rest, signed URLs for access, and audit logging.

## Summary

In this module, you learned:
- Supported file types include images, DICOM, documents, and lab results
- Name files descriptively with type and date for easy identification
- Files are encrypted in transit and at rest with multiple security measures
- Maximum limits: 50 MB per file, 20 files per case, 500 MB total storage

## Next Steps

→ **Module 4: Understanding Reports** — Learn to read specialist opinions, understand plain-language summaries, and interpret panel synthesis.

---

*Estimated completion time: 10 minutes*
*Pass threshold: 80% (2/3 correct on knowledge check)*
```

- [ ] **Step 2: Create Module 4 — Understanding Reports**

Create `docs/manual/training/patient-training/04-understanding-reports.md`:

```markdown
# Module 4: Understanding Reports

**Role:** Patient
**Duration:** ~15 minutes
**Prerequisites:** Module 3: Uploading Records

## Learning Objectives

After completing this module, you will be able to:

1. Read and understand a specialist opinion
2. Interpret the plain-language summary
3. Understand panel synthesis (for multi-specialist reviews)
4. Know when to ask follow-up questions

## When Your Report Is Ready

When a specialist signs their opinion, you'll receive:
1. **Email notification** — "Your specialist opinion is ready"
2. **Portal notification** — Badge on your dashboard
3. **Status change** — Case status moves to `OPINION_READY`

> **[PLACEHOLDER: screenshot]** — Email notification and dashboard badge

## Specialist Opinion Structure

Every specialist opinion has three sections:

### 1. Clinical Findings

This section describes what the specialist observed in your records:
- Specific observations from your files
- Measurements, grades, or technical details
- References to specific files or images

**Example:**
> "The chest X-ray shows a 2.5cm opacity in the right lower lobe. No pleural effusion is noted. The cardiac silhouette is within normal limits."

### 2. Clinical Impression

This is the specialist's overall assessment:
- Their interpretation of the findings
- Possible diagnoses or conditions
- Confidence level and rationale

**Example:**
> "The opacity in the right lower lobe is concerning for a pulmonary nodule. Given the size and location, this warrants further investigation with CT imaging. Differential includes benign granuloma vs. malignant lesion."

### 3. Recommended Next Steps

This section suggests actions you should take:
- Additional tests or imaging
- Referrals to other specialists
- Follow-up timeline

**Example:**
> "Recommend CT chest with contrast for further characterization. Follow-up with pulmonology in 2 weeks. If any new symptoms develop (cough, hemoptysis, weight loss), seek immediate medical attention."

> **[PLACEHOLDER: screenshot]** — Specialist opinion showing all three sections

## Plain-Language Summary

Each opinion includes a plain-language summary that translates medical terminology into everyday language. This is written as if by a trusted GP — no medical jargon.

**Specialist opinion:**
> "The opacity in the right lower lobe is concerning for a pulmonary nodule."

**Plain-language summary:**
> "The X-ray shows a small spot in your right lung that needs further investigation. It could be something minor like a scar, but we need to do a CT scan to be sure."

> **[PLACEHOLDER: screenshot]** — Plain-language summary section

**The plain-language summary is not a diagnosis.** It's a translation of the specialist's technical opinion into words you can understand.

## Panel Synthesis (Multi-Specialist Reviews)

If you chose panel review (2-4 specialists), you'll also receive a synthesis when all opinions are received:

| Section | What It Shows |
|---------|--------------|
| **Areas of Agreement** | Where all specialists agree |
| **Areas of Disagreement** | Where specialists differ |
| **Consensus Summary** | Overall synthesis of opinions |

**Example:**
> "All three specialists agree that the nodule requires CT imaging. Two specialists recommend immediate CT, while one suggests waiting 3 months. All agree on pulmonology referral."

> **[PLACEHOLDER: screenshot]** — Panel synthesis showing agreement and disagreement

## Practice Scenario

**Scenario:** You've received your specialist opinion. Read through it and identify the key sections.

**Your task:**
1. Open your completed case
2. Read the specialist opinion
3. Identify the three main sections: findings, impression, next steps
4. Read the plain-language summary
5. Note any action items recommended by the specialist

**Expected outcome:** You can identify the three sections of the opinion and understand the plain-language summary.

## Common Mistakes

| Mistake | Why It's Wrong | What to Do Instead |
|---------|---------------|-------------------|
| Skipping the plain-language summary | It's the easiest way to understand your opinion | Always read the summary first, then the technical sections |
| Focusing only on the diagnosis | Opinion contains important context and next steps | Read all three sections completely |
| Ignoring recommended next steps | Delays in follow-up can affect outcomes | Note all action items and schedule them |
| Not asking questions when confused | You deserve to understand your health information | Use follow-up Q&A to clarify anything unclear |

## Knowledge Check

1. **What are the three sections of a specialist opinion?**
   - A) Diagnosis, Treatment, Prognosis
   - B) Clinical Findings, Clinical Impression, Recommended Next Steps
   - C) History, Examination, Assessment
   - D) Summary, Analysis, Conclusion
   - **Correct answer:** B — Every specialist opinion has three sections: Clinical Findings, Clinical Impression, and Recommended Next Steps.

2. **What is the plain-language summary?**
   - A) A simplified version of the specialist's opinion in everyday language
   - B) A second opinion from another specialist
   - C) A legal document about your case
   - D) An AI-generated diagnosis
   - **Correct answer:** A — The plain-language summary translates medical terminology into patient-friendly language, written as if by a trusted GP.

3. **What happens when multiple specialists review your case?**
   - A) Only the first opinion is shown
   - B) All opinions are shown but no synthesis
   - C) A synthesis is generated showing agreement and disagreement areas
   - D) The opinions are averaged into one
   - **Correct answer:** C — A multi-opinion synthesis shows areas of agreement, disagreement, and an overall consensus summary.

## Summary

In this module, you learned:
- Specialist opinions have three sections: findings, impression, and next steps
- Plain-language summaries translate medical terms into everyday language
- Panel reviews generate a synthesis showing agreement and disagreement
- Always read the full opinion and note recommended next steps

## Next Steps

→ **Module 5: Follow-up & Trends** — Learn to ask follow-up questions, view lab trends, and book direct consultations.

---

*Estimated completion time: 15 minutes*
*Pass threshold: 80% (2/3 correct on knowledge check)*
```

- [ ] **Step 3: Commit**

```bash
git add docs/manual/training/patient-training/03-uploading-records.md docs/manual/training/patient-training/04-understanding-reports.md
git commit -m "docs: add patient training modules 3-4"
```

---

## Task 4: Create Patient Training Modules 5-6 and Quiz Answers

**Files:**
- Create: `docs/manual/training/patient-training/05-follow-up-and-trends.md`
- Create: `docs/manual/training/patient-training/06-account-and-privacy.md`
- Create: `docs/manual/training/patient-training/quiz-answers.md`

**Interfaces:**
- Consumes: Module template from Task 1, modules 1-4 from Tasks 2-3
- Produces: Complete patient training track with quiz answers

- [ ] **Step 1: Create Module 5 — Follow-up & Trends**

Create `docs/manual/training/patient-training/05-follow-up-and-trends.md`:

```markdown
# Module 5: Follow-up & Trends

**Role:** Patient
**Duration:** ~10 minutes
**Prerequisites:** Module 4: Understanding Reports

## Learning Objectives

After completing this module, you will be able to:

1. Ask follow-up questions about your opinion
2. View and interpret lab trends
3. Book direct consultations with specialists
4. Understand scope limits for follow-up questions

## Follow-up Q&A

After receiving your opinion, you can ask follow-up questions:

1. Go to your completed case
2. Click **"Ask a Follow-up Question"**
3. Type your question in plain language
4. Submit and receive an AI-generated answer

> **[PLACEHOLDER: screenshot]** — Follow-up question interface

### Example Questions

**Good questions:**
- "What does 'pulmonary nodule' mean in plain language?"
- "How urgent is the CT scan recommended in my opinion?"
- "Should I see a pulmonologist or my regular doctor first?"

**Questions outside scope:**
- "Can you give me a second opinion on the diagnosis?" (requires new case)
- "Should I start medication before my CT scan?" (clinical decision)
- "What's the cost of treatment?" (depends on diagnosis)

### Scope Limits

The AI answers questions within the documented scope of the written opinion. It cannot:
- Provide new diagnoses or opinions
- Recommend treatments not mentioned in the opinion
- Override or expand the specialist's recommendations

**When a question falls outside scope**, you'll be directed to book a consultation for further clinical advice.

## Viewing Lab Trends

If you have repeat lab tests, the platform tracks them over time:

1. Navigate to **"Lab Trends"** in your dashboard
2. View charts showing your lab values over time
3. See AI-flagged significant changes highlighted
4. Click on any data point to see the specific result and date

> **[PLACEHOLDER: screenshot]** — Lab trends chart with highlighted changes

### Understanding Trend Alerts

| Alert Color | Meaning |
|-------------|---------|
| **Green** | Values within normal range |
| **Yellow** | Values slightly outside normal range |
| **Red** | Statistically significant change requiring attention |

The AI tracks statistically significant changes and alerts you and your care team.

## Booking Direct Consultations

For live conversations with specialists:

1. Go to **"Appointments"** in your dashboard
2. Browse available specialists
3. Select a specialist and view their availability
4. Choose a date and time slot
5. Confirm and pay
6. Receive calendar invitation and reminders

> **[PLACEHOLDER: screenshot]** — Appointment booking interface

### When to Book a Consultation

- You need to discuss your opinion in real-time
- The specialist recommended a consultation in their opinion
- You have complex questions beyond the opinion's scope
- You want a second opinion through live discussion

## Practice Scenario

**Scenario:** You've received your specialist opinion and want to ask a follow-up question.

**Your task:**
1. Open your completed case
2. Click "Ask a Follow-up Question"
3. Type: "The opinion mentions a CT scan. How soon should I get this done?"
4. Submit and read the AI response
5. Note any action items from the response

**Expected outcome:** You receive a helpful answer within the opinion's scope and know your next steps.

## Common Mistakes

| Mistake | Why It's Wrong | What to Do Instead |
|---------|---------------|-------------------|
| Asking for a new diagnosis in follow-up | AI can only answer within the written opinion's scope | Book a consultation for new clinical questions |
| Ignoring lab trend alerts | Significant changes may need attention | Review alerts promptly and follow recommended actions |
| Waiting too long to book consultations | Delays can affect outcomes | Book promptly when recommended by specialist |

## Knowledge Check

1. **What can the AI answer in follow-up questions?**
   - A) Any medical question you have
   - B) Questions within the documented scope of the written opinion
   - C) Questions about other specialists' opinions
   - D) New diagnoses and treatment recommendations
   - **Correct answer:** B — AI answers only within the scope of the written opinion. For new questions, book a consultation.

2. **What does a red alert on lab trends mean?**
   - A) Values are improving
   - B) Values are within normal range
   - C) Statistically significant change requiring attention
   - D) No change detected
   - **Correct answer:** C — Red alerts indicate statistically significant changes that may need medical attention.

3. **When should you book a direct consultation?**
   - A) Only when the specialist recommends it
   - B) When you need real-time discussion or have questions beyond the opinion's scope
   - C) Never — follow-up Q&A is always sufficient
   - D) Only for emergencies
   - **Correct answer:** B — Book consultations for real-time discussion or questions beyond the opinion's scope.

## Summary

In this module, you learned:
- Follow-up Q&A answers questions within the opinion's scope
- Lab trends track values over time with significance alerts
- Direct consultations provide live specialist conversations
- Book consultations for complex questions beyond the opinion's scope

## Next Steps

→ **Module 6: Account & Privacy** — Learn to manage your account, handle data deletion requests, and understand consent management.

---

*Estimated completion time: 10 minutes*
*Pass threshold: 80% (2/3 correct on knowledge check)*
```

- [ ] **Step 2: Create Module 6 — Account & Privacy**

Create `docs/manual/training/patient-training/06-account-and-privacy.md`:

```markdown
# Module 6: Account & Privacy

**Role:** Patient
**Duration:** ~10 minutes
**Prerequisites:** Module 5: Follow-up & Trends

## Learning Objectives

After completing this module, you will be able to:

1. Update your profile and account settings
2. Request data deletion under GDPR
3. Manage consent for AI processing
4. Understand your privacy rights

## Profile Management

Access your account settings from the dashboard menu:

| Setting | What You Can Do |
|---------|----------------|
| **Profile** | Update your name, email, and country |
| **Password** | Change your password |
| **Notifications** | Configure email and portal notification preferences |
| **Privacy** | Manage consent for AI processing and data usage |
| **Delete Account** | Request full data deletion (GDPR Article 17) |

> **[PLACEHOLDER: screenshot]** — Account settings page

### Email Changes

If you change your email address:
1. Enter your new email
2. You'll receive a verification link
3. Click the link to confirm the change
4. Your old email will be notified of the change

## Data Deletion (GDPR Article 17)

Under GDPR, you have the right to request full data deletion:

1. Go to **Settings > Privacy**
2. Click **"Request Data Deletion"**
3. Confirm your request
4. Your data will be deleted within 30 days

> **[PLACEHOLDER: screenshot]** — Data deletion request interface

### What Gets Deleted

| Data Type | Deletion Timeline |
|-----------|-------------------|
| Profile information | Within 30 days |
| Medical records | Within 30 days (after legal retention) |
| Case history | Within 30 days |
| Audit logs | Retained for compliance (required by law) |

**Note:** Some data may be retained longer for legal or compliance requirements. You'll be informed of any exceptions.

## Consent Management

You have control over what data processing you authorize:

| Consent Type | What It Covers | Can You Revoke? |
|--------------|---------------|----------------|
| **AI Pre-screening** | AI analysis of your records for specialist pre-screening | Yes |
| **Plain-language Summary** | AI translation of specialist opinions | Yes |
| **Trend Analysis** | AI tracking of lab results over time | Yes |

> **[PLACEHOLDER: screenshot]** — Consent management interface

### Revoking Consent

You can revoke consent at any time:
1. Go to **Settings > Privacy**
2. Find the consent you want to revoke
3. Click **"Revoke"**
4. Confirm your decision

**Important:** Revoking AI consent does not affect your ability to receive specialist opinions. You'll still receive written opinions from specialists — just without AI pre-screening or summaries.

## Your Privacy Rights

| Right | What It Means |
|-------|--------------|
| **Right to access** | You can request a copy of all your data |
| **Right to rectification** | You can request correction of inaccurate data |
| **Right to erasure** | You can request deletion of your data |
| **Right to restrict processing** | You can limit how your data is used |
| **Right to data portability** | You can export your data in a machine-readable format |
| **Right to object** | You can object to certain types of processing |

## Practice Scenario

**Scenario:** You want to update your email address and review your privacy settings.

**Your task:**
1. Go to Settings > Profile
2. Update your email address to a new address
3. Verify the new email via the confirmation link
4. Go to Settings > Privacy
5. Review your current consent settings
6. Note what data you can request deletion for

**Expected outcome:** Your email is updated and you understand your privacy settings.

## Common Mistakes

| Mistake | Why It's Wrong | What to Do Instead |
|---------|---------------|-------------------|
| Not verifying email changes | Changes won't take effect | Always check your inbox and click verification links |
| Revoking all consent without understanding | May limit services you can access | Review each consent type before revoking |
| Ignoring data deletion rights | You have legal rights under GDPR | Know you can request deletion at any time |

## Knowledge Check

1. **What happens when you revoke AI consent?**
   - A) You can no longer use the platform
   - B) You still receive specialist opinions, but without AI features
   - C) Your account is deleted
   - D) All your data is erased
   - **Correct answer:** B — Revoking AI consent removes AI features but doesn't affect your ability to receive specialist opinions.

2. **How long does data deletion take?**
   - A) Immediately
   - B) Within 24 hours
   - C) Within 30 days
   - D) Within 1 year
   - **Correct answer:** C — Data deletion occurs within 30 days (after any legal retention requirements).

3. **Which GDPR right allows you to export your data?**
   - A) Right to access
   - B) Right to rectification
   - C) Right to data portability
   - D) Right to erasure
   - **Correct answer:** C — The Right to Data Portability allows you to export your data in a machine-readable format.

## Summary

In this module, you learned:
- Profile settings allow you to update name, email, password, and notifications
- GDPR Article 17 gives you the right to request data deletion
- You can manage consent for AI processing and revoke at any time
- Six GDPR rights give you control over your personal data

## Congratulations!

You've completed the patient training program! You now know how to:
- Create and manage your account
- Start cases and upload records
- Understand specialist opinions and reports
- Ask follow-up questions and view lab trends
- Manage your privacy and data rights

**What's next?** Use the platform with confidence. If you need help, refer to the [Patient Guide](../guides/patient-guide.md) or contact support.

---

*Estimated completion time: 10 minutes*
*Pass threshold: 80% (2/3 correct on knowledge check)*
```

- [ ] **Step 3: Create quiz answers**

Create `docs/manual/training/patient-training/quiz-answers.md`:

```markdown
# Patient Training — Quiz Answers

## Module 1: Getting Started

1. **What does "AI surfaces; specialists decide" mean?**
   - **Correct answer:** B
   - **Explanation:** AI handles coordination, but every clinical decision is made by a human specialist.

2. **How long does registration take?**
   - **Correct answer:** C
   - **Explanation:** Registration is designed to be quick, taking under 2 minutes.

3. **What information do you need to register?**
   - **Correct answer:** B
   - **Explanation:** Only basic personal information (name, email, country, password) is required.

## Module 2: Your First Case

1. **What are the four service types?**
   - **Correct answer:** A
   - **Explanation:** The four service types are Specialist Opinion, Result Interpretation, Direct Consultation, and Trend Analysis.

2. **What does `AI_PRE_SCREENED` status mean?**
   - **Correct answer:** B
   - **Explanation:** `AI_PRE_SCREENED` means AI has analyzed your records and prepared a pre-screening for the specialist.

3. **What's the difference between single-expert and panel review?**
   - **Correct answer:** B
   - **Explanation:** Single-expert gives one specialist opinion; panel review gives 2-4 opinions with AI-generated synthesis.

## Module 3: Uploading Records

1. **What is the maximum file size per upload?**
   - **Correct answer:** C
   - **Explanation:** The maximum file size is 50 MB per file.

2. **Why should you name files descriptively?**
   - **Correct answer:** B
   - **Explanation:** Descriptive names help specialists identify relevant files and reference them in opinions.

3. **What security protects your uploaded files?**
   - **Correct answer:** B
   - **Explanation:** Files are protected by TLS encryption in transit, AES-256 encryption at rest, signed URLs for access, and audit logging.

## Module 4: Understanding Reports

1. **What are the three sections of a specialist opinion?**
   - **Correct answer:** B
   - **Explanation:** Every specialist opinion has three sections: Clinical Findings, Clinical Impression, and Recommended Next Steps.

2. **What is the plain-language summary?**
   - **Correct answer:** A
   - **Explanation:** The plain-language summary translates medical terminology into patient-friendly language, written as if by a trusted GP.

3. **What happens when multiple specialists review your case?**
   - **Correct answer:** C
   - **Explanation:** A multi-opinion synthesis shows areas of agreement, disagreement, and an overall consensus summary.

## Module 5: Follow-up & Trends

1. **What can the AI answer in follow-up questions?**
   - **Correct answer:** B
   - **Explanation:** AI answers only within the scope of the written opinion. For new questions, book a consultation.

2. **What does a red alert on lab trends mean?**
   - **Correct answer:** C
   - **Explanation:** Red alerts indicate statistically significant changes that may need medical attention.

3. **When should you book a direct consultation?**
   - **Correct answer:** B
   - **Explanation:** Book consultations for real-time discussion or questions beyond the opinion's scope.

## Module 6: Account & Privacy

1. **What happens when you revoke AI consent?**
   - **Correct answer:** B
   - **Explanation:** Revoking AI consent removes AI features but doesn't affect your ability to receive specialist opinions.

2. **How long does data deletion take?**
   - **Correct answer:** C
   - **Explanation:** Data deletion occurs within 30 days (after any legal retention requirements).

3. **Which GDPR right allows you to export your data?**
   - **Correct answer:** C
   - **Explanation:** The Right to Data Portability allows you to export your data in a machine-readable format.
```

- [ ] **Step 4: Commit**

```bash
git add docs/manual/training/patient-training/05-follow-up-and-trends.md docs/manual/training/patient-training/06-account-and-privacy.md docs/manual/training/patient-training/quiz-answers.md
git commit -m "docs: add patient training modules 5-6 and quiz answers"
```

---

## Task 5: Create Specialist Training Modules 1-2

**Files:**
- Create: `docs/manual/training/specialist-training/01-platform-overview.md`
- Create: `docs/manual/training/specialist-training/02-case-review-basics.md`

**Interfaces:**
- Consumes: Module template from Task 1
- Produces: First two specialist modules for subsequent modules to reference

- [ ] **Step 1: Create Module 1 — Platform Overview**

Create `docs/manual/training/specialist-training/01-platform-overview.md`:

```markdown
# Module 1: Platform Overview

**Role:** Specialist
**Duration:** ~10 minutes
**Prerequisites:** None

## Learning Objectives

After completing this module, you will be able to:

1. Understand how Dr. Bubal Care works for specialists
2. Navigate the specialist portal
3. Understand your role and responsibilities
4. Know what to expect from AI features

## Welcome to Dr. Bubal Care

You are joining Dr. Bubal Care as a board-certified specialist. You are the clinical decision-maker on this platform. AI handles coordination, pre-screening, and summaries — but you review the records, form the clinical impression, and sign the opinion.

> **[PLACEHOLDER: screenshot]** — Specialist portal homepage

## Your Role

As a specialist on Dr. Bubal Care:

| You Do | AI Does |
|--------|---------|
| Review clinical records | Pre-screen records before you see them |
| Form clinical impression | Generate plain-language summaries |
| Write the opinion | Synthesize multiple opinions |
| Sign and submit | Handle follow-up questions within scope |
| Flag critical findings | Route cases to your subspecialty |

**Core principle:** *"AI surfaces; specialists decide."* You are always the final decision-maker.

## Portal Navigation

> **[PLACEHOLDER: screenshot]** — Specialist portal dashboard with key sections labeled

### Main Navigation

| Section | What It Does |
|---------|-------------|
| **My Cases** | Cases assigned to you with status |
| **My Opinions** | Opinions you've written and submitted |
| **Availability** | Set your available hours and capacity |
| **Settings** | Profile, verification, notifications |

### Dashboard Metrics

| Metric | What It Shows |
|--------|--------------|
| **Pending Cases** | Cases waiting for your review |
| **In Progress** | Cases you're currently reviewing |
| **Completed** | Cases where you've submitted opinions |
| **Response Time** | Your average response time |

## AI Features Overview

### AI Pre-screening (Automatic)

- Generated automatically when a case is assigned to you
- Highlights key findings, differentials, and urgent flags
- Always labeled "AI-Generated Pre-screen — For Specialist Review Only"
- **You must independently verify all findings**

### Plain-language Summary (Automatic)

- Generated automatically after you sign an opinion
- Translates your opinion into patient-friendly language
- You can preview the summary before the patient sees it

### Multi-opinion Synthesis (Automatic)

- Generated when 2+ specialists sign opinions for the same case
- Shows areas of agreement and disagreement
- You can view how your opinion compares to others

## Practice Scenario

**Scenario:** You've just registered as a specialist on Dr. Bubal Care.

**Your task:**
1. Log in to `doctor.drbubalcare.com`
2. Navigate to the dashboard
3. Identify the "My Cases" section
4. Review your profile settings
5. Set your availability for the week

**Expected outcome:** You're familiar with the portal layout and have set your availability.

## Common Mistakes

| Mistake | Why It's Wrong | What to Do Instead |
|---------|---------------|-------------------|
| Relying solely on AI pre-screening | AI is for reference, not clinical decision-making | Independently review all records |
| Not setting availability | Cases won't be routed to you | Set availability before accepting cases |
| Ignoring notifications | May miss urgent cases | Check notifications regularly |

## Knowledge Check

1. **What is your primary role on Dr. Bubal Care?**
   - A) AI coordinator
   - B) Clinical decision-maker who reviews records and writes opinions
   - C) Administrative support
   - D) Technical support
   - **Correct answer:** B — You are the clinical decision-maker. AI assists, but you make all clinical decisions.

2. **What does the AI pre-screening provide?**
   - A) A final diagnosis
   - B) Key findings, differentials, and urgent flags for your reference
   - C) A treatment plan
   - D) A billing summary
   - **Correct answer:** B — The AI pre-screening highlights key findings and differentials for your reference, but you must independently verify.

3. **When is the plain-language summary generated?**
   - A) When you start reviewing a case
   - B) After you sign and submit your opinion
   - C) When the patient asks a question
   - D) At the end of each week
   - **Correct answer:** B — The plain-language summary is generated automatically after you sign your opinion.

## Summary

In this module, you learned:
- You are the clinical decision-maker; AI assists but doesn't decide
- The specialist portal has sections for cases, opinions, availability, and settings
- AI pre-screening, summaries, and synthesis are generated automatically
- You must independently verify all AI-generated content

## Next Steps

→ **Module 2: Case Review Basics** — Learn to receive cases, review AI pre-screening, examine clinical records, and use the DICOM viewer.

---

*Estimated completion time: 10 minutes*
*Pass threshold: 100% (3/3 correct on knowledge check)*
```

- [ ] **Step 2: Create Module 2 — Case Review Basics**

Create `docs/manual/training/specialist-training/02-case-review-basics.md`:

```markdown
# Module 2: Case Review Basics

**Role:** Specialist
**Duration:** ~20 minutes
**Prerequisites:** Module 1: Platform Overview

## Learning Objectives

After completing this module, you will be able to:

1. Receive and open cases from your dashboard
2. Review AI pre-screening effectively
3. Examine clinical records systematically
4. Use the DICOM viewer for medical images

## Receiving Cases

Cases are routed to you automatically by the AI based on your subspecialty match and availability. When a case is assigned:

1. You receive an **email notification**
2. The case appears in your **"My Cases"** dashboard with status `UNDER_REVIEW`
3. The AI pre-screening is attached to the case

> **[PLACEHOLDER: screenshot]** — Case notification and dashboard entry

### Case Information

Each case includes:
- **Service type** — What the patient requested
- **Patient description** — Brief description of the situation
- **Urgency flag** — Routine, Soon, or Urgent
- **Uploaded files** — Medical records for review
- **AI pre-screening** — Key findings and differentials

## Reviewing a Case

### Step 1: Read the AI Pre-screening First

The AI pre-screening is generated before you open the case. Review it first to understand what the AI surfaced:

| Section | What It Contains |
|---------|-----------------|
| **Key findings** | Notable observations from the clinical records |
| **Differentials to consider** | Potential diagnoses or conditions to rule in/out |
| **Urgent flags** | Time-sensitive findings requiring immediate attention |
| **Relevant history** | Any prior records or context |

> **[PLACEHOLDER: screenshot]** — AI pre-screening section in case view

**Important:** The pre-screening is an AI-generated draft for your reference. It does not constitute a diagnosis. You must independently review all records and form your own clinical impression.

### Step 2: Review Clinical Records

Open each uploaded file systematically:

1. **Start with the most recent** — Latest records often contain the most relevant information
2. **Review all files** — Don't skip any uploaded materials
3. **Download for detailed review** — Use the download option for thorough examination
4. **Note key findings** — Document what you observe in each file

> **[PLACEHOLDER: screenshot]** — File list in case view with download option

### Step 3: Review Case Metadata

Check the case metadata:
- Service type requested
- Patient's description
- Urgency flags
- Any additional notes

## Using the DICOM Viewer

For DICOM files (CT scans, MRI scans, PET scans):

1. Open the case
2. Click on the DICOM file
3. The built-in DICOM viewer opens
4. Use the controls to:
   - **Scroll through slices** — Move through the image stack
   - **Adjust window/level** — Optimize contrast for different tissue types
   - **Measure** — Calculate distances and areas
   - **Annotate** — Mark regions of interest

> **[PLACEHOLDER: screenshot]** — DICOM viewer with controls labeled

### DICOM Viewer Controls

| Control | Function |
|---------|----------|
| **Scroll** | Navigate through image slices |
| **Window/Level** | Adjust brightness and contrast |
| **Zoom** | Magnify specific areas |
| **Pan** | Move the image within the viewport |
| **Measure** | Calculate distances and areas |
| **Annotate** | Add markers and notes |

## Reviewing Histopathology Slides

For histopathology slide images:

1. Open the case
2. Click on the slide image
3. Use **zoom and pan** to examine regions of interest
4. Start at low magnification for overview
5. Increase magnification for cellular details
6. Reference specific findings in your opinion

> **[PLACEHOLDER: screenshot]** — Histopathology viewer with zoom controls

## Reviewing Lab Reports

For lab report PDFs:

1. Open the case
2. Click on the lab report PDF
3. Review values and reference ranges
4. Flag any values outside normal ranges
5. Cross-reference with any trend analysis data
6. Note significant findings in your opinion

## Practice Scenario

**Scenario:** A case arrives with histopathology slides and lab reports. Walk through the review process.

**Your task:**
1. Open the case from your dashboard
2. Read the AI pre-screening first
3. Open the histopathology slide image
4. Use zoom to examine regions of interest
5. Open the lab report PDF
6. Review values and reference ranges
7. Note your initial observations

**Expected outcome:** You've systematically reviewed all materials and have initial observations ready for writing your opinion.

## Common Mistakes

| Mistake | Why It's Wrong | What to Do Instead |
|---------|---------------|-------------------|
| Skipping the AI pre-screening | Missing context that could inform your review | Always read pre-screening first for reference |
| Reviewing only some files | Incomplete review may miss important findings | Review all uploaded files systematically |
| Not using DICOM viewer properly | May miss findings in different slices | Learn viewer controls and scroll through all slices |
| Relying on AI findings without verification | AI is for reference, not clinical decision | Independently verify all observations |

## Knowledge Check

1. **What should you do first when reviewing a case?**
   - A) Open the DICOM viewer
   - B) Read the AI pre-screening
   - C) Write your opinion
   - D) Contact the patient
   - **Correct answer:** B — Always read the AI pre-screening first to understand what the AI surfaced, then independently verify.

2. **What does the AI pre-screening provide?**
   - A) A final diagnosis
   - B) Key findings, differentials, and urgent flags for reference
   - C) A treatment recommendation
   - D) Billing information
   - **Correct answer:** B — The pre-screening provides key findings, differentials, and urgent flags for your reference.

3. **How should you approach reviewing multiple files?**
   - A) Review only the most recent file
   - B) Review all files systematically, starting with the most recent
   - C) Review only DICOM files
   - D) Review in random order
   - **Correct answer:** B — Review all files systematically, starting with the most recent, to ensure complete coverage.

## Summary

In this module, you learned:
- Cases arrive with AI pre-screening attached for your reference
- Always read pre-screening first, then independently verify
- Review all files systematically, starting with most recent
- DICOM viewer provides tools for scrolling, windowing, measuring, and annotating

## Next Steps

→ **Module 3: Writing Opinions** — Learn to use the structured opinion editor, write findings/impression/next steps, and sign and submit.

---

*Estimated completion time: 20 minutes*
*Pass threshold: 100% (3/3 correct on knowledge check)*
```

- [ ] **Step 3: Commit**

```bash
git add docs/manual/training/specialist-training/01-platform-overview.md docs/manual/training/specialist-training/02-case-review-basics.md
git commit -m "docs: add specialist training modules 1-2"
```

---

## Task 6: Create Specialist Training Modules 3-4

**Files:**
- Create: `docs/manual/training/specialist-training/03-writing-opinions.md`
- Create: `docs/manual/training/specialist-training/04-ai-features.md`

**Interfaces:**
- Consumes: Module template from Task 1, modules 1-2 from Task 5
- Produces: Modules 3-4 for specialist track continuity

- [ ] **Step 1: Create Module 3 — Writing Opinions**

Create `docs/manual/training/specialist-training/03-writing-opinions.md`:

```markdown
# Module 3: Writing Opinions

**Role:** Specialist
**Duration:** ~20 minutes
**Prerequisites:** Module 2: Case Review Basics

## Learning Objectives

After completing this module, you will be able to:

1. Use the structured opinion editor
2. Write clinical findings section
3. Write clinical impression section
4. Write recommended next steps section
5. Sign and submit your opinion

## The Structured Opinion Editor

The opinion editor provides three sections for your assessment:

> **[PLACEHOLDER: screenshot]** — Opinion editor with three sections labeled

### Editor Features

| Feature | Description |
|---------|-------------|
| **Rich text** | Headings, lists, bold, italic |
| **File references** | Reference uploaded files by name |
| **Auto-save** | Drafts saved every 30 seconds |
| **Preview** | View formatted opinion before signing |

## Section 1: Clinical Findings

Describe what you observed in the records:

- Reference specific files or images
- Note technical details (margins, measurements, grades)
- Be precise and objective
- Use standard medical terminology

**Example:**
> "Histopathology examination reveals a 2.3cm invasive ductal carcinoma in the right breast (File: `Pathology Report - Dr. Smith.pdf`). The tumor shows:
> - Nuclear grade 2 (moderate differentiation)
> - Mitotic count: 12 per 10 HPF
> - Surgical margins: >2mm clearance on all sides
> - Lymphovascular invasion: Present"

> **[PLACEHOLDER: screenshot]** — Example clinical findings with file references

**Tips:**
- Start with the most significant findings
- Reference file names so the patient can follow along
- Use measurements and grades when available
- Note both positive and negative findings

## Section 2: Clinical Impression

Write your overall assessment:

- Your interpretation of the findings
- Differential diagnosis if applicable
- Confidence level and rationale
- How findings relate to the patient's presentation

**Example:**
> "The histopathological features are consistent with invasive ductal carcinoma, Nottingham grade 2 (intermediate prognosis). The presence of lymphovascular invasion suggests potential for metastatic spread. Surgical margins are clear, which is favorable for local control.
>
> **Differential diagnosis:**
> 1. Invasive ductal carcinoma (most likely)
> 2. Invasive lobular carcinoma (less likely given morphology)
>
> **Confidence level:** High — morphological features are characteristic."

> **[PLACEHOLDER: screenshot]** — Example clinical impression section

**Tips:**
- State your assessment clearly and directly
- Include differential diagnoses when appropriate
- Be honest about confidence levels
- Explain your reasoning briefly

## Section 3: Recommended Next Steps

Suggest actions the patient or their care team should take:

- Additional tests or imaging
- Referrals to specialists
- Follow-up timeline
- Any additional information needed

**Example:**
> **Recommended next steps:**
> 1. **Oncology referral** — For treatment planning discussion (within 2 weeks)
> 2. **Staging workup** — CT chest/abdomen/pelvis and bone scan
> 3. **Genetic counseling** — Consider BRCA testing given age and tumor type
> 4. **Follow-up** — Repeat imaging in 3 months post-treatment
>
> **Information needed:** Family history of breast/ovarian cancer would be helpful for risk stratification."

> **[PLACEHOLDER: screenshot]** — Example recommended next steps section

**Tips:**
- Be specific about urgency and timelines
- Include both immediate and long-term steps
- Note any information you need from the patient
- Consider multidisciplinary team involvement

## Signing and Submitting

### Draft Review

1. Your opinion is saved as `DRAFT` status while you work
2. You can save and return to drafts at any time
3. Review your complete opinion before signing

### Signing

1. Review your opinion one final time
2. Click **"Sign and Submit"**
3. Your digital signature is applied with a timestamp
4. Status changes from `DRAFT` → `SIGNED`
5. The patient is notified and can view the opinion
6. The plain-language summary is automatically generated

> **[PLACEHOLDER: screenshot]** — Sign and submit button with confirmation dialog

**Important:** Once signed, you cannot edit the opinion. If you need to make corrections, contact admin support.

## Practice Scenario

**Scenario:** You've reviewed a case with abnormal lab results. Write your opinion using the three-section format.

**Your task:**
1. Open the opinion editor
2. Write clinical findings referencing the lab report
3. Write your clinical impression with differential diagnosis
4. Write recommended next steps with specific actions
5. Review your complete opinion
6. Click "Sign and Submit"

**Expected outcome:** Your opinion is signed and submitted, and the patient is notified.

## Common Mistakes

| Mistake | Why It's Wrong | What to Do Instead |
|---------|---------------|-------------------|
| Skipping sections | Incomplete opinion doesn't help the patient | Complete all three sections thoroughly |
| Being vague | Patient and other specialists need specifics | Use precise measurements and clear language |
| Not referencing files | Patient can't follow your reasoning | Reference specific file names in findings |
| Signing without review | Errors in signed opinions are permanent | Review complete opinion before signing |

## Knowledge Check

1. **What are the three sections of a specialist opinion?**
   - A) Diagnosis, Treatment, Prognosis
   - B) Clinical Findings, Clinical Impression, Recommended Next Steps
   - C) History, Examination, Assessment
   - D) Summary, Analysis, Conclusion
   - **Correct answer:** B — Every opinion has three sections: Clinical Findings, Clinical Impression, and Recommended Next Steps.

2. **What happens when you sign an opinion?**
   - A) You can edit it later
   - B) The patient is notified and a plain-language summary is generated
   - C) The case is closed immediately
   - D) You receive payment
   - **Correct answer:** B — Signing notifies the patient and triggers automatic plain-language summary generation.

3. **Why should you reference specific files in your findings?**
   - A) It's required by the system
   - B) It helps patients and other specialists understand your reasoning
   - C) It makes the opinion longer
   - D) It speeds up the review process
   - **Correct answer:** B — File references help patients follow your reasoning and verify your observations.

## Summary

In this module, you learned:
- The opinion editor has three sections: findings, impression, next steps
- Reference specific files and use precise measurements
- Be honest about confidence levels and differential diagnoses
- Once signed, opinions cannot be edited — review carefully before signing

## Next Steps

→ **Module 4: AI Features** — Learn to interpret AI pre-screening, preview plain-language summaries, and understand multi-opinion synthesis.

---

*Estimated completion time: 20 minutes*
*Pass threshold: 100% (3/3 correct on knowledge check)*
```

- [ ] **Step 2: Create Module 4 — AI Features**

Create `docs/manual/training/specialist-training/04-ai-features.md`:

```markdown
# Module 4: AI Features

**Role:** Specialist
**Duration:** ~15 minutes
**Prerequisites:** Module 3: Writing Opinions

## Learning Objectives

After completing this module, you will be able to:

1. Interpret AI pre-screening effectively
2. Preview and verify plain-language summaries
3. Understand multi-opinion synthesis
4. Know when to override AI suggestions

## AI Pre-screening Deep Dive

The AI pre-screening is generated before you open the case. Understanding how to use it effectively saves time and improves review quality.

> **[PLACEHOLDER: screenshot]** — Detailed AI pre-screening with annotations

### Pre-screening Components

| Component | What It Contains | How to Use It |
|-----------|-----------------|---------------|
| **Key findings** | Notable observations from records | Use as starting point, verify independently |
| **Differentials** | Potential diagnoses to consider | Check if relevant, don't accept without verification |
| **Urgent flags** | Time-sensitive findings | Prioritize these areas in your review |
| **Relevant history** | Prior records and context | Understand patient background |

### Using Pre-screening Effectively

**Do:**
- Read pre-screening first to understand what the AI surfaced
- Use it to prioritize which areas to examine most carefully
- Verify each finding independently in the actual records
- Note if the AI missed something important

**Don't:**
- Accept pre-screening findings without verification
- Skip your own systematic review
- Let pre-screening bias your clinical judgment
- Assume the AI caught everything

> **[PLACEHOLDER: diagram]** — Flowchart: AI pre-screening → independent verification → clinical judgment

### When AI Gets It Wrong

AI pre-screening may:
- **Miss findings** — Not all relevant observations are surfaced
- **Over-call findings** — Some flagged items may be normal variants
- **Misinterpret context** — AI may not understand clinical context
- **Lack nuance** — AI can't weigh clinical significance like you can

**Your responsibility:** Independently verify everything. The pre-screening is a tool, not a shortcut.

## Plain-language Summary Preview

After you sign an opinion, the AI generates a plain-language summary. You can preview this before the patient sees it.

> **[PLACEHOLDER: screenshot]** — Plain-language summary preview interface

### What the Summary Does

- Translates your medical terminology into everyday language
- Written as if by a trusted GP
- Explains findings, impression, and next steps in plain English
- Always labeled "AI-Generated Summary — Based on Specialist Opinion"

### Verifying the Summary

Before the patient sees it, check:
1. **Accuracy** — Does it correctly reflect your opinion?
2. **Completeness** — Did it include all key points?
3. **Tone** — Is it appropriate and reassuring?
4. **Clarity** — Will the patient understand it?

**If the summary is inaccurate**, contact admin support to correct it before the patient views it.

## Multi-opinion Synthesis

When 2+ specialists sign opinions for the same case, the AI generates a synthesis:

> **[PLACEHOLDER: screenshot]** — Multi-opinion synthesis showing agreement and disagreement

### Synthesis Components

| Component | What It Shows |
|-----------|--------------|
| **Areas of agreement** | Where all specialists agree |
| **Areas of disagreement** | Where specialists differ |
| **Consensus summary** | Overall synthesis of opinions |

### Using the Synthesis

- **Compare your opinion** — See how your assessment aligns with others
- **Identify gaps** — Notice if you considered something others didn't
- **Understand perspective** — Learn from different specialist viewpoints
- **Improve consistency** — Note areas where your practice differs

## Follow-up Q&A (AI-handled)

Patient follow-up questions are answered by the AI within the scope of your opinion:

- You are notified of follow-up questions but not required to respond
- The AI answers within the documented scope of your opinion
- If the AI cannot answer within scope, the patient books a consultation

**Your role:** Ensure your opinion is clear and complete enough for the AI to answer common questions.

## Practice Scenario

**Scenario:** You've received an AI pre-screening for a case. Review it and identify what's useful versus what needs verification.

**Your task:**
1. Read the AI pre-screening carefully
2. Identify 2-3 findings you want to verify independently
3. Note any findings the AI may have missed
4. Form your own clinical impression based on the actual records
5. After signing, preview the plain-language summary
6. Verify it accurately reflects your opinion

**Expected outcome:** You've used the AI pre-screening as a reference tool while maintaining independent clinical judgment.

## Common Mistakes

| Mistake | Why It's Wrong | What to Do Instead |
|---------|---------------|-------------------|
| Accepting AI findings without verification | AI can miss or misinterpret findings | Independently verify everything |
| Ignoring AI pre-screening entirely | Missing useful context and prioritization | Use it as a starting point for your review |
| Not previewing plain-language summary | Patient may receive inaccurate information | Always preview and verify before patient sees it |
| Letting AI bias your judgment | Your clinical expertise is what matters | Form your own impression first |

## Knowledge Check

1. **How should you use the AI pre-screening?**
   - A) Accept all findings without question
   - B) Ignore it completely
   - C) Use it as a reference, then independently verify everything
   - D) Only look at urgent flags
   - **Correct answer:** C — Use pre-screening as a starting point, then independently verify each finding in the actual records.

2. **What should you check in the plain-language summary preview?**
   - A) Only the length
   - B) Accuracy, completeness, tone, and clarity
   - C) Only the medical terminology
   - D) Nothing — it's always accurate
   - **Correct answer:** B — Verify accuracy, completeness, tone, and clarity before the patient sees it.

3. **When is multi-opinion synthesis generated?**
   - A) When you sign your opinion
   - B) When 2+ specialists sign opinions for the same case
   - C) At the end of each week
   - D) When the patient requests it
   - **Correct answer:** B — Synthesis is generated automatically when 2+ specialists have signed opinions for the same case.

## Summary

In this module, you learned:
- Use AI pre-screening as a reference, but independently verify everything
- Preview plain-language summaries for accuracy before patients see them
- Multi-opinion synthesis shows agreement and disagreement across specialists
- Your clinical expertise always overrides AI suggestions

## Next Steps

→ **Module 5: Critical Findings** — Learn to identify urgent cases, flag critical findings, and understand the escalation process.

---

*Estimated completion time: 15 minutes*
*Pass threshold: 100% (3/3 correct on knowledge check)*
```

- [ ] **Step 3: Commit**

```bash
git add docs/manual/training/specialist-training/03-writing-opinions.md docs/manual/training/specialist-training/04-ai-features.md
git commit -m "docs: add specialist training modules 3-4"
```

---

## Task 7: Create Specialist Training Modules 5-6 and Quiz Answers

**Files:**
- Create: `docs/manual/training/specialist-training/05-critical-findings.md`
- Create: `docs/manual/training/specialist-training/06-availability-and-capacity.md`
- Create: `docs/manual/training/specialist-training/quiz-answers.md`

**Interfaces:**
- Consumes: Module template from Task 1, modules 1-4 from Tasks 5-6
- Produces: Complete specialist training track with quiz answers

- [ ] **Step 1: Create Module 5 — Critical Findings**

Create `docs/manual/training/specialist-training/05-critical-findings.md`:

```markdown
# Module 5: Critical Findings

**Role:** Specialist
**Duration:** ~10 minutes
**Prerequisites:** Module 4: AI Features

## Learning Objectives

After completing this module, you will be able to:

1. Identify urgent and critical findings
2. Flag critical findings appropriately
3. Understand the escalation process
4. Know when to contact admin directly

## What Are Critical Findings?

Critical findings are observations that require immediate medical attention or intervention. They may be life-threatening or time-sensitive.

### Examples of Critical Findings

| Finding | Why It's Critical |
|---------|-------------------|
| **Malignant lesion** | Requires immediate oncology referral |
| **Active bleeding** | May require emergency intervention |
| **Critical lab values** | May indicate acute condition requiring treatment |
| **Suspicious masses** | Need urgent further investigation |
| **Acute infection** | May require immediate antibiotic treatment |

> **[PLACEHOLDER: screenshot]** — Example of critical finding in opinion

## Flagging Critical Findings

When you identify a critical finding:

### Step 1: Note It Prominently

In your opinion, clearly mark the critical finding:

> **⚠️ CRITICAL FINDING:** The CT scan reveals a 4cm mass in the left lung with mediastinal lymphadenopathy. This requires urgent oncology referral.

### Step 2: Sign and Submit Immediately

Don't wait — sign and submit your opinion as soon as you've documented the critical finding.

### Step 3: The System Flags for Urgent Notification

When you sign an opinion with a critical finding, the system:
1. Flags the case for urgent admin notification
2. Admin will arrange direct contact with the patient
3. Phone or WhatsApp contact is used, not just portal notification

> **[PLACEHOLDER: diagram]** — Escalation flow: Critical finding → Admin alert → Patient contact

## Escalation Process

### Automatic Escalation

| Trigger | Action |
|---------|--------|
| Critical finding flagged | Admin notified immediately |
| Case unmatched >4 hours | Admin alerted |
| Patient dispute raised | Admin reviews case |

### Manual Escalation

If you need to escalate something not covered by automatic triggers:

1. Contact admin support directly
2. Explain the urgency
3. Provide case ID and your concern
4. Admin will take immediate action

**When to contact admin directly:**
- You notice a critical finding but the system didn't flag it
- You need to communicate with the patient urgently
- You identify a system error that could affect patient safety
- You're unsure about the escalation process

## Handling Urgent Cases

When you receive a case marked as **Urgent**:

1. **Prioritize it** — Review urgent cases before routine ones
2. **Review quickly but thoroughly** — Don't sacrifice quality for speed
3. **Flag any additional critical findings** — Even if the case wasn't initially flagged as critical
4. **Submit promptly** — The patient needs your opinion quickly

## Practice Scenario

**Scenario:** You're reviewing a case and discover a critical finding requiring immediate attention.

**Your task:**
1. Identify the critical finding in the records
2. Document it prominently in your opinion
3. Sign and submit immediately
4. Verify the system flagged it for urgent admin notification

**Expected outcome:** The critical finding is documented, your opinion is submitted, and admin has been alerted for patient contact.

## Common Mistakes

| Mistake | Why It's Wrong | What to Do Instead |
|---------|---------------|-------------------|
| Delaying submission for critical findings | Patient may miss critical treatment window | Submit immediately after documenting |
| Not flagging prominently | Critical finding may be missed in the opinion | Use clear formatting and explicit labels |
| Waiting for automatic escalation | Some situations need manual contact | Contact admin directly when needed |

## Knowledge Check

1. **What should you do when you identify a critical finding?**
   - A) Wait and see if it gets worse
   - B) Note it prominently and sign/submit immediately
   - C) Contact the patient directly
   - D) Ignore it if the AI didn't flag it
   - **Correct answer:** B — Note the finding prominently and submit immediately. Admin will arrange patient contact.

2. **How does the system handle critical findings?**
   - A) No special handling
   - B) Flags for admin notification and arranges direct patient contact
   - C) Sends an email and waits
   - D) Nothing — it's up to you
   - **Correct answer:** B — The system flags critical findings for admin, who arranges direct patient contact via phone/WhatsApp.

3. **When should you contact admin directly?**
   - A) Only for billing issues
   - B) When you need immediate escalation or notice system errors
   - C) Never — use the portal only
   - D) Only for non-urgent matters
   - **Correct answer:** B — Contact admin directly for immediate escalation or when you notice system errors affecting patient safety.

## Summary

In this module, you learned:
- Critical findings require immediate attention and prominent documentation
- Sign and submit immediately when you identify critical findings
- The system automatically flags critical findings for admin notification
- Contact admin directly for situations not covered by automatic escalation

## Next Steps

→ **Module 6: Availability & Capacity** — Learn to set your availability, manage case capacity, and handle temporary unavailability.

---

*Estimated completion time: 10 minutes*
*Pass threshold: 100% (3/3 correct on knowledge check)*
```

- [ ] **Step 2: Create Module 6 — Availability & Capacity**

Create `docs/manual/training/specialist-training/06-availability-and-capacity.md`:

```markdown
# Module 6: Availability & Capacity

**Role:** Specialist
**Duration:** ~10 minutes
**Prerequisites:** Module 5: Critical Findings

## Learning Objectives

After completing this module, you will be able to:

1. Set your available hours
2. Manage case capacity
3. Handle temporary unavailability
4. Optimize your availability for case routing

## Setting Available Hours

1. Go to **Settings > Availability**
2. Set your available hours per day
3. Set maximum cases per week
4. Save changes

> **[PLACEHOLDER: screenshot]** — Availability settings interface

### Example Availability

| Day | Available Hours |
|-----|----------------|
| Monday | 9:00 AM - 5:00 PM |
| Tuesday | 9:00 AM - 5:00 PM |
| Wednesday | 10:00 AM - 4:00 PM |
| Thursday | 9:00 AM - 5:00 PM |
| Friday | 9:00 AM - 12:00 PM |
| Saturday | Not available |
| Sunday | Not available |

### Tips for Setting Hours

- **Be realistic** — Set hours you can consistently maintain
- **Consider time zones** — Patients may be in different time zones
- **Leave buffer time** — Don't schedule back-to-back without breaks
- **Be consistent** — Regular hours help the AI route cases effectively

## Case Capacity

Set a weekly maximum for new cases:

| Setting | Description |
|---------|-------------|
| **Weekly maximum** | Maximum new cases you'll accept per week |
| **Daily maximum** | Maximum new cases per day (optional) |
| **Auto-pause** | Automatically pause routing when at capacity |

### Capacity Guidelines

| Comfort Level | Recommended Weekly Maximum |
|--------------|---------------------------|
| **Part-time** | 5-10 cases per week |
| **Regular** | 10-20 cases per week |
| **Full-time** | 20-30 cases per week |

**When you reach capacity**, new cases route to the next available specialist in your subspecialty.

### Adjusting Capacity

You can adjust capacity at any time:
- **Increase** — When you have more availability
- **Decrease** — When you're busy or need focus time
- **Pause** — Temporarily stop receiving new cases

> **[PLACEHOLDER: screenshot]** — Capacity settings with adjustment options

## Temporary Unavailability

For vacations, conferences, or other absences:

1. Go to **Settings > Availability**
2. Set **unavailability dates**
3. Cases will not be routed to you during these periods
4. Existing in-progress cases are not affected

> **[PLACEHOLDER: screenshot]** — Unavailability date picker

### What Happens During Unavailability

| Scenario | What Happens |
|----------|--------------|
| **New cases** | Routed to other specialists in your subspecialty |
| **In-progress cases** | You can still work on them if you choose |
| **Urgent cases** | Admin may contact you if critical |

**Tip:** Set unavailability at least 1 week in advance for optimal case routing.

## Optimizing Availability

### For Case Routing

The AI routes cases based on:
1. **Subspecialty match** — Your declared subspecialties
2. **Current availability** — Whether you're available now
3. **Capacity** — Whether you're at your weekly maximum
4. **Response time** — Specialists with faster response times may get priority

### Best Practices

| Practice | Why |
|----------|-----|
| Set regular hours | Helps AI route consistently |
| Update availability promptly | Prevents cases being routed when unavailable |
| Be realistic about capacity | Avoids burnout and maintains quality |
| Set buffer time | Allows for unexpected complexity |

## Practice Scenario

**Scenario:** You're going on vacation next week and need to update your availability.

**Your task:**
1. Go to Settings > Availability
2. Set unavailability dates for next week
3. Verify your current cases won't be affected
4. Adjust your weekly capacity for the week after vacation
5. Save changes

**Expected outcome:** Your availability is updated, no new cases will be routed during vacation, and your capacity is adjusted for return.

## Common Mistakes

| Mistake | Why It's Wrong | What to Do Instead |
|---------|---------------|-------------------|
| Setting unrealistic capacity | Leads to burnout or missed deadlines | Set comfortable maximum you can maintain |
| Forgetting to set unavailability | Cases arrive when you're not available | Set unavailability at least 1 week in advance |
| Not updating availability promptly | Cases may be routed incorrectly | Update availability as soon as it changes |

## Knowledge Check

1. **What determines which cases are routed to you?**
   - A) Only your subspecialty
   - B) Subspecialty match, availability, capacity, and response time
   - C) Random assignment
   - D) Patient preference only
   - **Correct answer:** B — Cases are routed based on subspecialty match, current availability, capacity, and response time.

2. **What happens when you reach your weekly capacity?**
   - A) No more cases are reviewed on the platform
   - B) New cases route to the next available specialist in your subspecialty
   - C) You're automatically removed from the platform
   - D) Patients are told to wait
   - **Correct answer:** B — When you reach capacity, new cases route to other available specialists in your subspecialty.

3. **How far in advance should you set unavailability?**
   - A) At least 1 week
   - B) At least 1 month
   - C) At least 1 day
   - D) No advance notice needed
   - **Correct answer:** A — Set unavailability at least 1 week in advance for optimal case routing.

## Summary

In this module, you learned:
- Set realistic available hours that you can consistently maintain
- Adjust weekly capacity based on your comfort level
- Set unavailability at least 1 week in advance
- The AI routes cases based on subspecialty, availability, capacity, and response time

## Congratulations!

You've completed the specialist training program! You now know how to:
- Navigate the specialist portal and understand your role
- Review cases systematically using AI pre-screening
- Write structured opinions with findings, impression, and next steps
- Use AI features effectively while maintaining independent judgment
- Handle critical findings and escalate appropriately
- Manage your availability for optimal case routing

**What's next?** Use the platform with confidence. If you need help, refer to the [Specialist Guide](../guides/specialist-guide.md) or contact admin support.

---

*Estimated completion time: 10 minutes*
*Pass threshold: 100% (3/3 correct on knowledge check)*
```

- [ ] **Step 3: Create quiz answers**

Create `docs/manual/training/specialist-training/quiz-answers.md`:

```markdown
# Specialist Training — Quiz Answers

## Module 1: Platform Overview

1. **What is your primary role on Dr. Bubal Care?**
   - **Correct answer:** B
   - **Explanation:** You are the clinical decision-maker. AI assists, but you make all clinical decisions.

2. **What does the AI pre-screening provide?**
   - **Correct answer:** B
   - **Explanation:** The pre-screening provides key findings, differentials, and urgent flags for your reference.

3. **When is the plain-language summary generated?**
   - **Correct answer:** B
   - **Explanation:** The plain-language summary is generated automatically after you sign your opinion.

## Module 2: Case Review Basics

1. **What should you do first when reviewing a case?**
   - **Correct answer:** B
   - **Explanation:** Always read the AI pre-screening first to understand what the AI surfaced, then independently verify.

2. **What does the AI pre-screening provide?**
   - **Correct answer:** B
   - **Explanation:** The pre-screening provides key findings, differentials, and urgent flags for your reference.

3. **How should you approach reviewing multiple files?**
   - **Correct answer:** B
   - **Explanation:** Review all files systematically, starting with the most recent, to ensure complete coverage.

## Module 3: Writing Opinions

1. **What are the three sections of a specialist opinion?**
   - **Correct answer:** B
   - **Explanation:** Every opinion has three sections: Clinical Findings, Clinical Impression, and Recommended Next Steps.

2. **What happens when you sign an opinion?**
   - **Correct answer:** B
   - **Explanation:** Signing notifies the patient and triggers automatic plain-language summary generation.

3. **Why should you reference specific files in your findings?**
   - **Correct answer:** B
   - **Explanation:** File references help patients follow your reasoning and verify your observations.

## Module 4: AI Features

1. **How should you use the AI pre-screening?**
   - **Correct answer:** C
   - **Explanation:** Use pre-screening as a starting point, then independently verify each finding in the actual records.

2. **What should you check in the plain-language summary preview?**
   - **Correct answer:** B
   - **Explanation:** Verify accuracy, completeness, tone, and clarity before the patient sees it.

3. **When is multi-opinion synthesis generated?**
   - **Correct answer:** B
   - **Explanation:** Synthesis is generated automatically when 2+ specialists have signed opinions for the same case.

## Module 5: Critical Findings

1. **What should you do when you identify a critical finding?**
   - **Correct answer:** B
   - **Explanation:** Note the finding prominently and submit immediately. Admin will arrange patient contact.

2. **How does the system handle critical findings?**
   - **Correct answer:** B
   - **Explanation:** The system flags critical findings for admin, who arranges direct patient contact via phone/WhatsApp.

3. **When should you contact admin directly?**
   - **Correct answer:** B
   - **Explanation:** Contact admin directly for immediate escalation or when you notice system errors affecting patient safety.

## Module 6: Availability & Capacity

1. **What determines which cases are routed to you?**
   - **Correct answer:** B
   - **Explanation:** Cases are routed based on subspecialty match, current availability, capacity, and response time.

2. **What happens when you reach your weekly capacity?**
   - **Correct answer:** B
   - **Explanation:** When you reach capacity, new cases route to other available specialists in your subspecialty.

3. **How far in advance should you set unavailability?**
   - **Correct answer:** A
   - **Explanation:** Set unavailability at least 1 week in advance for optimal case routing.
```

- [ ] **Step 4: Commit**

```bash
git add docs/manual/training/specialist-training/05-critical-findings.md docs/manual/training/specialist-training/06-availability-and-capacity.md docs/manual/training/specialist-training/quiz-answers.md
git commit -m "docs: add specialist training modules 5-6 and quiz answers"
```

---

## Task 8: Create Admin Training Modules 1-3

**Files:**
- Create: `docs/manual/training/admin-training/01-dashboard-operations.md`
- Create: `docs/manual/training/admin-training/02-specialist-verification.md`
- Create: `docs/manual/training/admin-training/03-case-routing.md`

**Interfaces:**
- Consumes: Module template from Task 1
- Produces: First three admin modules for subsequent modules to reference

- [ ] **Step 1: Create Module 1 — Dashboard Operations**

Create `docs/manual/training/admin-training/01-dashboard-operations.md`:

```markdown
# Module 1: Dashboard Operations

**Role:** Admin
**Duration:** ~15 minutes
**Prerequisites:** None

## Learning Objectives

After completing this module, you will be able to:

1. Navigate the admin dashboard
2. Interpret key metrics and alerts
3. Respond to system alerts appropriately
4. Use the dashboard for daily operations

## Dashboard Overview

The admin dashboard provides a real-time overview of platform activity:

> **[PLACEHOLDER: screenshot]** — Admin dashboard with key sections labeled

### Main Dashboard Sections

| Section | What It Shows |
|---------|--------------|
| **Active Cases** | Cases currently in progress with status distribution |
| **Pending Verifications** | Specialist accounts awaiting credential review |
| **Queue Depth** | Unmatched cases waiting for specialist assignment |
| **Response Times** | Average specialist response time |
| **Dispute Count** | Open disputes requiring attention |
| **System Health** | API response times, error rates, service status |

## Key Metrics

| Metric | Target | Alert Threshold |
|--------|--------|----------------|
| Specialist response time | 24-48 hours | > 48 hours |
| Case routing match time | < 4 hours | > 4 hours |
| Dispute resolution time | < 72 hours | > 72 hours |
| System uptime | 99.9% | < 99.5% |

> **[PLACEHOLDER: screenshot]** — Metrics panel with targets and alerts

### Interpreting Metrics

| Metric Status | What It Means | Your Action |
|--------------|---------------|-------------|
| **Green** | Within target | Monitor, no action needed |
| **Yellow** | Approaching threshold | Investigate, prepare for escalation |
| **Red** | Exceeds threshold | Immediate action required |

## Responding to Alerts

### Alert Types

| Alert | Trigger | Priority |
|-------|---------|----------|
| **Unmatched cases** | Cases unmatched >4 hours | High |
| **Critical findings** | Specialist flags critical finding | Critical |
| **Dispute raised** | Patient raises dispute | Medium |
| **Verification queue** | New specialist registrations | Medium |
| **System health** | Error rates >1% or uptime <99.5% | Critical |

### Response Workflow

1. **Acknowledge** — Click the alert to acknowledge you've seen it
2. **Assess** — Determine urgency and required action
3. **Act** — Take appropriate action (see specific modules)
4. **Document** — Log your actions in the audit system
5. **Follow up** — Verify resolution

> **[PLACEHOLDER: screenshot]** — Alert notification with acknowledgment button

## Daily Operations Checklist

| Time | Task |
|------|------|
| **Morning** | Review overnight alerts, check system health |
| **Midday** | Review verification queue, check case routing |
| **Afternoon** | Review disputes, check response times |
| **End of day** | Verify all critical alerts addressed |

## Practice Scenario

**Scenario:** You log in to the admin dashboard and see 3 alerts.

**Your task:**
1. Review the dashboard metrics
2. Identify the 3 alerts
3. Determine the priority of each
4. Acknowledge all alerts
5. Take appropriate action for the highest priority alert

**Expected outcome:** You've reviewed all alerts and taken action on the most urgent one.

## Common Mistakes

| Mistake | Why It's Wrong | What to Do Instead |
|---------|---------------|-------------------|
| Ignoring alerts | Critical issues may escalate | Acknowledge and address all alerts promptly |
| Not checking dashboard regularly | Issues may go unnoticed | Follow daily operations checklist |
| Acting without assessing priority | May waste time on low-priority items | Assess priority before taking action |

## Knowledge Check

1. **What does "Queue Depth" show?**
   - A) Total number of cases on the platform
   - B) Unmatched cases waiting for specialist assignment
   - C) Cases in progress
   - D) Completed cases
   - **Correct answer:** B — Queue Depth shows unmatched cases waiting for specialist assignment.

2. **What should you do when a metric turns red?**
   - A) Ignore it
   - B) Take immediate action
   - C) Wait and see if it improves
   - D) Contact the patient
   - **Correct answer:** B — Red metrics indicate threshold exceeded and require immediate action.

3. **When should you review the dashboard?**
   - A) Once a week
   - B) Only when alerts appear
   - C) Multiple times daily following the checklist
   - D) Only on weekdays
   - **Correct answer:** C — Follow the daily operations checklist for multiple reviews throughout the day.

## Summary

In this module, you learned:
- The dashboard shows active cases, verifications, queue depth, response times, and system health
- Metrics have targets and alert thresholds (green/yellow/red)
- Respond to alerts by acknowledging, assessing, acting, documenting, and following up
- Follow the daily operations checklist for consistent monitoring

## Next Steps

→ **Module 2: Specialist Verification** — Learn to review credentials, approve/reject specialists, and handle bulk operations.

---

*Estimated completion time: 15 minutes*
*Pass threshold: 100% (3/3 correct on knowledge check)*
```

- [ ] **Step 2: Create Module 2 — Specialist Verification**

Create `docs/manual/training/admin-training/02-specialist-verification.md`:

```markdown
# Module 2: Specialist Verification

**Role:** Admin
**Duration:** ~15 minutes
**Prerequisites:** Module 1: Dashboard Operations

## Learning Objectives

After completing this module, you will be able to:

1. Access the specialist verification queue
2. Review credential documents
3. Approve or reject specialist applications
4. Handle bulk verification operations

## Verification Queue

Navigate to **Specialists > Pending Verification** to see accounts awaiting review:

> **[PLACEHOLDER: screenshot]** — Verification queue with pending specialists

### Queue Information

| Field | Description |
|-------|-------------|
| **Specialist name** | Full name of the applicant |
| **Email** | Contact email |
| **Specialty** | Declared specialty and subspecialties |
| **Submission date** | When they registered |
| **Documents** | Uploaded credential documents |

## Reviewing Credentials

### Step 1: Open the Specialist Profile

Click on a specialist to view their full profile:

> **[PLACEHOLDER: screenshot]** — Specialist profile with documents section

### Step 2: Review Documents

Check each uploaded document:

| Document | What to Check |
|----------|--------------|
| **Medical license** | Current, unrestricted, matches name |
| **Board certification** | Valid, relevant to declared specialty |
| **Affiliation letter** | Hospital or clinic affiliation, dated |
| **Registration number** | Verifiable against national registry |

### Step 3: Verify Registration Number

Cross-reference with national medical registry if available:
1. Copy the registration number
2. Search the national registry database
3. Verify the specialist's details match
4. Note any discrepancies

> **[PLACEHOLDER: screenshot]** — Registration verification process

## Approval Decision

### Approve

Click **"Approve"** when:
- All documents are valid and current
- Registration number is verified
- Subspecialties match credentials
- No discrepancies found

**What happens after approval:**
1. Account becomes active
2. Specialist can receive cases
3. Specialist is notified via email

### Reject

Click **"Reject"** when:
- Documents are expired or invalid
- Registration number cannot be verified
- Credentials don't match declared specialty
- Discrepancies found

**What happens after rejection:**
1. Account remains inactive
2. Specialist is notified with reason
3. Specialist can reapply with correct documents

### Request More Information

Click **"Request Information"** when:
- Documents are unclear or incomplete
- Additional documentation needed
- Clarification required

**What happens after request:**
1. Specialist is notified of what's needed
2. Specialist uploads additional documents
3. Case returns to verification queue

## Verification Criteria

| Criterion | Required | Notes |
|-----------|----------|-------|
| Valid medical license | Yes | Must be current and unrestricted |
| Board certification | Recommended | Not required for all subspecialties |
| Affiliation letter | Yes | Hospital or clinic affiliation |
| Registration number | Yes | Verifiable against national registry |

## Bulk Operations

For handling multiple verifications:

1. Select multiple specialists using checkboxes
2. Choose bulk action:
   - **Bulk approve** — Approve all selected
   - **Bulk reject** — Reject all selected (requires reason)
   - **Export** — Download verification queue as CSV
3. Confirm the action

> **[PLACEHOLDER: screenshot]** — Bulk selection and action interface

## Practice Scenario

**Scenario:** Three specialists have submitted verification requests. Review and process them.

**Your task:**
1. Open the verification queue
2. Review Specialist A's documents (approve)
3. Review Specialist B's documents (request more information)
4. Review Specialist C's documents (reject)
5. Document your reasons for each decision

**Expected outcome:** All three specialists have been processed with appropriate decisions and documentation.

## Common Mistakes

| Mistake | Why It's Wrong | What to Do Instead |
|---------|---------------|-------------------|
| Approving without checking all documents | Invalid credentials may slip through | Review every document thoroughly |
| Not verifying registration number | Fake credentials could be approved | Always cross-reference with national registry |
| Not documenting rejection reasons | Specialist doesn't know why they were rejected | Always provide clear, specific reasons |

## Knowledge Check

1. **What documents are required for verification?**
   - A) Only a medical license
   - B) Medical license, affiliation letter, and registration number
   - C) Only board certification
   - D) All documents are optional
   - **Correct answer:** B — Required documents are medical license, affiliation letter, and registration number.

2. **What should you do when documents are unclear?**
   - A) Approve anyway
   - B) Reject immediately
   - C) Request more information from the specialist
   - D) Ignore the application
   - **Correct answer:** C — Request additional information or clarification when documents are unclear.

3. **What happens after a specialist is approved?**
   - A) They can immediately receive cases
   - B) They must wait 24 hours
   - C) They need to complete training first
   - D) Nothing happens
   - **Correct answer:** A — Approved specialists can immediately receive cases routed to their subspecialty.

## Summary

In this module, you learned:
- The verification queue shows pending specialist applications
- Review all required documents: license, affiliation letter, registration number
- Always verify registration number against national registry
- Document reasons for approval, rejection, or information requests

## Next Steps

→ **Module 3: Case Routing** — Learn to understand AI routing, perform manual overrides, and handle unmatched cases.

---

*Estimated completion time: 15 minutes*
*Pass threshold: 100% (3/3 correct on knowledge check)*
```

- [ ] **Step 3: Create Module 3 — Case Routing**

Create `docs/manual/training/admin-training/03-case-routing.md`:

```markdown
# Module 3: Case Routing

**Role:** Admin
**Duration:** ~15 minutes
**Prerequisites:** Module 2: Specialist Verification

## Learning Objectives

After completing this module, you will be able to:

1. Understand how AI routing works
2. Perform manual case assignment
3. Override automatic routing when needed
4. Handle unmatched cases

## How AI Routing Works

The AI routing system matches cases to specialists based on:

| Factor | Weight | Description |
|--------|--------|-------------|
| **Subspecialty match** | High | Case type matches specialist's declared subspecialties |
| **Availability** | High | Specialist is currently available |
| **Capacity** | Medium | Specialist hasn't reached weekly maximum |
| **Response time** | Low | Faster responders may get priority |

> **[PLACEHOLDER: diagram]** — AI routing decision flowchart

### Routing Process

1. **Case submitted** — Patient creates a case
2. **AI analyzes** — System identifies required subspecialty
3. **Match specialists** — Find available specialists with matching subspecialty
4. **Route case** — Assign to best-match specialist
5. **Notify specialist** — Email and dashboard notification

## Manual Routing

When AI routing fails or requires override:

### Step 1: Identify Unmatched Cases

Go to **Cases > Unmatched** to see cases waiting for assignment:

> **[PLACEHOLDER: screenshot]** — Unmatched cases queue

### Step 2: Review Case Details

For each unmatched case:
- Service type requested
- Patient description
- Required subspecialty
- Urgency level
- Time unmatched (displayed in queue)

### Step 3: Assign Specialist

1. Click **"Assign Specialist"**
2. Filter available specialists by subspecialty
3. Review specialist details (availability, capacity, response time)
4. Select the best match
5. Confirm assignment

> **[PLACEHOLDER: screenshot]** — Specialist selection interface

### Step 4: Verify Assignment

After assignment:
1. Specialist receives notification
2. Case status changes to `UNDER_REVIEW`
3. Verify in the dashboard that case is no longer unmatched

## Routing Override

Override automatic routing when:

| Situation | Action |
|-----------|--------|
| AI matched wrong subspecialty | Manually reassign to correct specialist |
| Patient requested specific specialist | Check availability and reassign if possible |
| Specialist declined case | Reassign to next available specialist |
| Urgent case needs specific expertise | Override queue and assign to expert |

### Override Process

1. Go to the case detail view
2. Click **"Reassign"** or **"Override Routing"**
3. Select new specialist
4. Enter reason for override
5. Confirm reassignment

> **[PLACEHOLDER: screenshot]** — Override routing interface

**Important:** All overrides are logged in the audit system for compliance.

## Handling Unmatched Cases

### Alert Threshold

Cases unmatched for **>4 hours** trigger an admin alert.

### Resolution Workflow

1. **Receive alert** — Dashboard shows unmatched cases alert
2. **Review queue** — Check Cases > Unmatched
3. **Identify cause** — Why wasn't the case matched?
   - No available specialists in subspecialty?
   - All specialists at capacity?
   - AI routing error?
4. **Take action** — Manually assign or escalate
5. **Document** — Log the cause and resolution

### Common Causes and Solutions

| Cause | Solution |
|-------|----------|
| No specialists in subspecialty | Contact specialist network for new recruits |
| All specialists at capacity | Temporarily increase capacity or find on-call specialist |
| AI routing error | Manually assign and report the routing issue |
| Incomplete case information | Contact patient for missing details |

## Practice Scenario

**Scenario:** A case has been unmatched for 5 hours. Investigate and resolve.

**Your task:**
1. Review the unmatched case details
2. Identify why it wasn't matched automatically
3. Find an available specialist in the required subspecialty
4. Manually assign the case
5. Verify the assignment was successful
6. Document the cause and resolution

**Expected outcome:** The case is assigned to a specialist and the routing issue is documented.

## Common Mistakes

| Mistake | Why It's Wrong | What to Do Instead |
|---------|---------------|-------------------|
| Ignoring unmatched cases | Patients wait for opinions | Address unmatched cases promptly |
| Assigning without checking availability | Specialist may not be able to review | Verify specialist availability before assigning |
| Not documenting overrides | Audit trail incomplete | Always document override reasons |

## Knowledge Check

1. **What factors does AI routing consider?**
   - A) Only subspecialty
   - B) Subspecialty match, availability, capacity, and response time
   - C) Random assignment
   - D) Patient preference only
   - **Correct answer:** B — AI routing considers subspecialty match, availability, capacity, and response time.

2. **When should you override automatic routing?**
   - A) Never
   - B) When AI matched wrong subspecialty, patient requested specific specialist, or urgent case needs expertise
   - C) Only for urgent cases
   - D) Only when patients complain
   - **Correct answer:** B — Override when AI matched wrong subspecialty, patient requested specific specialist, or urgent case needs specific expertise.

3. **What triggers an alert for unmatched cases?**
   - A) 1 hour
   - B) 4 hours
   - C) 24 hours
   - D) 48 hours
   - **Correct answer:** B — Cases unmatched for >4 hours trigger an admin alert.

## Summary

In this module, you learned:
- AI routing matches cases based on subspecialty, availability, capacity, and response time
- Manually assign cases when AI routing fails
- Override routing when subspecialty match is wrong or specific expertise is needed
- Address unmatched cases promptly when alerts trigger

## Next Steps

→ **Module 4: Dispute Resolution** — Learn to review disputes, assign peer reviews, and communicate resolutions.

---

*Estimated completion time: 15 minutes*
*Pass threshold: 100% (3/3 correct on knowledge check)*
```

- [ ] **Step 4: Commit**

```bash
git add docs/manual/training/admin-training/01-dashboard-operations.md docs/manual/training/admin-training/02-specialist-verification.md docs/manual/training/admin-training/03-case-routing.md
git commit -m "docs: add admin training modules 1-3"
```

---

## Task 9: Create Admin Training Modules 4-5 and Quiz Answers

**Files:**
- Create: `docs/manual/training/admin-training/04-dispute-resolution.md`
- Create: `docs/manual/training/admin-training/05-compliance-audit.md`
- Create: `docs/manual/training/admin-training/quiz-answers.md`

**Interfaces:**
- Consumes: Module template from Task 1, modules 1-3 from Task 8
- Produces: Complete admin training track with quiz answers

- [ ] **Step 1: Create Module 4 — Dispute Resolution**

Create `docs/manual/training/admin-training/04-dispute-resolution.md`:

```markdown
# Module 4: Dispute Resolution

**Role:** Admin
**Duration:** ~15 minutes
**Prerequisites:** Module 3: Case Routing

## Learning Objectives

After completing this module, you will be able to:

1. Review patient disputes
2. Investigate the case and opinion
3. Assign peer reviews when needed
4. Communicate resolutions to patients

## What Is a Dispute?

A dispute is raised when a patient is not satisfied with a specialist opinion. Patients can dispute through the portal, and admin reviews the case.

### Dispute Reasons

| Reason | Description |
|--------|-------------|
| **Clinical concern** | Patient believes opinion is inaccurate |
| **Incomplete review** | Patient feels records weren't fully reviewed |
| **Communication issue** | Opinion unclear or hard to understand |
| **Scope concern** | Patient believes opinion didn't address their concerns |

> **[PLACEHOLDER: screenshot]** — Dispute notification and queue

## Reviewing Disputes

### Step 1: Access the Dispute Queue

Go to **Cases > Disputes** to see open disputes:

| Field | Description |
|-------|-------------|
| **Case ID** | Unique case identifier |
| **Patient name** | Patient who raised the dispute |
| **Specialist name** | Specialist who wrote the opinion |
| **Dispute reason** | Patient's stated reason |
| **Date raised** | When the dispute was filed |
| **Status** | New, Under Review, Resolved |

### Step 2: Review the Case

1. Open the disputed case
2. Read the specialist opinion
3. Read the patient's dispute explanation
4. Review all uploaded records
5. Check the AI pre-screening
6. Review any follow-up questions

> **[PLACEHOLDER: screenshot]** — Case detail view with dispute information

### Step 3: Assess the Situation

Determine if the dispute is valid:

| Assessment | Action |
|-----------|--------|
| Opinion appears accurate | Prepare explanation for patient |
| Opinion may have gaps | Assign peer review |
| Clear communication issue | Contact specialist for clarification |
| Clinical error identified | Immediate escalation |

## Assigning Peer Reviews

When the opinion may have gaps or needs second opinion:

1. Click **"Assign Peer Review"**
2. Select a specialist in the same subspecialty
3. Provide context (original case, opinion, dispute reason)
4. Confirm assignment

> **[PLACEHOLDER: screenshot]** — Peer review assignment interface

### Peer Review Process

1. **Peer specialist reviews** — Independent review of same records
2. **Peer writes opinion** — Separate opinion on the case
3. **Admin compares** — Review both opinions
4. **Admin decides** — Accept peer opinion, request clarification, or escalate

**Note:** Peer reviews are provided at no extra cost to the patient.

## Communicating Resolutions

### Resolution Types

| Resolution | When to Use |
|-----------|-------------|
| **Opinion upheld** | Original opinion was accurate, explain to patient |
| **Opinion revised** | Peer review found issues, new opinion issued |
| **Partial refund** | Service didn't meet expectations |
| **Full refund** | Significant error or platform failure |
| **Apology** | Communication or process issue |

### Communication Template

> Dear [Patient Name],
>
> Thank you for raising your concern about case [Case ID]. We have reviewed your case thoroughly.
>
> [Explanation of review process]
>
> [Resolution outcome]
>
> [Next steps or additional support]
>
> If you have further questions, please contact us through the portal.
>
> Dr. Bubal Care Support Team

> **[PLACEHOLDER: screenshot]** — Resolution communication interface

## Practice Scenario

**Scenario:** A patient disputes a specialist opinion, believing the specialist missed something in their records.

**Your task:**
1. Review the disputed case
2. Read the specialist opinion and patient's explanation
3. Review the uploaded records
4. Determine if a peer review is needed
5. If needed, assign a peer review
6. Communicate the resolution to the patient

**Expected outcome:** You've investigated the dispute and taken appropriate action (peer review or direct resolution).

## Common Mistakes

| Mistake | Why It's Wrong | What to Do Instead |
|---------|---------------|-------------------|
| Dismissing disputes without review | Patient concerns may be valid | Always investigate thoroughly |
| Not assigning peer reviews when needed | Second opinion may reveal issues | Assign peer review when opinion may have gaps |
| Delaying resolution | Patient is waiting for answer | Address disputes within 72 hours |

## Knowledge Check

1. **What should you do first when reviewing a dispute?**
   - A) Contact the specialist
   - B) Review the case, opinion, and patient's explanation
   - C) Issue a refund immediately
   - D) Close the dispute
   - **Correct answer:** B — Always review the complete case, opinion, and patient's explanation before taking action.

2. **When should you assign a peer review?**
   - A) For every dispute
   - B) When the opinion may have gaps or needs a second opinion
   - C) Only for urgent cases
   - D) Never
   - **Correct answer:** B — Assign peer review when the opinion may have gaps or needs a second opinion.

3. **What is the target dispute resolution time?**
   - A) 24 hours
   - B) 48 hours
   - C) 72 hours
   - D) 1 week
   - **Correct answer:** C — Target dispute resolution time is <72 hours.

## Summary

In this module, you learned:
- Disputes are patient concerns about specialist opinions
- Review the complete case, opinion, and patient's explanation
- Assign peer reviews when the opinion may have gaps
- Communicate resolutions clearly and promptly

## Next Steps

→ **Module 5: Compliance & Audit** — Learn to access audit logs, monitor data access, and handle GDPR requests.

---

*Estimated completion time: 15 minutes*
*Pass threshold: 100% (3/3 correct on knowledge check)*
```

- [ ] **Step 2: Create Module 5 — Compliance & Audit**

Create `docs/manual/training/admin-training/05-compliance-audit.md`:

```markdown
# Module 5: Compliance & Audit

**Role:** Admin
**Duration:** ~15 minutes
**Prerequisites:** Module 4: Dispute Resolution

## Learning Objectives

After completing this module, you will be able to:

1. Access and interpret audit logs
2. Monitor data access for compliance
3. Handle GDPR data requests
4. Understand compliance requirements

## Audit Logging

Every access to patient data is logged for compliance:

### What Gets Logged

| Event | Details Logged |
|-------|---------------|
| **File access** | Who accessed which file, when, purpose |
| **Case view** | Who viewed case details, when |
| **Opinion access** | Who read specialist opinions, when |
| **Data export** | Who exported data, what data, when |
| **Data deletion** | Deletion requests and completion |

> **[PLACEHOLDER: screenshot]** — Audit log interface with filters

### Accessing Audit Logs

1. Go to **Compliance > Audit Logs**
2. Use filters to narrow results:
   - Date range
   - User type (patient, specialist, admin)
   - Action type (view, edit, export, delete)
   - Resource type (case, file, opinion)
3. Export logs for compliance reporting

### Interpreting Audit Logs

| Field | What It Shows |
|-------|--------------|
| **Timestamp** | When the action occurred |
| **User** | Who performed the action |
| **Action** | What was done |
| **Resource** | What was accessed |
| **IP address** | Where the action came from |
| **Purpose** | Why the access occurred |

## Monitoring Data Access

### Regular Monitoring

| Frequency | Task |
|-----------|------|
| **Daily** | Review critical access alerts |
| **Weekly** | Check for unusual access patterns |
| **Monthly** | Full audit log review |
| **Quarterly** | Compliance report generation |

### Red Flags to Watch

| Pattern | What It May Indicate |
|---------|---------------------|
| **Access outside normal hours** | Unauthorized access attempt |
| **Bulk data export** | Potential data breach |
| **Access to unrelated cases** | Curiosity access (policy violation) |
| **Multiple failed login attempts** | Potential security threat |

> **[PLACEHOLDER: screenshot]** — Alert for unusual access pattern

## GDPR Data Requests

### Types of Requests

| Right | Request Type | Response Time |
|-------|-------------|---------------|
| **Right to access** | Copy of all personal data | 30 days |
| **Right to rectification** | Correction of inaccurate data | 30 days |
| **Right to erasure** | Deletion of personal data | 30 days |
| **Right to data portability** | Export in machine-readable format | 30 days |

### Handling Access Requests

1. **Receive request** — Patient submits request through portal
2. **Verify identity** — Confirm requester is the data subject
3. **Compile data** — Gather all relevant personal data
4. **Review for exemptions** — Check for data that may be retained (compliance, legal)
5. **Provide data** — Export and share with patient
6. **Document** — Log the request and response in audit system

> **[PLACEHOLDER: screenshot]** — Data request processing interface

### Handling Deletion Requests

1. **Receive request** — Patient requests data deletion
2. **Verify identity** — Confirm requester is the data subject
3. **Check retention requirements** — Identify data that must be retained for compliance
4. **Delete data** — Remove all non-retained data within 30 days
5. **Confirm deletion** — Notify patient when complete
6. **Document** — Log the request and completion

**Important:** Audit logs are retained for compliance even after patient data deletion.

## Compliance Requirements

### GDPR Requirements

| Requirement | Implementation |
|-------------|---------------|
| **Lawful basis** | Explicit consent for AI processing |
| **Data minimization** | Only collect necessary data |
| **Purpose limitation** | Use data only for stated purposes |
| **Storage limitation** | Delete data when no longer needed |
| **Integrity & confidentiality** | Encryption and access controls |
| **Accountability** | Audit logging and documentation |

### HIPAA Requirements

| Requirement | Implementation |
|-------------|---------------|
| **Privacy rule** | Limit PHI access to authorized users |
| **Security rule** | Technical safeguards for ePHI |
| **Breach notification** | Notify affected individuals and HHS |
| **Business associates** | Agreements with AI/LLM providers |

## Practice Scenario

**Scenario:** A patient requests a copy of all their data under GDPR.

**Your task:**
1. Receive the data access request
2. Verify the patient's identity
3. Compile all personal data (profile, cases, opinions, uploads)
4. Review for any exemptions
5. Export the data in a machine-readable format
6. Share with the patient
7. Document the request and response

**Expected outcome:** The patient receives a complete copy of their data within 30 days.

## Common Mistakes

| Mistake | Why It's Wrong | What to Do Instead |
|---------|---------------|-------------------|
| Ignoring audit logs | Compliance violations may go unnoticed | Monitor logs regularly following the schedule |
| Delaying GDPR requests | Legal requirement is 30 days | Process requests promptly |
| Not documenting actions | Audit trail incomplete | Log all compliance-related actions |

## Knowledge Check

1. **What should you do when you notice unusual access patterns?**
   - A) Ignore it
   - B) Investigate immediately and document
   - C) Wait and see if it happens again
   - D) Contact the patient
   - **Correct answer:** B — Investigate unusual access patterns immediately and document your findings.

2. **What is the response time for GDPR data requests?**
   - A) 7 days
   - B) 14 days
   - C) 30 days
   - D) 60 days
   - **Correct answer:** C — GDPR requires response within 30 days.

3. **What happens to audit logs when patient data is deleted?**
   - A) Everything is deleted
   - B) Audit logs are retained for compliance
   - C) Logs are archived for 1 year
   - D) Logs are transferred to the patient
   - **Correct answer:** B — Audit logs are retained for compliance even after patient data deletion.

## Summary

In this module, you learned:
- Every data access is logged for compliance
- Monitor audit logs daily, weekly, monthly, and quarterly
- GDPR requests must be responded to within 30 days
- Audit logs are retained even after patient data deletion

## Congratulations!

You've completed the admin training program! You now know how to:
- Navigate the admin dashboard and interpret metrics
- Verify specialist credentials and manage applications
- Route cases manually and override AI routing when needed
- Resolve patient disputes and assign peer reviews
- Access audit logs and handle GDPR requests

**What's next?** Use the platform with confidence. If you need help, refer to the [Admin Guide](../guides/admin-guide.md) or contact platform lead support.

---

*Estimated completion time: 15 minutes*
*Pass threshold: 100% (3/3 correct on knowledge check)*
```

- [ ] **Step 3: Create quiz answers**

Create `docs/manual/training/admin-training/quiz-answers.md`:

```markdown
# Admin Training — Quiz Answers

## Module 1: Dashboard Operations

1. **What does "Queue Depth" show?**
   - **Correct answer:** B
   - **Explanation:** Queue Depth shows unmatched cases waiting for specialist assignment.

2. **What should you do when a metric turns red?**
   - **Correct answer:** B
   - **Explanation:** Red metrics indicate threshold exceeded and require immediate action.

3. **When should you review the dashboard?**
   - **Correct answer:** C
   - **Explanation:** Follow the daily operations checklist for multiple reviews throughout the day.

## Module 2: Specialist Verification

1. **What documents are required for verification?**
   - **Correct answer:** B
   - **Explanation:** Required documents are medical license, affiliation letter, and registration number.

2. **What should you do when documents are unclear?**
   - **Correct answer:** C
   - **Explanation:** Request additional information or clarification when documents are unclear.

3. **What happens after a specialist is approved?**
   - **Correct answer:** A
   - **Explanation:** Approved specialists can immediately receive cases routed to their subspecialty.

## Module 3: Case Routing

1. **What factors does AI routing consider?**
   - **Correct answer:** B
   - **Explanation:** AI routing considers subspecialty match, availability, capacity, and response time.

2. **When should you override automatic routing?**
   - **Correct answer:** B
   - **Explanation:** Override when AI matched wrong subspecialty, patient requested specific specialist, or urgent case needs specific expertise.

3. **What triggers an alert for unmatched cases?**
   - **Correct answer:** B
   - **Explanation:** Cases unmatched for >4 hours trigger an admin alert.

## Module 4: Dispute Resolution

1. **What should you do first when reviewing a dispute?**
   - **Correct answer:** B
   - **Explanation:** Always review the complete case, opinion, and patient's explanation before taking action.

2. **When should you assign a peer review?**
   - **Correct answer:** B
   - **Explanation:** Assign peer review when the opinion may have gaps or needs a second opinion.

3. **What is the target dispute resolution time?**
   - **Correct answer:** C
   - **Explanation:** Target dispute resolution time is <72 hours.

## Module 5: Compliance & Audit

1. **What should you do when you notice unusual access patterns?**
   - **Correct answer:** B
   - **Explanation:** Investigate unusual access patterns immediately and document your findings.

2. **What is the response time for GDPR data requests?**
   - **Correct answer:** C
   - **Explanation:** GDPR requires response within 30 days.

3. **What happens to audit logs when patient data is deleted?**
   - **Correct answer:** B
   - **Explanation:** Audit logs are retained for compliance even after patient data deletion.
```

- [ ] **Step 4: Commit**

```bash
git add docs/manual/training/admin-training/04-dispute-resolution.md docs/manual/training/admin-training/05-compliance-audit.md docs/manual/training/admin-training/quiz-answers.md
git commit -m "docs: add admin training modules 4-5 and quiz answers"
```

---

## Summary

| Task | Files Created | Commit |
|------|--------------|--------|
| 1. Directory structure and templates | 4 files (README, module template, quiz template, glossary) | `docs: add training directory structure and shared templates` |
| 2. Patient modules 1-2 | 2 files | `docs: add patient training modules 1-2` |
| 3. Patient modules 3-4 | 2 files | `docs: add patient training modules 3-4` |
| 4. Patient modules 5-6 + quiz answers | 3 files | `docs: add patient training modules 5-6 and quiz answers` |
| 5. Specialist modules 1-2 | 2 files | `docs: add specialist training modules 1-2` |
| 6. Specialist modules 3-4 | 2 files | `docs: add specialist training modules 3-4` |
| 7. Specialist modules 5-6 + quiz answers | 3 files | `docs: add specialist training modules 5-6 and quiz answers` |
| 8. Admin modules 1-3 | 3 files | `docs: add admin training modules 1-3` |
| 9. Admin modules 4-5 + quiz answers | 3 files | `docs: add admin training modules 4-5 and quiz answers` |
| **Total** | **24 files** | **9 commits** |
