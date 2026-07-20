# Training Materials Design Spec

**Date:** 2026-07-20
**Status:** Approved
**Author:** AI Assistant
**Reviewer:** User

---

## 1. Overview

This spec defines the training materials for the Dr. Bubal Care platform. The training materials will serve as dedicated learning resources for patients, specialists, and admin staff — separate from the existing reference manuals in `docs/manual/guides/`.

**Core principle:** Reference manuals answer "how do I do X?". Training materials answer "how do I become proficient at using this platform?"

---

## 2. Goals

| Goal | Success Criteria |
|------|-----------------|
| Onboard new users effectively | 90% of users complete training within first week |
| Ensure baseline competency | Pass thresholds met for all modules |
| Build user confidence | Practice scenarios use realistic situations |
| Support certification | Certificate of completion for each role track |
| Scale for future updates | Template-driven structure allows adding modules |

---

## 3. Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Approach** | Linear Module Progression | Best for pre-launch onboarding; ensures consistent baseline training |
| **Module count** | 17 total (6 + 6 + 5) | Covers all key workflows without overwhelming learners |
| **Assessment** | 3 questions per module, 80% pass for patients, 100% for specialists/admins | Accessible for patients; rigorous for clinical/operational roles |
| **Certification** | Certificate of completion | Provides tangible completion artifact; valid for 12 months |
| **Visual content** | `[PLACEHOLDER]` markers | Allows adding screenshots/videos after platform is built |

---

## 4. Directory Structure

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

**Total: 24 files** (17 modules + 3 quiz answers + 3 templates + 1 README)

---

## 5. Module Structure Template

Every module follows this structure:

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

### Design Decisions for Template

| Element | Decision | Rationale |
|---------|----------|-----------|
| Learning objectives | 3-5 per module | Focused, measurable, achievable |
| Placeholders | `[PLACEHOLDER: screenshot/video]` | Clear markers for future media |
| Practice scenarios | Realistic situations | Build confidence through application |
| Common mistakes | Dedicated section | Address real user errors proactively |
| Knowledge check | 3 questions per module | Consistent, scorable, not overwhelming |
| Pass threshold | 80% for patients, 100% for specialists/admins | Accessible for patients; rigorous for clinical/operational roles |

---

## 6. Patient Training Track (6 Modules)

| Module | Title | Duration | Learning Objectives |
|--------|-------|----------|---------------------|
| 1 | Getting Started | ~10 min | Register account, set up profile, understand "AI surfaces; specialists decide" |
| 2 | Your First Case | ~15 min | Create case, choose service type, pay, understand case status flow |
| 3 | Uploading Records | ~10 min | Upload files correctly, understand encryption, name files descriptively |
| 4 | Understanding Reports | ~15 min | Read specialist opinion, understand plain-language summary, interpret panel synthesis |
| 5 | Follow-up & Trends | ~10 min | Ask follow-up questions, view lab trends, book consultations |
| 6 | Account & Privacy | ~10 min | Manage account, handle data deletion, understand consent management |

### Patient-Specific Design Decisions

| Decision | Rationale |
|----------|-----------|
| Non-technical language | Patients may not have medical or technical backgrounds |
| Confidence-building tone | "You can do this" — reduce anxiety about using platform |
| Security emphasis | Build trust by explaining encryption, privacy, GDPR rights |
| Support guidance | Include "When to contact support" in each module |
| Lower pass threshold (80%) | Accessibility — patients learning, not being tested |

### Key Patient Scenarios

- **Module 2:** "You have abnormal blood work from your local doctor. Create your first case to get a specialist opinion."
- **Module 3:** "Upload a PDF lab report and a JPEG image of your X-ray. Name them descriptively."
- **Module 4:** "Read a specialist opinion. Identify the three main sections: findings, impression, next steps."
- **Module 5:** "Ask a follow-up question about your opinion's recommended next steps."

---

## 7. Specialist Training Track (6 Modules)

| Module | Title | Duration | Learning Objectives |
|--------|-------|----------|---------------------|
| 1 | Platform Overview | ~10 min | Understand platform principle, role responsibilities, portal navigation |
| 2 | Case Review Basics | ~20 min | Receive cases, review AI pre-screening, examine clinical records, use DICOM viewer |
| 3 | Writing Opinions | ~20 min | Use structured editor, write findings/impression/next steps, sign and submit |
| 4 | AI Features | ~15 min | Interpret pre-screening, preview plain-language summaries, understand synthesis |
| 5 | Critical Findings | ~10 min | Identify urgent cases, flag critical findings, understand escalation process |
| 6 | Availability & Capacity | ~10 min | Set availability, manage capacity, handle temporary unavailability |

### Specialist-Specific Design Decisions

| Decision | Rationale |
|----------|-----------|
| Medical terminology | Specialists expect and prefer clinical language |
| "AI assists, you decide" emphasis | Build confidence in using AI as a tool, not a replacement |
| Opinion quality focus | Structured format ensures consistency across all cases |
| Error handling guidance | "What if I make a mistake?" — address medicolegal concerns |
| Higher pass threshold (100%) | Clinical accuracy is non-negotiable; missing one question indicates knowledge gap |

### Key Specialist Scenarios

- **Module 2:** "A case arrives with histopathology slides. Walk through the review process from receiving the notification to forming your initial impression."
- **Module 3:** "Write an opinion for a case with abnormal lab results. Use the three-section format: findings, impression, next steps."
- **Module 4:** "Review an AI pre-screening. Identify what's useful for your review and what needs independent verification."
- **Module 5:** "You discover a critical finding requiring immediate attention. What steps do you take?"

---

## 8. Admin Training Track (5 Modules)

| Module | Title | Duration | Learning Objectives |
|--------|-------|----------|---------------------|
| 1 | Dashboard Operations | ~15 min | Navigate admin dashboard, interpret metrics, respond to alerts |
| 2 | Specialist Verification | ~15 min | Review credentials, approve/reject, handle bulk operations |
| 3 | Case Routing | ~15 min | Understand AI routing, manual override, handle unmatched cases |
| 4 | Dispute Resolution | ~15 min | Review disputes, assign peer reviews, communicate resolutions |
| 5 | Compliance & Audit | ~15 min | Access audit logs, monitor data access, handle GDPR requests |

### Admin-Specific Design Decisions

| Decision | Rationale |
|----------|-----------|
| Operational focus | Admins need workflows and decision-making frameworks |
| Urgency triage emphasis | Critical findings and unmatched cases require immediate action |
| Escalation procedures | Clear guidance on when to escalate to legal/medical staff |
| Compliance integration | GDPR and HIPAA requirements woven throughout |
| Higher pass threshold (100%) | Operational accuracy affects patient safety and platform integrity |

### Key Admin Scenarios

- **Module 1:** "Alert: 3 cases have been unmatched for >4 hours. What do you do?"
- **Module 2:** "A specialist submits incomplete credentials. How do you handle this?"
- **Module 3:** "AI routing fails for a rare subspecialty. Perform manual assignment."
- **Module 4:** "A patient disputes an opinion. Walk through the resolution process."
- **Module 5:** "A patient requests data deletion. What's the compliance checklist?"

---

## 9. Assessment & Certification System

### Quiz Format

Each module ends with a **Knowledge Check** (3 questions):

| Question Type | Description | Example |
|--------------|-------------|---------|
| Multiple choice | Single correct answer | "What are the three sections of a specialist opinion?" |
| True/False | Verify understanding of key concepts | "AI pre-screening constitutes a medical diagnosis." |
| Scenario-based | Apply knowledge to realistic situations | "A case has been unmatched for 5 hours. What do you do?" |

### Pass Thresholds

| Role | Pass Threshold | Rationale |
|------|---------------|-----------|
| Patient | 2/3 correct (67%) | Accessibility — patients are learning, not being tested |
| Specialist | 3/3 correct (100%) | Clinical accuracy is non-negotiable |
| Admin | 3/3 correct (100%) | Operational accuracy affects patient safety |

### Retake Policy

| Role | Retakes Allowed | After Exhaustion |
|------|----------------|------------------|
| Patient | Unlimited | N/A |
| Specialist | 3 | Manual review by admin |
| Admin | 3 | Manual review by platform lead |

### Certification

After completing all modules in a track:

```
Certificate of Completion
━━━━━━━━━━━━━━━━━━━━━━━━
Dr. Bubal Care — [Role] Training

Name: [User name]
Completed: [Date]
Modules: [X/X] passed
Score: [Average score]%

This certifies that the above individual has completed
the Dr. Bubal Care [Role] training program and demonstrated
proficiency in all required competencies.
```

**Certification tracking:**
- Stored in user profile (specialist/admin accounts)
- Visible in admin dashboard
- Can be exported as PDF
- Valid for 12 months (then requires refresher training)

---

## 10. Content Guidelines

### Writing Style

| Audience | Tone | Language Level |
|----------|------|----------------|
| Patients | Friendly, reassuring, clear | Plain English, no medical jargon |
| Specialists | Professional, clinical, precise | Medical terminology appropriate |
| Admins | Operational, direct, action-oriented | Business/process language |

### Placeholder Format

All visual content uses this placeholder format:

```markdown
> **[PLACEHOLDER: screenshot]** — Dashboard overview showing active cases and alerts
> **[PLACEHOLDER: video]** — Walkthrough of case creation process (2 min)
> **[PLACEHOLDER: diagram]** — Case status flow from OPEN to CLOSED
```

### Cross-References

Training modules reference (but don't duplicate) content from:
- `docs/manual/guides/` — Reference manuals for detailed feature documentation
- `docs/manual/architecture/` — System architecture for technical context
- `docs/manual/database/` — Schema reference for data model context

---

## 11. File Count Summary

| Category | Files |
|----------|-------|
| Patient training | 6 modules + 1 quiz answers = 7 |
| Specialist training | 6 modules + 1 quiz answers = 7 |
| Admin training | 5 modules + 1 quiz answers = 6 |
| Shared templates | 3 (module, quiz, glossary) |
| README | 1 |
| **Total** | **24 files** |

---

## 12. Differences from Reference Manuals

| Element | Reference Manuals (existing) | Training Materials (new) |
|---------|------------------------------|--------------------------|
| Purpose | Look up how to do something | Learn to do something |
| Structure | Feature-based sections | Progressive learning modules |
| Assessment | None | Knowledge checks + certification |
| Scenarios | None | Realistic practice exercises |
| Common mistakes | None | Dedicated section per module |
| Learning objectives | None | 3-5 per module |
| Visual placeholders | None | `[PLACEHOLDER]` markers |

---

## 13. Implementation Notes

- All content will be created as Markdown files
- `[PLACEHOLDER]` markers will be added for screenshots/videos to capture after platform is built
- Quiz answers will be in separate files (not embedded in modules) to support self-assessment
- Shared templates ensure consistency across all modules
- Glossary provides unified terminology reference

---

## 14. Open Questions

None — all design decisions have been made and approved.
