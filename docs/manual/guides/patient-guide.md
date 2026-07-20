# Patient Guide

How to use the Dr. Bubal Care patient portal.

## Welcome

Welcome to Dr. Bubal Care. You're using an AI-assisted diagnostic coordination platform that connects you with board-certified specialists around the world. AI helps coordinate your case, but every clinical decision is made by a human specialist.

**Portal URL:** `patient.drbubalcare.com`

## Registration and Account Setup

### Creating Your Account

1. Go to `patient.drbubalcare.com`
2. Click **"Get Started"** or **"Register"**
3. Fill in your details:
   - Full name
   - Email address
   - Country of residence
   - Password (minimum 8 characters)
4. Verify your email via the confirmation link
5. Complete your profile with any additional information

Registration takes under 2 minutes. You do not need to provide medical credentials — only basic personal information.

### Account Settings

Access your account settings from the dashboard menu:

- **Profile** — Update your name, email, and country
- **Password** — Change your password
- **Notifications** — Configure email and portal notification preferences
- **Privacy** — Manage consent for AI processing and data usage
- **Delete Account** — Request full data deletion (GDPR Article 17)

## Starting a Case

A case is your request for a specialist opinion on your medical records.

### Step 1: Choose a Service Type

| Service Type | What You Get | Typical Use |
|-------------|-------------|-------------|
| **Specialist Opinion** | Written opinion from a board-certified specialist | Slides, scans, or reports reviewed by an expert |
| **Result Interpretation** | Plain-language explanation of existing results | You have lab results but need help understanding them |
| **Direct Consultation** | Live video consultation with a specialist | Need to discuss your case directly with a specialist |
| **Trend Analysis** | Longitudinal tracking of lab results over time | Repeat lab tests that need to be tracked for changes |

### Step 2: Describe Your Case

- Select the relevant body system or specialty area
- Provide a brief description of your situation
- Note any urgency (routine, soon, urgent)

### Step 3: Upload Records

See the [File Upload section](#uploading-files) below for detailed instructions.

### Step 4: Choose a Service and Pay

- Select single-expert or panel review (2-4 specialists)
- See exact price before confirming
- Pay by card (USD) or local payment method
- Case begins immediately after payment confirmation

### Case Status Tracking

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
| `DISPUTED` | You've raised a dispute about the opinion |

You receive email notifications at each status change.

## Uploading Files

### Supported File Types

| File Type | Examples | Use Case |
|-----------|----------|----------|
| **Medical images** | JPEG, PNG, TIFF | Histopathology slides, X-rays, ultrasounds |
| **DICOM files** | `.dcm` | CT scans, MRI scans, PET scans |
| **Documents** | PDF, DOCX | Lab reports, clinical notes, referral letters |
| **Lab results** | PDF, CSV | Blood work, urinalysis, genetic tests |

### Upload Steps

1. In your case, click **"Upload Records"**
2. Drag and drop files or click to browse
3. Name each file descriptively (e.g., "CBC Results - Jan 2026" not "file1.pdf")
4. Wait for upload confirmation — files are encrypted before storage
5. Add notes to each file if needed (e.g., "This is the latest scan from my oncologist")

### File Size Limits

- Maximum file size: 50 MB per file
- Maximum files per case: 20
- Total storage: 500 MB per patient account

### Security

All uploaded files are encrypted at rest and in transit. Files are stored using short-lived, expiring signed URLs. After your case is closed, files are retained according to our data retention policy and can be deleted upon request.

## Viewing Your Report

### Specialist Opinion

Once a specialist signs their opinion, you'll receive an email notification and can view it in your portal. The opinion contains:

1. **Clinical Findings** — What the specialist observed in your records
2. **Clinical Impression** — The specialist's assessment
3. **Recommended Next Steps** — Suggested actions, referrals, or follow-up tests

### Plain-language Summary

Each opinion includes a plain-language summary that translates medical terminology into everyday language. This is written as if by a trusted GP — no medical jargon.

### Multi-opinion Synthesis (Panel Review)

If you chose a panel review (2-4 specialists), the system automatically generates a synthesis when all opinions are received. This includes:

- **Areas of agreement** — Where specialists agree
- **Areas of disagreement** — Where specialists differ
- **Consensus summary** — An overall synthesis

## Follow-up Q&A

After receiving your opinion, you can ask follow-up questions:

1. Go to your completed case
2. Click **"Ask a Follow-up Question"**
3. Type your question in plain language
4. The AI assistant answers within the documented scope of the written opinion

**Important:** The AI answers questions about the opinion that was written. It cannot provide new diagnoses or opinions. If you need further clinical advice, consider booking a direct consultation.

### Scope Limits

- Questions must relate to the existing opinion
- The AI will note when a question falls outside the opinion's scope
- For clinical questions beyond the opinion, you'll be directed to book a consultation

## Viewing Lab Trends

If you have repeat lab tests, the platform tracks them over time:

1. Navigate to **"Lab Trends"** in your dashboard
2. View charts showing your lab values over time
3. See AI-flagged significant changes highlighted in red/yellow
4. Click on any data point to see the specific result and date

The trend analysis tracks statistically significant changes and alerts you and your care team.

## Appointments

For direct consultations:

1. Browse available specialists in the **"Appointments"** section
2. Select a specialist and view their availability
3. Choose a date and time slot
4. Confirm and pay
5. Receive calendar invitation and reminders

Appointment statuses: `SCHEDULED` → `CONFIRMED` → `IN_PROGRESS` → `COMPLETED` (or `CANCELLED`)

## Managing Disputes

If you're not satisfied with an opinion:

1. Go to the completed case
2. Click **"Raise a Dispute"**
3. Explain your concern in the text field
4. Submit the dispute

An admin will review your case and may assign a peer review at no extra cost. You'll be notified of the resolution via email and portal notification.

## Account Management

### Profile Updates

Update your name, email, or country from **Settings > Profile**. Email changes require re-verification.

### Password Reset

Click "Forgot Password" on the login page, or change your password from **Settings > Password**.

### Data Deletion

Under GDPR Article 17, you can request full data deletion:

1. Go to **Settings > Privacy**
2. Click **"Request Data Deletion"**
3. Confirm your request
4. Your data will be deleted within 30 days (after any legal retention requirements)

### Consent Management

Manage your consent for AI processing from **Settings > Privacy**:

- AI pre-screening of your records
- Plain-language summary generation
- Trend analysis of your lab data

You can revoke consent at any time. Revoking AI consent does not affect your ability to receive specialist opinions.

## FAQ

### How long does it take to get my opinion?

Target turnaround is 24-48 hours from case assignment. Complex cases may take longer. You'll be notified if there's a delay.

### Is my data secure?

Yes. All files are encrypted at rest and in transit. AI processing strips all personally identifiable information (names, date of birth, medical record numbers) before any analysis. Every data access is logged for compliance.

### Can I choose my specialist?

You can request a specific specialist when creating a case, but assignment depends on subspecialty match and availability. If your preferred specialist is unavailable, another qualified specialist in the same subspecialty will be assigned.

### What if I disagree with the opinion?

You can raise a dispute through the portal. An admin will review your case and may assign a peer review at no extra cost.

### Can I get a refund?

Refund policies depend on the case status and service type. Contact support through the portal for refund requests.

### What's the difference between a specialist opinion and a direct consultation?

A specialist opinion is a written assessment of your uploaded records (24-48 hour turnaround). A direct consultation is a live video conversation with a specialist in real time.

### Is the AI providing medical advice?

No. AI is used only to coordinate your case, pre-screen records, and translate specialist opinions into plain language. Every clinical decision is made by a board-certified human specialist.

### Can I share my report with my local doctor?

Yes. You can download your specialist opinion and plain-language summary as PDF to share with your local healthcare provider.
