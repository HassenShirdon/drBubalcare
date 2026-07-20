# Authentication API

Authentication for Dr. Bubal Care uses NextAuth.js with session-based auth. All protected endpoints require a valid session cookie.

## Base URL

All API routes are under `/api/` on the application domain.

## Endpoints

### POST `/api/auth/login`

Authenticate a user with email and password.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (200):**

```json
{
  "id": "clxyz...",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "PATIENT",
  "image": null
}
```

**Errors:**

| Status | Error | Condition |
|--------|-------|-----------|
| 400 | `"Email and password required"` | Missing fields |
| 401 | `"Invalid credentials"` | Wrong email or password |
| 500 | `"Internal server error"` | Server failure |

---

### POST `/api/auth/register` (Patient)

Register a new patient account. Implemented as a Next.js server action (`registerPatient` in `lib/actions/auth.ts`).

**Request Body (`multipart/form-data`):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | Yes | Patient name (min 2 characters) |
| `email` | `string` | Yes | Valid email address |
| `password` | `string` | Yes | Password (min 8 characters) |
| `confirmPassword` | `string` | Yes | Must match `password` |

**Response (200):**

```json
{ "success": true }
```

**Errors:**

| Status | Error | Condition |
|--------|-------|-----------|
| 200 | `{ "error": { "email": ["Email already registered"] } }` | Duplicate email |
| 200 | `{ "error": { "name": ["Name must be at least 2 characters"], "password": ["Password must be at least 8 characters"] } }` | Validation failure |

Note: Returns HTTP 200 with error object in body (not an HTTP error status), consistent with Next.js server action conventions.

---

### POST `/api/auth/register` (Doctor)

Register a new specialist account. Implemented as a Next.js server action (`registerDoctor` in `lib/actions/auth.ts`). Creates both a `User` (role `DOCTOR`) and a `Doctor` profile.

**Request Body (`multipart/form-data`):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | Yes | Doctor name (min 2 characters) |
| `email` | `string` | Yes | Valid email address |
| `password` | `string` | Yes | Password (min 8 characters) |
| `confirmPassword` | `string` | Yes | Must match `password` |
| `specialty` | `string` | Yes | Medical specialty |
| `experience` | `string` | Yes | Years of experience |
| `bio` | `string` | No | Professional biography |
| `imageUrl` | `string` | No | Profile image URL |

**Response (200):**

```json
{ "success": true }
```

**Errors:**

| Status | Error | Condition |
|--------|-------|-----------|
| 200 | `{ "error": { "email": ["Email already registered"] } }` | Duplicate email |
| 200 | `{ "error": { "name": [...], "password": [...], "specialty": [...] } }` | Validation failure |

Note: Returns HTTP 200 with error object in body (not an HTTP error status), consistent with Next.js server action conventions.

---

### POST/GET `/api/auth/[...nextauth]`

NextAuth.js catch-all route. Handles:

- `GET /api/auth/session` — Returns current session
- `POST /api/auth/signin/*` — Sign in via configured providers
- `POST /api/auth/signout` — Sign out and destroy session
- `GET /api/auth/csrf` — Get CSRF token

These are managed by NextAuth.js internally and should not be called directly by client code.

---

### GET `/api/auth/session`

Returns the current authenticated session. Used by the frontend to check auth state.

**Response (200):**

```json
{
  "user": {
    "id": "clxyz...",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "PATIENT",
    "image": null
  },
  "expires": "2026-08-19T00:00:00.000Z"
}
```

**Response (401):** `{}` (empty object when not authenticated)

---

## Session Structure

The session object contains:

| Field | Type | Description |
|-------|------|-------------|
| `user.id` | `string` | Unique user ID (CUID) |
| `user.name` | `string \| null` | Display name |
| `user.email` | `string` | Email address |
| `user.role` | `string` | One of: `PATIENT`, `DOCTOR`, `ADMIN` |
| `user.image` | `string \| null` | Profile image URL |
| `expires` | `string` | ISO 8601 expiry timestamp |

## Middleware Protection

Route protection is enforced in `middleware.ts` using NextAuth's `withAuth` wrapper:

```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware';

export default withAuth(function middleware(req) {
  const token = req.nextauth.token;
  const role = token.role as string;

  // Role-based portal access
  if (pathname.startsWith('/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(/* ... */);
  }
  if (pathname.startsWith('/doctor') && role !== 'DOCTOR') {
    return NextResponse.redirect(/* ... */);
  }
  if (pathname.startsWith('/patient') && role !== 'PATIENT') {
    return NextResponse.redirect(/* ... */);
  }

  return NextResponse.next();
});
```

**Protected route patterns:**

| Pattern | Allowed Role |
|---------|-------------|
| `/patient/*` | `PATIENT` |
| `/doctor/*` | `DOCTOR` |
| `/admin/*` | `ADMIN` |

Unauthenticated users are redirected to `/auth/signin`.

## API-Level Auth

Every API route checks auth server-side:

```typescript
const session = await getServerSession(authOptions);
if (!session) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

const userId = (session.user as { id: string }).id;
const role = (session.user as { role: string }).role;
```

## Role-Based Access Control

| Role | Can Access | Description |
|------|-----------|-------------|
| `PATIENT` | Own cases, own records, own opinions | Patient portal |
| `DOCTOR` | Assigned cases, assigned opinions | Specialist portal |
| `ADMIN` | All cases, all records, all opinions, audit logs | Admin portal |

## Security Notes

- Sessions are stored server-side (database or Redis) and referenced by cookie
- Passwords are hashed with bcryptjs before storage
- The `Cache-Control: private, no-store` header is set on all authenticated API responses to prevent caching
- CSRF protection is handled automatically by NextAuth.js
- The `x-internal-secret` header is required for internal AI API calls (service-to-service auth)
- Failed login attempts return the same `"Invalid credentials"` error for both wrong email and wrong password to prevent enumeration
