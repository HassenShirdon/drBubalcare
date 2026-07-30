# Doctor Portal — Remaining Fixes

Tracked from code review findings. Age/gender data minimization already implemented.

---

## P0 — Critical

- [ ] **Transaction safety**: Wrap opinion + case status update in `prisma.$transaction` to prevent data inconsistency on concurrent requests (`app/api/doctor/cases/[id]/opinion/route.ts`)
- [ ] **Error handling**: Add try-catch to all 7 doctor API routes returning structured error responses instead of 500 crashes
- [ ] **Auth helper**: Extract `requireDoctor()` helper to eliminate 6-line auth boilerplate duplicated across 7 routes

## P1 — High

- [ ] **Pagination**: Add `take`/`skip` to doctor schedule API (`app/api/appointments/doctor/route.ts`) and patients API (`app/api/doctor/patients/route.ts`)
- [ ] **Audit logging**: Log case reads from doctor-facing API routes (`doctor/cases`, `doctor/cases/[id]`) to `AuditLog` table for GDPR/HIPAA compliance
- [ ] **Rate limiting**: Apply `checkRateLimit()` to `POST /api/doctor/cases/[id]/opinion` to prevent abuse
- [ ] **Opinion validation**: Add Zod `.max()` and sanitization to opinion content schema

## P2 — Medium

- [ ] **Signed opinion guard**: Backend validation that all 3 sections (findings, impression, next steps) are non-empty before accepting `sign: true`
- [ ] **Opinion submission test**: Add integration test for `POST /api/doctor/cases/[id]/opinion` covering draft, sign, and edge cases

## P3 — Low

- [ ] **AI trigger reliability**: Replace `fetch().catch()` fire-and-forget pattern with direct function calls or a job queue for summary/synthesis generation
