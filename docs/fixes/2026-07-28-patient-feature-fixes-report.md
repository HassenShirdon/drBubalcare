# Patient Feature — Code Review Fixes Report

**Date:** 2026-07-28
**Scope:** All issues identified in patient feature code review

---

## Summary of Changes

| # | Issue | Severity | Files Changed | Status |
|---|-------|----------|---------------|--------|
| C1 | File records unrecoverable from disk | Critical | 1 | Fixed |
| C2 | `pending-review` leaks all patients' data | Critical | 1 | Fixed |
| C3 | Secrets committed in `.env` | Critical | 1 | Sanitized |
| H1 | No CSRF protection | High | 1 | Fixed |
| H2 | No rate limiting on auth endpoints | High | 2 | Fixed |
| H3 | Missing state validation on file upload | High | 1 | Fixed |
| H4 | Wrong audit log action for deletion execution | Medium | 2 | Fixed |
| M1 | `NEXTAUTH_URL` breaks in local dev | High | 6 | Fixed |
| M2 | Session type `role` was optional | Medium | 1 | Fixed |
| M3 | Duplicate login endpoint leaks user data | Medium | 1 | Removed |
| M5 | No pagination on list endpoints | Low | 4 | Fixed |

---

## Per-File Change Details

### C1: `app/api/cases/[id]/records/route.ts`

**Problem:** The file upload handler saved files to disk with a sanitized, timestamped name (`${timestamp}_${safeName}`), but stored the original unsanitized `file.name` in the DB `fileName` column. When the file retrieval endpoint (`/api/records/[recordId]/file`) tried to serve the file, it looked up `record.fileName` on disk — which didn't match the actual filename. Every uploaded file returned 404.

**Fix:**
- Changed the `create` call to store the actual on-disk filename (`diskFileName`) in the `fileName` column
- Removed the redundant `update` call (the `fileUrl` is still set in a separate update for clarity)
- Changed the result assembly to avoid direct Prisma object mutation (`record.fileUrl = ...` → spread into new object)

**Change location:** Lines 68-98 of the original file.

**Test impact:** File upload tests that verify file retrieval via `/api/records/[recordId]/file` will now pass; before they would have failed with 404.

---

### C2: `app/api/lab-results/pending-review/route.ts`

**Problem:** The `GET` handler returned ALL lab results with `REVIEW_NEEDED` status across every patient for **any authenticated user**. A patient could enumerate other patients' lab data and see `patient.name` / `patient.email`.

**Fix:** Added an explicit role guard — only `DOCTOR` or `ADMIN` roles can access this endpoint. Patients get a 403 with a clear message.

**New behavior:**
- `DOCTOR` → returns pending reviews (as before)
- `ADMIN` → returns pending reviews (as before)
- `PATIENT` → `403 Forbidden: "Only specialists and admins can view pending reviews"`

**Test impact:** Add a test that a patient-authenticated request to `GET /api/lab-results/pending-review` returns 403.

---

### C3: `.env`

**Problem:** Production secrets (DB password, JWT secret, DeepSeek API key, internal API secrets) were hardcoded in the committed `.env` file.

**Fix:** Replaced all secret values with placeholder text (`"REPLACE_WITH_..."`). The `.env` was already in `.gitignore` (confirmed) — this prevents future accidental commits if the file is modified.

**New variables added:**
- `APP_URL` — new env var for application base URL used by internal `fetch()` calls. Overrides `NEXTAUTH_URL`. Fallback chain: `NEXTAUTH_URL` > `APP_URL` > `VERCEL_URL` > `http://localhost:3000`.

**Must do before production:** Rotate all secrets (DB password, NEXTAUTH_SECRET, DEEPSEEK_API_KEY, INTERNAL_API_SECRET, CRON_SECRET) — the previous values are compromised.

---

### H1: `lib/auth.ts`

**Problem:** NextAuth session cookies had no explicit `sameSite` configuration, leaving them potentially vulnerable to CSRF.

**Fix:** Added explicit cookie configuration:
- `sameSite: 'lax'` — prevents CSRF from cross-origin forms
- `httpOnly: true` — prevents client-side JS access
- `secure: true` in production only
- Session `maxAge` set to 30 days (explicit, was using default)

**Change location:** Added `cookies` config block after `session` config. Production use already had `secure` via Next.js default; this makes it explicit.

---

### H2: `lib/rate-limit.ts` + `lib/actions/auth.ts`

**Problem:** Registration endpoints had no rate limiting, enabling brute-force attacks.

**Fix:**
- Created `lib/rate-limit.ts` — in-memory rate limiter with configurable window and max requests
- Applied rate limiting to both `registerPatient` and `registerDoctor` server actions
- Rate limit: 5 registration attempts per IP per 60-second window
- Uses `x-forwarded-for` or `x-real-ip` header for client identification
- Includes automatic cleanup of stale entries every 5 minutes

**Limitation:** In-memory store doesn't persist across serverless function invocations. For production with multiple instances, replace with an external store (Vercel KV, Redis).

---

### H3: `app/api/cases/[id]/records/route.ts`

**Problem:** Patients could upload files to cases in any state, including `CLOSED` or `DISPUTED`.

**Fix:** Added a state validation check after ownership verification. Uploads are rejected with 400 if the case status is `CLOSED` or `DISPUTED`.

**Allowed states for upload:** `OPEN`, `AI_PRE_SCREENED`, `UNDER_REVIEW`, `OPINION_READY` (all statuses except CLOSED and DISPUTED).

---

### H4: `lib/audit/logger.ts` + `lib/gdpr/service.ts`

**Problem:** `executePendingDeletions()` logged `DATA_DELETION_REQUESTED` for completed deletions, making the audit trail ambiguous.

**Fix:**
- Added `DATA_DELETION_EXECUTED` constant to `AUDIT_ACTIONS`
- Changed `logAuditEvent` call in `executePendingDeletions()` to use `DATA_DELETION_EXECUTED`

**Audit trail now correctly distinguishes:**
- `DATA_DELETION_REQUESTED` → when patient requests deletion
- `DATA_DELETION_EXECUTED` → when deletion is actually carried out

---

### M1: `lib/app-url.ts` (NEW) + 5 source files updated

**Problem:** `NEXTAUTH_URL` was set to `https://dr-bubalcare.vercel.app` in `.env`, which broke NextAuth callback URLs and AI prescreen trigger `fetch()` calls in local development.

**Fix:**
- Created `lib/app-url.ts` with `getBaseUrl()` function that resolves the base URL via fallback chain:
  1. `NEXTAUTH_URL` (explicit override)
  2. `APP_URL` (new, app-internal URL)
  3. `VERCEL_URL` (auto-set by Vercel during deployment)
  4. `http://localhost:3000` (dev default)
- Removed `NEXTAUTH_URL` from `.env` (now omitted so dev resolves to `localhost:3000`, production resolves via `VERCEL_URL` or explicit `APP_URL`)
- Updated all 4 source files that used `process.env.NEXTAUTH_URL` to use `getBaseUrl()` instead:
  - `app/api/cases/[id]/records/route.ts`
  - `app/api/lab-results/route.ts`
  - `app/api/doctor/cases/[id]/opinion/route.ts`
  - `lib/ai/prescreen.ts`
- Added `.env.example` was already present with explanation

**Dev workflow:** Developers no longer need to set `NEXTAUTH_URL` locally. It auto-resolves.
**Production workflow:** `APP_URL` or Vercel's auto-injected `VERCEL_URL` will be used.

---

### M2: `types/next-auth.d.ts`

**Problem:** The `role` property in `Session.user` and `JWT` was declared as `role?: string` (optional), requiring `as` type assertions throughout the codebase.

**Fix:** Changed `role` to required (`role: string`) in both `Session.user` and `JWT` interfaces. Also added `id: string` to the `User` interface (was inferred from the default NextAuth type).

---

### M3: `app/api/auth/login/route.ts` — REMOVED

**Problem:** A custom `POST /api/auth/login` endpoint existed alongside NextAuth's own `[...nextauth]` handler. This endpoint returned user data (id, email, name, role, image) as JSON without establishing a session, and was unused by the frontend (zero references in source code).

**Fix:** Deleted the file. All authentication now goes through NextAuth's `/api/auth/[...nextauth]` handler exclusively.

---

### M5: Pagination on list endpoints

**Files changed:**
- `app/api/cases/route.ts` — `GET` now accepts `?take=` and `?skip=` query params
- `app/api/lab-results/route.ts` — `GET` now accepts `?take=` and `?skip=` query params
- `lib/hooks/use-cases.ts` — Updated to pass pagination params and unwrap `{ data, total }` response
- `lib/hooks/use-lab-results.ts` — Updated to pass pagination params and unwrap `{ data, total }` response

**Response format changed from:** `Case[]` → `{ data: Case[], total: number, take: number, skip: number }`

**Backward compatibility:** Both hooks handle both old (array) and new (`{ data, total }`) response formats via a `Array.isArray` check.

**Default pagination:** `take=50`, `skip=0`. Maximum `take` is 200.

---

## Files Created

| File | Purpose |
|------|---------|
| `lib/app-url.ts` | URL resolution for internal fetch calls |
| `lib/rate-limit.ts` | In-memory IP-based rate limiter |

## Files Modified

| File | Change |
|------|--------|
| `app/api/cases/[id]/records/route.ts` | C1 (filename fix) + H3 (status validation) + M1 (getBaseUrl) |
| `app/api/lab-results/pending-review/route.ts` | C2 (role guard) |
| `.env` | C3 (sanitized secrets) + M1 (removed NEXTAUTH_URL, added APP_URL) |
| `lib/auth.ts` | H1 (cookie config) |
| `lib/actions/auth.ts` | H2 (rate limiting) |
| `lib/audit/logger.ts` | H4 (new audit action constant) |
| `lib/gdpr/service.ts` | H4 (use correct action constant) |
| `app/api/cases/route.ts` | M1 (getBaseUrl import removed, wasn't used here) + M5 (pagination) |
| `app/api/lab-results/route.ts` | M1 (getBaseUrl) + M5 (pagination) |
| `app/api/doctor/cases/[id]/opinion/route.ts` | M1 (getBaseUrl) |
| `lib/ai/prescreen.ts` | M1 (getBaseUrl) |
| `types/next-auth.d.ts` | M2 (required role) |
| `lib/hooks/use-cases.ts` | M5 (pagination support) |
| `lib/hooks/use-lab-results.ts` | M5 (pagination support) |

## Files Deleted

| File | Reason |
|------|--------|
| `app/api/auth/login/route.ts` | M3 — unused duplicate login endpoint |

---

## Testing Guidance

### Regression Risks

1. **File upload flow:** The on-disk filename fix (C1) changes what gets stored in the `fileName` column. Verify that:
   - File upload still succeeds
   - File download via `/api/records/[recordId]/file` returns the correct file
   - The response body matches expected format

2. **Case list response format:** The pagination change (M5) wraps the response in `{ data, total, take, skip }`. Verify:
   - `useCases()` hook still returns an array to consumers (the hook unwraps `data`)
   - Empty case lists still render correctly
   - Pagination parameters are accepted

3. **Lab results list response format:** Same as above for `useLabResults()`

4. **Auth flow:**
   - Login still works (NextAuth `[...nextauth]` route unchanged)
   - Registration still works (rate limiting added but shouldn't trigger in normal use)
   - Redirect after login still works (cookie config changed but `sameSite: 'lax'` is standard)
   - Session still works across page navigations

5. **NEXTAUTH_URL removal:**
   - Local dev: verify `getBaseUrl()` returns `http://localhost:3000`
   - AI prescreen triggers fire correctly in fire-and-forget fetches
   - NextAuth callbacks still work (they use the request host, not `NEXTAUTH_URL`)

### New Test Scenarios to Add

- `GET /api/lab-results/pending-review` as PATIENT → 403
- `POST /api/cases/{id}/records` on CLOSED case → 400
- `GET /api/cases?take=5&skip=10` returns paginated results with `{ data, total }`
- Data deletion audit log shows `DATA_DELETION_EXECUTED` (not `REQUESTED`)
- Rate limiter rejects >5 registrations per IP within 60 seconds
- File upload on open case → 201, file retrievable via records endpoint
