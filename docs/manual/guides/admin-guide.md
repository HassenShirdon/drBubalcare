# Admin Guide

How to use the Dr. Bubal Care admin portal.

## Welcome

As an admin, you are the operational backbone of the Dr. Bubal Care platform. You ensure cases route correctly, specialists are verified, disputes are resolved, and the system operates securely and compliantly.

**Portal URL:** `admin.drbubalcare.com`

## Dashboard Overview

### Main Dashboard

The admin dashboard provides a real-time overview of platform activity:

| Section | What It Shows |
|---------|--------------|
| **Active Cases** | Cases currently in progress with status distribution |
| **Pending Verifications** | Specialist accounts awaiting credential review |
| **Queue Depth** | Unmatched cases waiting for specialist assignment |
| **Response Times** | Average specialist response time (target: 24-48h) |
| **Dispute Count** | Open disputes requiring attention |
| **System Health** | API response times, error rates, service status |

### Key Metrics

| Metric | Target | Alert Threshold |
|--------|--------|----------------|
| Specialist response time | 24-48 hours | > 48 hours |
| Case routing match time | < 4 hours | > 4 hours |
| Dispute resolution time | < 72 hours | > 72 hours |
| System uptime | 99.9% | < 99.5% |

## Specialist Verification

### Verification Queue

Navigate to **Specialists > Pending Verification** to see accounts awaiting review.

### Verification Steps

1. **Review submitted documents** — Medical license, board certification, affiliation letters
2. **Verify registration number** — Cross-reference with national medical registry if available
3. **Check subspecialty match** — Ensure declared subspecialties align with credentials
4. **Approve or reject:**
   - **Approve** — Account becomes active, specialist can receive cases
   - **Reject** — Account remains inactive, specialist notified with reason

### Verification Criteria

| Criterion | Required | Notes |
|-----------|----------|-------|
| Valid medical license | Yes | Must be current and unrestricted |
| Board certification | Recommended | Not required for all subspecialties |
| Affiliation letter | Yes | Hospital or clinic affiliation |
| Registration number | Yes | Verifiable against national registry |

### Bulk Actions

- Select multiple specialists for batch approval
- Export verification queue as CSV
- Filter by specialty, submission date, or verification status

## Case Routing and Assignment

### Manual Routing

When AI routing fails or requires override:

1. Go to **Cases > Unmatched**
2. Review case details (service type, description, subspecialty needed)
3. Click **"Assign Specialist"**
4. Select from available specialists matching the required subspecialty
5. Confirm assignment

### Routing Override

Override automatic routing when:

- No specialist matched within 4 hours (system alerts you)
- Patient requests a specific specialist
- Case requires a subspecialty not in the AI routing model
- Urgent case needs immediate assignment to an available specialist

### Case Status Management

You can manually update case status when needed:

| Status Change | When to Use |
|--------------|-------------|
| `OPEN` → `AI_PRE_SCREENED` | Manual trigger if AI pre-screening is delayed |
| `UNDER_REVIEW` → `OPINION_READY` | If specialist signs but status doesn't update |
| Any → `DISPUTED` | When patient raises a dispute |
| `DISPUTED` → `UNDER_REVIEW` | After resolving a dispute, re-assigning for review |

### Monitoring Case Progress

- View all cases by status in the **Cases** tab
- Filter by date range, specialist, service type, or status
- Set alerts for cases approaching the 48-hour SLA
- View case timeline (all status changes and actions)

## Dispute Resolution

### Dispute Queue

Navigate to **Disputes** to see all open disputes.

### Dispute Workflow

1. **Patient raises dispute** — Patient explains their concern about an opinion
2. **Admin reviews** — Read the original opinion, patient's concern, and case records
3. **Determine action:**
   - **Peer review** — Assign another specialist in the same subspecialty to review the case. No extra cost to the patient.
   - **Direct resolution** — If the concern is about communication (not clinical judgment), address it directly
   - **Dismiss** — If the dispute is not substantiated, dismiss with explanation
4. **Document resolution** — Add admin notes and resolution details
5. **Notify patient** — Patient receives resolution notification

### Dispute Statuses

| Status | Meaning |
|--------|---------|
| `PENDING` | Dispute raised, awaiting admin review |
| `UNDER_REVIEW` | Admin is reviewing the case |
| `PEER_REVIEW_ASSIGNED` | Another specialist has been assigned for peer review |
| `RESOLVED` | Dispute resolved with documented outcome |
| `DISMISSED` | Dispute dismissed as unsubstantiated |

### Peer Review Assignment

When assigning a peer review:

1. Select a specialist in the same subspecialty as the original reviewer
2. The peer reviewer sees the original opinion, case records, and patient's concern
3. Peer reviewer writes an independent opinion
4. Admin compares both opinions and determines outcome
5. Resolution documented and patient notified

## Audit Logging

### Accessing Audit Logs

Navigate to **Compliance > Audit Logs** to view all system activity.

### Log Fields

| Field | Description |
|-------|-------------|
| **User** | Who performed the action |
| **Action** | What was done (READ, CREATE, UPDATE, DELETE) |
| **Resource Type** | What type of resource was accessed (Case, Opinion, User, etc.) |
| **Resource ID** | Specific resource identifier |
| **Before** | Previous state (for updates) |
| **After** | New state (for updates) |
| **Metadata** | Additional context (IP address, user agent) |
| **Timestamp** | When the action occurred |

### Filtering and Search

- Filter by user, action type, resource type, or date range
- Search by resource ID or user email
- Export filtered logs as CSV for compliance reporting
- Set date range for bulk export

### Compliance Requirements

| Requirement | Log Coverage |
|-------------|-------------|
| HIPAA access logging | Every read/write to patient data |
| GDPR audit trail | All data modifications and deletions |
| Clinical governance | All opinion creation, signing, and dispute actions |
| Security monitoring | Failed access attempts, unusual patterns |

## Edge Case Management

### Urgent/Critical Findings

When a specialist identifies a critical finding:

1. The case is flagged in the dashboard with a red indicator
2. **Immediate action required:**
   - Contact the patient directly via phone or WhatsApp
   - Do not rely solely on portal notification
   - Document the contact attempt and outcome
3. Follow up with the specialist if clarification is needed

### No Specialist Matched

If no specialist is matched within 4 hours:

1. The system alerts you via dashboard and email
2. Review the unmatched case
3. Manually assign a specialist or expand the subspecialty search
4. Notify the patient of the revised ETA

### Incomplete Upload

If a specialist flags a case for incomplete or unreadable files:

1. Review the specialist's notes on what's missing
2. Contact the patient with specific instructions
3. Patient re-uploads the required files
4. Case resumes with the same specialist

### Payment Failure

If a case payment fails:

1. Case is not initiated until payment is confirmed
2. Patient is notified with retry options
3. Track payment status in the **Payments** section
4. Follow up if payment remains unresolved after 48 hours

### Specialist Unavailability

If a primary specialist becomes unavailable mid-case:

1. Re-route the case to the next available specialist in the same subspecialty
2. Transfer all case records and AI pre-screening to the new specialist
3. Notify the patient of the change
4. Document the reassignment

## Data Management

### Patient Data

| Action | How |
|--------|-----|
| View patient data | Patients > Select patient > View profile and cases |
| Export patient data | Patients > Select patient > Export (GDPR portability) |
| Delete patient data | Patients > Select patient > Request Deletion (GDPR Article 17) |
| View consent records | Patients > Select patient > Privacy > Consent History |

### Data Deletion Process

Under GDPR Article 17, patients can request full data deletion:

1. Patient submits deletion request via portal
2. Admin reviews the request in **Compliance > Deletion Requests**
3. Check for any legal retention requirements
4. Approve or delay the request (with documented reason)
5. Execute deletion within 30 days of approval
6. Document completion

### Data Retention

| Data Type | Retention Period | Reason |
|-----------|-----------------|--------|
| Case records | 7 years | Medical record retention |
| Audit logs | 7 years | Compliance requirement |
| Opinions | 7 years | Medical record retention |
| Patient profiles | Until deletion request | GDPR right to erasure |
| Payment records | 7 years | Financial compliance |

### Backup and Recovery

- Database backups occur daily (automated via Supabase)
- Backup retention: 30 days
- Recovery procedures documented in the deployment guide
- Test recovery quarterly

## System Monitoring

### Health Dashboard

The system health dashboard shows:

| Metric | Description |
|--------|-------------|
| **API Response Time** | Average response time across all endpoints |
| **Error Rate** | Percentage of failed requests |
| **Database Connections** | Active and idle connections |
| **AI Service Status** | OpenAI API availability and latency |
| **Storage Usage** | File storage consumed vs. available |
| **Queue Depth** | Cases pending specialist assignment |

### Alert Configuration

| Alert | Trigger | Action |
|-------|---------|--------|
| High error rate | > 5% error rate for 5 min | Investigate immediately |
| Slow API | > 2s average response time | Check for resource constraints |
| AI service down | OpenAI API unavailable | Switch to backup or pause AI features |
| Storage full | > 80% capacity | Archive old files or increase storage |
| Specialist queue depth | > 10 unmatched cases | Recruit or reassign specialists |

### Monitoring Tools

- **Vercel Analytics** — Frontend performance and error tracking
- **Supabase Dashboard** — Database performance and connections
- **Custom Admin Dashboard** — Platform-specific metrics and alerts

## FAQ

### How do I handle a case where both the patient and specialist are unresponsive?

If a case is stalled with no activity from either party for 7+ days, contact both parties. If no response after 48 hours, admin can close the case with a "No Response" status.

### Can I view AI pre-screening content?

Yes. Open any case in the admin dashboard. The AI pre-screening is visible in the case detail view alongside the specialist's opinion.

### How do I handle a specialist who consistently misses SLAs?

Track response times in the specialist performance dashboard. After 3 missed SLAs, initiate a conversation with the specialist. Persistent issues may result in reduced case routing or account review.

### Can I override a specialist's opinion?

No. Admin cannot modify, override, or delete specialist opinions. If an opinion needs correction, the specialist must be contacted to submit a corrected opinion (before signing), or a peer review must be assigned.

### How do I export data for compliance reporting?

Navigate to the relevant section (Audit Logs, Cases, Patients), apply filters, and click **"Export CSV"**. Exports include all filtered records with full detail.

### What's the difference between a dispute and a peer review?

A dispute is a patient's formal complaint about an opinion. A peer review is the resolution mechanism — a second specialist independently reviews the same case. Not all disputes result in peer reviews; some are resolved through direct communication.
