# Comprehensive API Route & Server Action Authentication Audit

**Date:** July 18, 2026
**Project:** Dr. Bubal Care (Next.js 16, Auth0, Prisma/Supabase)
**Purpose:** Complete catalog of every API route and server action, their auth status, and a remediation plan

---

## PART 1: CURRENT INFRASTRUCTURE

### Auth Setup
- **Library:** Auth0 (`@auth0/nextjs-auth0` v5.10.2)
- **Adapter:** Prisma (`@auth0/prisma-adapter` v2.0.0)
- **DB:** Supabase PostgreSQL via Prisma
- **Session strategy:** JWT (custom callback writes `role` and `id` into token/session)
- **Roles in DB:** `PATIENT`, `DOCTOR`, `ADMIN` (enum on `User.role`)

### Files Examined
| File | Purpose |
|------|---------|
| `src/lib/auth.ts` | Auth0 config + `getSession()` / `requireUser()` / `requireAdmin()` helpers |
| `src/middleware.ts` | Currently only protects `/patient/*` routes via `withAuth` |
| `src/app/api/auth/[...auth0]/route.ts` | Auth0 catch-all handler |
| `src/app/api/authors/route.ts` | Test endpoint (no auth) |
| `src/app/api/cron/cleanup/route.ts` | Cron job (secret-key auth) |
| `src/app/api/dicom/study/[studyId]/route.ts` | DICOM proxy (no auth) |
| `src/app/api/dicom/webhook/route.ts` | DICOM webhook (HMAC auth) |
| `src/app/api/health/route.ts` | Health check (no auth — intentional) |
| `src/app/api/images/[...path]/route.ts` | Image proxy (no auth) |
| `src/app/api/patient/appointments/route.ts` | Patient appointments (session auth) |
| `src/app/api/patient/cases/route.ts` | Patient cases (session auth) |
| `src/app/api/patient/cases/[caseId]/download/route.ts` | Case file download (session auth) |
| `src/app/api/patient/cases/[caseId]/opinions/route.ts` | Case opinions (session auth) |
| `src/app/api/patient/cases/[caseId]/records/route.ts` | Case records (session auth) |
| `src/app/api/patient/labs/route.ts` | Patient labs (session auth) |
| `src/app/api/patient/profile/route.ts` | Patient profile (session auth) |
| `src/app/api/patient/sessions/[sessionId]/messages/route.ts` | Session messages (session auth) |
| `src/app/api/patient/timeline/route.ts` | Patient timeline (session auth) |
| `src/app/api/specialist/cases/route.ts` | Specialist cases (session auth) |
| `src/app/api/specialist/cases/[caseId]/opinions/route.ts` | Specialist opinions (session auth) |
| `src/app/api/specialist/patients/route.ts` | Specialist patients (session auth) |
| `src/app/api/specialist/profile/route.ts` | Specialist profile (session auth) |
| `src/app/api/specialist/sessions/[sessionId]/messages/route.ts` | Session messages (session auth) |
| `src/app/api/specialist/stats/route.ts` | Specialist stats (session auth) |
| `src/app/api/stripe/checkout/route.ts` | Stripe checkout (session auth) |
| `src/app/api/stripe/webhook/route.ts` | Stripe webhook (stripe-signature auth) |
| `src/app/api/superadmin/doctors/route.ts` | Admin doctors (admin auth) |
| `src/app/api/superadmin/doctors/[doctorId]/route.ts` | Admin doctor detail (admin auth) |
| `src/app/api/superadmin/doctors/[doctorId]/verify/route.ts` | Admin verify doctor (admin auth) |
| `src/app/api/superadmin/patients/route.ts` | Admin patients (admin auth) |
| `src/app/api/superadmin/route.ts` | Admin dashboard stats (admin auth) |
| `src/app/api/superadmin/system/health/route.ts` | System health (admin auth) |
| `src/app/api/superadmin/system/logs/route.ts` | System logs (admin auth) |
| `src/app/api/superadmin/system/usage/route.ts` | System usage (admin auth) |
| `src/app/api/webhooks/cron/route.ts` | Cron webhooks (cron-secret auth) |
| `src/app/api/webhooks/twilio/route.ts` | Twilio webhooks (HMAC auth) |
| `src/app/api/webhooks/whatsapp/route.ts` | WhatsApp webhooks (HMAC auth) |
| `src/app/lib/actions/appointment-actions.ts` | Appointment server actions |
| `src/app/lib/actions/auth-actions.ts` | Auth server actions |
| `src/app/lib/actions/case-actions.ts` | Case server actions |
| `src/app/lib/actions/consultation-actions.ts` | Consultation server actions |
| `src/app/lib/actions/patient-actions.ts` | Patient server actions |
| `src/app/lib/actions/specialist-actions.ts` | Specialist server actions |
| `src/app/lib/actions/superadmin-actions.ts` | Superadmin server actions |

---

## PART 2: COMPLETE API ROUTE INVENTORY

### A. Routes with PROPER Authentication (24 routes)

These routes already have auth checks and are correctly protected.

| # | Route | Method | Auth Mechanism | Role Restriction | Notes |
|---|-------|--------|---------------|-----------------|-------|
| 1 | `/api/auth/[...auth0]` | ALL | Auth0 built-in | Public (login/callback) | Correct |
| 2 | `/api/patient/appointments` | GET | `getSession()` | PATIENT | Correct |
| 3 | `/api/patient/appointments` | POST | `getSession()` | PATIENT | Correct |
| 4 | `/api/patient/cases` | GET | `getSession()` | PATIENT | Correct |
| 5 | `/api/patient/cases` | POST | `getSession()` | PATIENT | Correct |
| 6 | `/api/patient/cases/[caseId]/download` | GET | `getSession()` + ownership check | PATIENT (owner only) | Correct — also checks case belongs to user |
| 7 | `/api/patient/cases/[caseId]/opinions` | GET | `getSession()` | PATIENT | Correct |
| 8 | `/api/patient/cases/[caseId]/records` | GET | `getSession()` | PATIENT | Correct |
| 9 | `/api/patient/labs` | GET | `getSession()` | PATIENT | Correct |
| 10 | `/api/patient/profile` | GET | `getSession()` | PATIENT | Correct |
| 11 | `/api/patient/profile` | PUT | `getSession()` | PATIENT | Correct |
| 12 | `/api/patient/sessions/[sessionId]/messages` | POST | `getSession()` | PATIENT | Correct |
| 13 | `/api/patient/timeline` | GET | `getSession()` | PATIENT | Correct |
| 14 | `/api/specialist/cases` | GET | `getSession()` | DOCTOR | Correct |
| 15 | `/api/specialist/cases/[caseId]/opinions` | POST | `getSession()` | DOCTOR | Correct |
| 16 | `/api/specialist/patients` | GET | `getSession()` | DOCTOR | Correct |
| 17 | `/api/specialist/profile` | GET | `getSession()` | DOCTOR | Correct |
| 18 | `/api/specialist/profile` | PUT | `getSession()` | DOCTOR | Correct |
| 19 | `/api/specialist/sessions/[sessionId]/messages` | POST | `getSession()` | DOCTOR | Correct |
| 20 | `/api/specialist/stats` | GET | `getSession()` | DOCTOR | Correct |
| 21 | `/api/stripe/checkout` | POST | `getSession()` | Any authenticated | Correct |
| 22 | `/api/superadmin/doctors` | GET | `requireAdmin()` | ADMIN | Correct |
| 23 | `/api/superadmin/doctors/[doctorId]` | PATCH | `requireAdmin()` | ADMIN | Correct |
| 24 | `/api/superadmin/doctors/[doctorId]/verify` | POST | `requireAdmin()` | ADMIN | Correct |
| 25 | `/api/superadmin/patients` | GET | `requireAdmin()` | ADMIN | Correct |
| 26 | `/api/superadmin/route.ts` | GET | `requireAdmin()` | ADMIN | Correct — dashboard stats |
| 27 | `/api/superadmin/system/health` | GET | `requireAdmin()` | ADMIN | Correct |
| 28 | `/api/superadmin/system/logs` | GET | `requireAdmin()` | ADMIN | Correct |
| 29 | `/api/superadmin/system/usage` | GET | `requireAdmin()` | ADMIN | Correct |

### B. Routes with INTENTIONAL No Auth (Special Cases) (6 routes)

These routes have alternative auth mechanisms or are intentionally public.

| # | Route | Method | Auth Mechanism | Risk | Notes |
|---|-------|--------|---------------|------|-------|
| 30 | `/api/health` | GET | None | None | Health check — intentional |
| 31 | `/api/cron/cleanup` | POST | `x-cron-secret` header | Low | Server-to-server cron job, env var check |
| 32 | `/api/stripe/webhook` | POST | Stripe signature verification | Low | Stripe-to-server, signature validated |
| 33 | `/api/webhooks/cron` | POST | `x-cron-secret` header | Low | Cron job, env var check |
| 34 | `/api/webhooks/twilio` | POST | HMAC signature validation | Low | Twilio-to-server |
| 35 | `/api/webhooks/whatsapp` | POST | HMAC signature validation | Low | WhatsApp-to-server |
| 36 | `/api/dicom/webhook` | POST | HMAC signature validation | Low | DICOM server-to-server |

### C. Routes WITHOUT Authentication (MEDIUM-HIGH RISK) (5 routes)

These are user-facing API routes that should have auth but don't.

| # | Route | Method | Current Auth | Risk Level | Impact |
|---|-------|--------|-------------|------------|--------|
| **37** | `/api/authors` | GET | **NONE** | **MEDIUM** | Exposes author names publicly — low sensitivity but still unprotected |
| **38** | `/api/dicom/study/[studyId]` | GET | **NONE** | **HIGH** | Proxies DICOM medical images without auth — any user can view any study |
| **39** | `/api/images/[...path]` | GET | **NONE** | **HIGH** | Proxies patient-uploaded images without auth — any user can view any image |
| **40** | `/api/specialist/sessions/[sessionId]/messages` | GET | **NONE** | **HIGH** | Reads consultation session messages without auth |
| **41** | `/api/specialist/sessions/[sessionId]/messages` | PUT | **NONE** | **HIGH** | Updates session notes without auth |

### D. Server Actions Audit

#### `appointment-actions.ts`
| Action | Auth | Role Check | Risk |
|--------|------|-----------|------|
| `createConsultationSession` | `requireUser()` | None | **MEDIUM** — any user can create, but checks if user has appointment |
| `getAppointmentDetails` | `requireUser()` | None | **LOW** — but doesn't verify user owns the appointment |
| `getPatientAppointmentDetails` | `requireUser()` | None | **LOW** — same issue |
| `createAppointment` | `requireUser()` | None | **MEDIUM** — any authenticated user can create |
| `updateAppointment` | `requireUser()` | None | **MEDIUM** — any authenticated user can update any appointment |
| `cancelAppointment` | `requireUser()` | None | **MEDIUM** — any authenticated user can cancel any appointment |
| `getAvailableTimeSlots` | `requireUser()` | None | **LOW** — read-only, doctor slots |
| `getDoctorAvailability` | `requireUser()` | None | **LOW** — read-only |
| `updateDoctorAvailability` | `requireUser()` | None | **HIGH** — any user can update any doctor's availability |

#### `auth-actions.ts`
| Action | Auth | Role Check | Risk |
|--------|------|-----------|------|
| `registerUser` | None | None | OK — registration is public |
| `syncUser` | None | None | OK — sync is meant to be called after login |
| `getSession` | None | None | OK — just gets session |

#### `case-actions.ts`
| Action | Auth | Role Check | Risk |
|--------|------|-----------|------|
| `getPatientCases` | `requireUser()` | None | **MEDIUM** — doesn't verify PATIENT role |
| `getPatientCaseById` | `requireUser()` | None | **MEDIUM** — doesn't verify case belongs to user |
| `downloadCaseFile` | `requireUser()` | None | **HIGH** — no ownership verification for file downloads |

#### `consultation-actions.ts`
| Action | Auth | Role Check | Risk |
|--------|------|-----------|------|
| `createConsultationSession` | `requireUser()` | None | **MEDIUM** — duplicate of appointment action |
| `getConsultationSession` | `requireUser()` | None | **HIGH** — no role check, no membership verification |
| `getPatientSessions` | `requireUser()` | None | **MEDIUM** — no role check |
| `getDoctorSessions` | `requireUser()` | None | **MEDIUM** — no role check |
| `updateSessionStatus` | `requireUser()` | None | **HIGH** — any user can update session status |
| `createPrescription` | `requireUser()` | None | **HIGH** — any user can create prescriptions |
| `addSessionMessage` | `requireUser()` | None | **MEDIUM** — no membership verification |

#### `patient-actions.ts`
| Action | Auth | Role Check | Risk |
|--------|------|-----------|------|
| `getPatientProfile` | `requireUser()` | None | **MEDIUM** — no ownership check |
| `updatePatientProfile` | `requireUser()` | None | **MEDIUM** — no ownership check |

#### `specialist-actions.ts`
| Action | Auth | Role Check | Risk |
|--------|------|-----------|------|
| `getSpecialistProfile` | `requireUser()` | None | **MEDIUM** — no role check |
| `updateSpecialistProfile` | `requireUser()` | None | **MEDIUM** — no role check |

#### `superadmin-actions.ts`
| Action | Auth | Role Check | Risk |
|--------|------|-----------|------|
| `getAdminDashboardStats` | `requireAdmin()` | ADMIN | Correct |
| `getAdminSystemHealth` | `requireAdmin()` | ADMIN | Correct |
| `getAdminSystemLogs` | `requireAdmin()` | ADMIN | Correct |
| `getAdminSystemUsage` | `requireAdmin()` | ADMIN | Correct |
| `getAdminPatients` | `requireAdmin()` | ADMIN | Correct |
| `getAdminPatientDetails` | `requireAdmin()` | ADMIN | Correct |
| `getAdminDoctors` | `requireAdmin()` | ADMIN | Correct |
| `verifyDoctor` | `requireAdmin()` | ADMIN | Correct |
| `updateDoctorVerificationNotes` | `requireAdmin()` | ADMIN | Correct |

---

## PART 3: CURRENT MIDDLEWARE ANALYSIS

### `src/middleware.ts` — Current State
```typescript
import { withAuth } from "@auth0/nextjs-auth0/middleware";

export default withAuth({
  onError(_err, _req, res) {
    res?.redirect("/auth/login?error=access_denied");
  },
});

export const config = {
  matcher: ["/patient/:path*"],
};
```

**What it protects:** Only `/patient/*` routes
**What it DOESN'T protect:**
- `/admin/*` routes (except `/api/superadmin/*` which have inline checks)
- `/doctor/*` routes (except `/api/specialist/*` which have inline checks)
- All non-API routes under `/admin/*` and `/doctor/*`

**Key issues:**
1. No role-based middleware — only checks "is authenticated", not "is admin" or "is doctor"
2. Only covers `/patient/*` path prefix
3. Page routes under `/admin/*` and `/doctor/*` have no middleware protection (though API routes have inline checks)

---

## PART 4: REMEDIATION PLAN

### Priority 1: CRITICAL — Fix immediately (5 routes)

These expose medical data without any authentication.

| Route | Fix |
|-------|-----|
| `/api/dicom/study/[studyId]/GET` | Add `getSession()` check + verify user owns the case or is the assigned specialist |
| `/api/images/[...path]/GET` | Add `getSession()` check + verify the image belongs to the requesting user or user is admin/specialist |
| `/api/specialist/sessions/[sessionId]/messages/GET` | Add `getSession()` check + verify user is participant in the session |
| `/api/specialist/sessions/[sessionId]/messages/PUT` | Add `getSession()` check + verify user is participant in the session |
| `/api/authors/GET` | Add `getSession()` check or make intentionally public (author names are low-sensitivity) |

### Priority 2: HIGH — Fix in Phase 2 (middleware expansion)

**Expand middleware to protect all role-based page routes:**

```typescript
// New middleware matcher
export const config = {
  matcher: [
    "/patient/:path*",
    "/admin/:path*",
    "/doctor/:path*",
  ],
};
```

Add role-checking middleware:
```typescript
// middleware.ts enhancement
const roleMiddleware = (allowedRoles: string[]) => {
  return async (req, res, next) => {
    const session = await getSession(req, res);
    if (!session) {
      return res.redirect("/auth/login");
    }
    if (!allowedRoles.includes(session.user.role)) {
      return res.redirect("/unauthorized");
    }
    return next();
  };
};
```

| Route Pattern | Middleware Role Restriction |
|---------------|---------------------------|
| `/admin/*` | `["ADMIN"]` |
| `/doctor/*` | `["DOCTOR"]` |
| `/patient/*` | `["PATIENT"]` (already done) |

### Priority 3: MEDIUM — Fix in Phase 2-3 (server action hardening)

Add ownership/role verification to all server actions:

| Action | Current | Fix |
|--------|---------|-----|
| `updateAppointment` | Any user | Verify user owns the appointment OR is the doctor |
| `cancelAppointment` | Any user | Verify user owns the appointment |
| `updateDoctorAvailability` | Any user | Verify `session.user.id === doctorId` OR admin |
| `downloadCaseFile` | Any user | Verify case belongs to user or user is assigned specialist |
| `getPatientCaseById` | Any user | Verify case belongs to user |
| `getConsultationSession` | Any user | Verify user is participant in session |
| `updateSessionStatus` | Any user | Verify user is participant + appropriate status transitions |
| `createPrescription` | Any user | Verify user is a doctor + is participant in session |
| `getAppointmentDetails` | Any user | Verify user owns the appointment |
| `getPatientAppointmentDetails` | Any user | Verify user owns the appointment |

### Priority 4: LOW — Fix in Phase 3-4 (defense in depth)

These are lower risk because they have inline checks in the API routes, but should also be protected at the middleware level for consistency.

| Area | Fix |
|------|-----|
| All `/api/patient/*` routes | Already have `getSession()` — add middleware matcher for defense in depth |
| All `/api/specialist/*` routes | Already have `getSession()` — add middleware matcher |
| All `/api/superadmin/*` routes | Already have `requireAdmin()` — add middleware matcher with ADMIN role |

---

## PART 5: RECOMMENDED MIDDLEWARE ARCHITECTURE

```
src/middleware.ts
├── withAuth (Auth0 session check)
├── Role-based route protection
│   ├── /patient/*    → PATIENT role required
│   ├── /admin/*      → ADMIN role required
│   └── /doctor/*     → DOCTOR role required
├── API route protection (belt and suspenders)
│   ├── /api/patient/*     → PATIENT role
│   ├── /api/specialist/*  → DOCTOR role
│   ├── /api/superadmin/*  → ADMIN role
│   └── /api/admin/*       → ADMIN role (future)
└── Public routes (exempt)
    ├── /api/health
    ├── /api/auth/*
    ├── /api/stripe/webhook
    ├── /api/webhooks/*
    ├── /api/dicom/webhook
    └── /api/cron/*
```

---

## PART 6: SUMMARY

| Category | Count | Status |
|----------|-------|--------|
| Routes with proper auth | 29 | ✅ Secure |
| Routes with intentional no-auth (webhooks/cron/health) | 7 | ✅ Secure (alt auth) |
| Routes MISSING auth | **5** | ❌ **Needs fix** |
| Server actions with role checks | 9 | ✅ Secure |
| Server actions with session-only checks (no role/ownership) | **20** | ⚠️ **Needs hardening** |
| Middleware-protected paths | 1 (`/patient/*`) | ⚠️ **Needs expansion** |

### Immediate Next Steps
1. **Fix the 5 unprotected API routes** (Priority 1)
2. **Expand middleware** to cover `/admin/*` and `/doctor/*` (Priority 2)
3. **Harden server actions** with ownership/role verification (Priority 3)
4. **Add role-based middleware** with route-role mapping (Priority 2-3)

---

*Generated from codebase audit of Dr. Bubal Care project, July 18, 2026*
