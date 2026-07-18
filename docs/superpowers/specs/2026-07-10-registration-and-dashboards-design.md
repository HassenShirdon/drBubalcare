# Registration & Dashboards Design

## Overview

Add patient and doctor registration flows, then flesh out the existing stub dashboards with real content.

## 1. Registration

### 1.1 Architecture

- Two separate signup pages: `/auth/signup/patient` and `/auth/signup/doctor`
- Each uses `react-hook-form` + `zodResolver` (existing pattern from sign-in)
- On submit, a server action creates the `User` record (with hashed password), and optionally a `Doctor` profile
- After successful registration, auto-sign in via `signIn("credentials")` and redirect to the corresponding dashboard

### 1.2 Patient Signup (`/auth/signup/patient`)

**Zod schema** (`lib/schemas/auth.schema.ts` — add `signUpPatientSchema`):
- `name` (string, min 2)
- `email` (valid email)
- `password` (min 8)
- `confirmPassword` (must match password)

**Server action** (`lib/actions/auth.ts`):
1. Validate input with schema
2. Check email uniqueness
3. Hash password with bcrypt
4. Create `User { name, email, passwordHash, role: PATIENT }`
5. Return `{ success: true }`

**Client flow** after successful server action:
1. Call `signIn("credentials", { redirect: false, email, password })`
2. On success, `router.push("/patient")`

### 1.3 Doctor Signup (`/auth/signup/doctor`)

**Zod schema** — add `signUpDoctorSchema`:
- `name`, `email`, `password`, `confirmPassword` (same as patient)
- `specialty` (string, required)
- `experience` (string, e.g. "15 Yrs Exp")
- `bio` (optional text)
- `imageUrl` (optional URL)

**Server action** (`lib/actions/auth.ts`):
1. Validate input
2. Check email uniqueness
3. Create `User { name, email, passwordHash, role: DOCTOR }`
4. Create `Doctor { userId, specialty, experience, bio, imageUrl }`
5. Return `{ success: true }`

**Client flow** same as patient — `signIn` + `router.push("/doctor")`.

### 1.4 UI Details

- Both pages share a card layout consistent with `/auth/signin`
- Doctor signup has additional fields (specialty dropdown, experience, bio textarea)
- Loading state on submit button, error display for validation/server errors
- Link to switch between patient/doctor signup and to sign-in

## 2. Patient Dashboard (`/patient/page.tsx`)

### 2.1 Layout
Uses existing `<PatientLayout>` sidebar shell. Content area displays:

**Upcoming Appointment card**
- Fetch from `GET /api/appointments?status=UPCOMING` (new API route)
- Show: doctor name, date, time, status badge
- If none: "No upcoming appointments — Book one" link

**Recent Lab Results card**
- Fetch from existing `GET /api/lab-results` (last 3)
- Show: test name, date, status icon (normal/review needed)
- Link to full Lab Portal

**Quick Actions grid**
- 3 cards: "Book Appointment" → `/directory`, "Upload Lab Results" → `/patient/labs`, "Browse Directory" → `/directory`

**AI Summary** (optional, if `labResult.aiInterpretation` exists on recent labs)
- Show latest AI interpretation snippet

## 3. Doctor Dashboard (`/doctor/page.tsx`)

### 3.1 Layout
Uses existing `<DoctorLayout>` sidebar shell. Content area displays:

**Today's Schedule card**
- Fetch from `GET /api/appointments?doctorId=X&date=today` (new API route)
- Show: patient name, time, status
- Empty state: "No appointments scheduled today"

**Pending Lab Reviews card**
- New API route: `GET /api/lab-results/pending-review` — returns lab results needing doctor interpretation
- Show count + list of recent pending items
- Link to `/doctor/labs/review` (create later)

**Quick Stats row**
- Patients this week (count)
- Appointments today (count)
- Pending reviews (count)

**Recent Activity** (stretch)
- Chronological feed of recent appointments and lab reviews

## 4. New API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/appointments` | Patient | Get patient's upcoming appointments (from session) |
| GET | `/api/appointments/doctor` | Doctor | Get doctor's appointments (from session, filters by `status` query) |
| GET | `/api/lab-results/pending-review` | Doctor | Get lab results needing doctor review |

## 5. Auth Schema Updates

Add to `lib/schemas/auth.schema.ts`:

```ts
export const signUpPatientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const signUpDoctorSchema = signUpPatientSchema.extend({
  specialty: z.string().min(1, "Specialty is required"),
  experience: z.string().min(1, "Experience is required"),
  bio: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
});
```

## 6. Files to Create/Modify

### Create
- `app/auth/signup/patient/page.tsx` — patient registration page
- `app/auth/signup/doctor/page.tsx` — doctor registration page
- `lib/actions/auth.ts` — registration server actions
- `app/api/appointments/route.ts` — patient appointments API
- `app/api/appointments/doctor/route.ts` — doctor appointments API
- `app/api/lab-results/pending-review/route.ts` — pending reviews API

### Modify
- `lib/schemas/auth.schema.ts` — add signup schemas
- `app/patient/page.tsx` — replace stub with real dashboard
- `app/doctor/page.tsx` — replace stub with real dashboard
