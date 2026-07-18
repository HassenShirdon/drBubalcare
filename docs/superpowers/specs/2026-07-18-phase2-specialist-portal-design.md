# Phase 2: Specialist Portal — Design Spec

**Date:** 2026-07-18
**Status:** Approved
**Scope:** Specialist registration verification, manual case routing, opinion writing/signing, report delivery

---

## 1. Overview

Phase 2 builds the specialist portal experience on top of Phase 1's foundation. It connects patients to specialists through admin-mediated case routing, gives specialists a structured opinion writing workflow, and delivers signed reports back to patients.

**Core principle:** *"AI surfaces; specialists decide."* — Phase 2 implements the human specialist workflow. AI features (routing, pre-screening, summaries) come in Phase 3.

---

## 2. Schema Changes

### Doctor Model — Add Verification

```prisma
model Doctor {
  // ... existing fields ...
  verified  Boolean  @default(false)
}
```

- Default: `false` (new doctors start unverified)
- Admin toggles to `true` after reviewing credentials
- Only verified doctors can be assigned cases

### SpecialistOpinion — No Schema Change

Keep existing `content String @db.Text` field. The opinion form uses three separate textarea fields that concatenate with markdown headers when saved:

```markdown
## Clinical Findings
[findings text]

## Impression
[impression text]

## Recommended Next Steps
[nextSteps text]
```

When displaying, parse sections by `##` headers.

### No Other Model Changes

Case, CaseRecord, AIPrescreen, PlainLanguageSummary, FollowUpQuestion, AuditLog — all stay as defined in existing schema.

---

## 3. Admin Portal

### 3.1 Specialist Verification (`/admin/specialists`)

**Page:** `app/admin/specialists/page.tsx`

**Layout:**
- Table listing all doctors
- Columns: Name, Specialty, Email, Verified (badge), Joined Date
- Filter tabs: All / Unverified / Verified
- Action: Toggle verified status with confirmation dialog

**Navigation:** Add "Specialists" item to admin sidebar layout.

**API:**
- `GET /api/admin/specialists` — List all doctors with verification status
- `PATCH /api/admin/specialists/[id]/verify` — Toggle `verified` field

### 3.2 Case Routing (`/admin/cases`)

**Page:** `app/admin/cases/page.tsx`

**Layout:**
- Table listing cases
- Columns: Patient Name, Service Type, Created, Status, Assigned Specialist (or "Unassigned")
- Filter tabs: All / Unassigned / Under Review
- Action: "Assign Specialist" button opens dropdown
  - Dropdown shows verified specialists filtered by specialty match to case service type
  - On assign: set `case.specialistId`, transition `case.status` from `OPEN` to `UNDER_REVIEW`
- Action: "Reassign" button (for already-assigned cases) — same dropdown

**Navigation:** Add "Cases" item to admin sidebar layout.

**API:**
- `GET /api/admin/cases/unassigned` — List OPEN cases
- `PATCH /api/admin/cases/[id]/assign` — Set specialistId, transition status

---

## 4. Doctor Portal

### 4.1 My Cases (`/doctor/cases`)

**Page:** `app/doctor/cases/page.tsx`

**Layout:**
- Table listing cases assigned to logged-in specialist
- Columns: Patient Name, Service Type, Status, Assigned Date, Opinion Status
- Filter tabs: All / Pending Review / Opinion Written
- Click row → navigates to `/doctor/cases/[id]`

**Navigation:** Add "My Cases" item to doctor sidebar layout.

**API:**
- `GET /api/doctor/cases` — List cases where `specialistId` matches logged-in user's doctor profile

### 4.2 Case Review (`/doctor/cases/[id]`)

**Page:** `app/doctor/cases/[id]/page.tsx`

**Layout sections (top to bottom):**

1. **Case Header**
   - Patient name, service type, status badge, assigned date

2. **Uploaded Records**
   - List of case records with file name, type, upload date
   - View/download links

3. **AI Pre-screen** (placeholder for Phase 3)
   - If AIPrescreen exists: show findings, differentials, urgent flags
   - If not: "AI pre-screening not yet available" message

4. **Opinion Form** (if no signed opinion exists)
   - Three labeled textarea fields:
     - Clinical Findings (required)
     - Impression (required)
     - Recommended Next Steps (required)
   - "Save as Draft" button → saves with status `DRAFT`
   - "Sign & Submit" button → confirms signature, sets status `SIGNED`, sets `signedAt`, transitions Case to `OPINION_READY`
   - Validation: all three fields required to sign (drafts can be partial)

5. **Signed Opinion Display** (if opinion exists with status SIGNED/DELIVERED)
   - Read-only view showing parsed markdown sections
   - Specialist name, signed timestamp
   - No edit buttons (opinion is final once signed)

**API:**
- `GET /api/doctor/cases/[id]` — Get case with records, prescreens, existing opinion
- `POST /api/doctor/cases/[id]/opinion` — Create or update opinion (draft or signed)

---

## 5. Patient Portal

### 5.1 Report Delivery (Update `/patient/cases/[id]`)

**File:** `app/patient/cases/[id]/page.tsx` (existing)

**Update the "Specialist Opinions" section:**

- Show signed opinions in card layout
- Each card displays:
  - Specialist name and specialty
  - Signed date
  - Parsed markdown content (Findings, Impression, Next Steps as subsections)
  - Status badge (SIGNED, DELIVERED)
- If no opinions: "No specialist opinions yet" message
- If opinion is DRAFT: not visible to patient (only SIGNED/DELIVERED shown)

**No new pages** — just updating the existing case detail component.

---

## 6. API Routes Summary

| Route | Method | Auth | Purpose |
|-------|--------|------|---------|
| `/api/admin/specialists` | GET | Admin | List all doctors with verification status |
| `/api/admin/specialists/[id]/verify` | PATCH | Admin | Toggle verified status |
| `/api/admin/cases/unassigned` | GET | Admin | List cases needing assignment |
| `/api/admin/cases/[id]/assign` | PATCH | Admin | Assign specialist, transition status |
| `/api/doctor/cases` | GET | Doctor | List assigned cases |
| `/api/doctor/cases/[id]` | GET | Doctor | Get case detail with records/prescreens |
| `/api/doctor/cases/[id]/opinion` | POST | Doctor | Create or update opinion (draft/signed) |
| `/api/doctor/cases/[id]/opinion` | GET | Doctor | Get existing opinion |

All routes use NextAuth session check, role-based access, Prisma queries. Follow existing patterns in `app/api/`.

---

## 7. State Transitions

```
Case.status:
  OPEN → UNDER_REVIEW     (admin assigns specialist)
  UNDER_REVIEW → OPINION_READY  (specialist signs opinion)

SpecialistOpinion.status:
  DRAFT → SIGNED  (specialist clicks "Sign & Submit")
```

**Constraints:**
- Only verified doctors can be assigned (admin dropdown filters)
- Doctor can only see cases assigned to them
- Patient only sees SIGNED/DELIVERED opinions (not DRAFTs)
- Once signed, opinion is read-only (no edits)
- Doctor must fill all three fields to sign (drafts can be partial)

---

## 8. Edge Cases

| Scenario | Handling |
|----------|----------|
| Empty opinion sign attempt | Validation error — require all three fields |
| Assign to unverified doctor | Blocked — dropdown only shows verified doctors |
| Case already has signed opinion | Doctor sees read-only view, cannot create new opinion |
| Doctor saves draft | Case stays UNDER_REVIEW, opinion status is DRAFT |
| Admin reassigns case | Change specialistId, keep UNDER_REVIEW status |
| No specialists available | Admin sees empty dropdown, must wait for verification |

---

## 9. Files to Create/Modify

### New Files
- `app/admin/specialists/page.tsx` — Verification table
- `app/admin/cases/page.tsx` — Case routing table
- `app/doctor/cases/page.tsx` — My Cases list
- `app/doctor/cases/[id]/page.tsx` — Case review + opinion form
- `app/api/admin/specialists/route.ts` — GET list doctors
- `app/api/admin/specialists/[id]/verify/route.ts` — PATCH toggle verify
- `app/api/admin/cases/unassigned/route.ts` — GET unassigned cases
- `app/api/admin/cases/[id]/assign/route.ts` — PATCH assign specialist
- `app/api/doctor/cases/route.ts` — GET assigned cases
- `app/api/doctor/cases/[id]/route.ts` — GET case detail
- `app/api/doctor/cases/[id]/opinion/route.ts` — GET/POST opinion
- `lib/schemas/case.schema.ts` — Add opinionSchema (update existing)
- `lib/hooks/use-doctor-cases.ts` — React Query hooks for doctor cases
- `lib/hooks/use-admin-specialists.ts` — React Query hooks for admin specialist management

### Modified Files
- `prisma/schema.prisma` — Add `verified` to Doctor
- `app/admin/layout.tsx` — Add Specialists + Cases nav items
- `app/doctor/layout.tsx` — Add My Cases nav item
- `app/patient/cases/[id]/page.tsx` — Update opinion display section
- `components/case-status-tracker.tsx` — Verify it handles all transitions

---

## 10. Implementation Order

1. **Schema migration** — Add `verified` to Doctor, run `prisma migrate`
2. **Admin verification** — API + page
3. **Admin case routing** — API + page
4. **Doctor cases list** — API + page
5. **Doctor case review** — API + page with opinion form
6. **Patient report delivery** — Update case detail page
7. **Navigation updates** — Admin and Doctor sidebar items
8. **Testing** — Verify all flows end-to-end
