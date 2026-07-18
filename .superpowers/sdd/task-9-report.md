# Task 9: Doctor Case Review Page — Report

## Status: DONE

## Summary

Created `app/doctor/cases/[id]/page.tsx` — the doctor case review page where specialists can view case details and write structured opinions.

## What was built

- **Case header** with back link, service type label, patient name, creation date, and status badge
- **Uploaded Records section** listing all case records with file name, type, upload date, and view link
- **AI Pre-screen section** displaying AI findings and urgent flags (conditionally rendered)
- **Opinion form** with three structured fields: Clinical Findings, Impression, Recommended Next Steps
- **Save as Draft** button using `useSubmitOpinion` with `sign: false`
- **Sign & Submit** button with two-step confirmation flow using `sign: true`
- **Signed opinion display** — when opinion is already signed/delivered, shows read-only formatted opinion with section headers
- **Draft loading** — existing drafts are parsed from markdown sections and loaded into form fields via `useEffect`
- Loading spinner and "Case not found" empty state

## Files

- **Created:** `app/doctor/cases/[id]/page.tsx` (317 lines)

## Verification

- `npx next lint --file app/doctor/cases/[id]/page.tsx` — **0 warnings, 0 errors**
- `npx tsc --noEmit` — **0 errors in this file** (2 pre-existing errors in unrelated patient lab pages)

## Commit

```
c1cce75 feat: add doctor case review page with structured opinion form
```

## Concerns

None. All pre-existing tsc errors are in unrelated files (`app/patient/labs/[id]/page.tsx` and `app/patient/labs/page.tsx`).
