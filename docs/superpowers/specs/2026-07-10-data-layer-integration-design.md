# Data Layer Integration: Zod, RHF, Zustand, TanStack Query

**Date:** 2026-07-10
**Project:** Dr. Bubal Care
**Status:** Approved Design

---

## 1. Objective

Install and integrate four libraries into the existing Next.js codebase, refactoring all current forms and data flows to use established patterns:

- **Zod** — schema validation & type inference
- **React Hook Form** — form state management with Zod resolvers
- **Zustand** — domain-specific client state stores
- **TanStack Query** — server state fetching on client pages

---

## 2. Package Installation

```json
"dependencies": {
  "zod": "^3.x",
  "react-hook-form": "^7.x",
  "@hookform/resolvers": "^3.x"
}
```

`@tanstack/react-query` is already installed (v5.101.2) and wired in `app/Providers.tsx`.

---

## 3. Directory Structure

```
lib/
  schemas/               ← Zod validation schemas
    index.ts             ← barrel export
    auth.schema.ts
    post.schema.ts
    appointment.schema.ts
  stores/                ← Zustand domain stores
    index.ts             ← barrel export
    ui-store.ts          ← migrated from lib/store.ts
    labs-store.ts
    appointment-store.ts
  hooks/                 ← TanStack Query hooks
    index.ts             ← barrel export
    use-lab-results.ts
    use-posts.ts
    use-doctor.ts
```

Remove `lib/store.ts` — content moves to `lib/stores/ui-store.ts`.

---

## 4. Zod Schemas

### `lib/schemas/auth.schema.ts`
```ts
export const signInSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
});
export type SignInInput = z.infer<typeof signInSchema>;
```

### `lib/schemas/post.schema.ts`
```ts
export const postSchema = z.object({
  title: z.string().min(1, 'Title required'),
  slug: z.string().min(1, 'Slug required').regex(/^[a-z0-9-]+$/, 'Invalid slug'),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'Content required'),
  coverImage: z.string().url().optional().or(z.literal('')),
  category: z.string().optional(),
  tags: z.string().optional(),
  published: z.boolean(),
});
export type PostInput = z.infer<typeof postSchema>;
```

### `lib/schemas/appointment.schema.ts`
```ts
export const appointmentSchema = z.object({
  serviceId: z.string().min(1, 'Select a service'),
  date: z.string().min(1, 'Select a date'),
  time: z.string().min(1, 'Select a time'),
});
export type AppointmentInput = z.infer<typeof appointmentSchema>;
```

---

## 5. React Hook Form Integration

Each form uses `useForm` with `zodResolver` directly — no abstracted `<Form>` wrapper:

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, type SignInInput } from '@/lib/schemas';

const form = useForm<SignInInput>({
  resolver: zodResolver(signInSchema),
  defaultValues: { email: '', password: '' },
});

const errors = form.formState.errors;

return (
  <form onSubmit={form.handleSubmit(handleSignIn)}>
    <input {...form.register('email')} />
    {errors.email && <span>{errors.email.message}</span>}
  </form>
);
```

### Refactored Forms

| File | Current | After |
|------|---------|-------|
| `app/auth/signin/page.tsx` | `useState` per field, raw submit | RHF + `signInSchema` |
| `app/admin/news/post-form.tsx` | 7 `useState` calls, FormData builder | RHF + `postSchema`, `register()` per field |
| `app/directory/[id]/page.tsx` | `useState(1)` for wizard step | `useAppointmentStore` for step, RHF for step 3 confirmation |

Existing UI styling is preserved — only state management and validation change.

---

## 6. Zustand Domain Stores

### `lib/stores/ui-store.ts`
```ts
interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}
```
Migrated directly from `lib/store.ts`.

### `lib/stores/labs-store.ts`
```ts
interface LabsState {
  filterStatus: string | null;
  setFilterStatus: (status: string | null) => void;
}
```
Filter state for the labs portal listing page.

### `lib/stores/appointment-store.ts`
```ts
interface AppointmentState {
  step: number;
  selectedServiceId: string | null;
  selectedDate: string | null;
  selectedTime: string | null;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  selectService: (id: string) => void;
  selectDateTime: (date: string, time: string) => void;
  reset: () => void;
}
```
Replaces the `useState(1)` step tracking in the booking wizard.

---

## 7. TanStack Query Hooks

New API routes for client reads (keeps server actions for mutations):

### `lib/hooks/use-lab-results.ts`
- `useLabResults()` → `GET /api/lab-results`
- `useLabResult(id)` → `GET /api/lab-results/[id]`

### `lib/hooks/use-posts.ts`
- `usePosts()` → `GET /api/news`
- `usePost(slug)` → `GET /api/news/[slug]`

### `lib/hooks/use-doctor.ts`
- `useDoctors()` → `GET /api/doctors`
- `useDoctor(id)` → `GET /api/doctors/[id]`

### New API Routes
- `app/api/lab-results/route.ts` — reads from Prisma, returns JSON
- `app/api/lab-results/[id]/route.ts`
- `app/api/news/route.ts`
- `app/api/news/[slug]/route.ts`
- `app/api/doctors/route.ts`
- `app/api/doctors/[id]/route.ts`

Server actions (`admin/news/actions.ts`) remain for mutations — no change.

---

## 8. File Migration Summary

| Action | Path |
|--------|------|
| Create | `lib/schemas/index.ts` |
| Create | `lib/schemas/auth.schema.ts` |
| Create | `lib/schemas/post.schema.ts` |
| Create | `lib/schemas/appointment.schema.ts` |
| Create | `lib/stores/index.ts` |
| Move from `lib/store.ts` → | `lib/stores/ui-store.ts` (update imports) |
| Create | `lib/stores/labs-store.ts` |
| Create | `lib/stores/appointment-store.ts` |
| Create | `lib/hooks/index.ts` |
| Create | `lib/hooks/use-lab-results.ts` |
| Create | `lib/hooks/use-posts.ts` |
| Create | `lib/hooks/use-doctor.ts` |
| Create | `app/api/lab-results/route.ts` |
| Create | `app/api/lab-results/[id]/route.ts` |
| Create | `app/api/news/route.ts` |
| Create | `app/api/news/[slug]/route.ts` |
| Create | `app/api/doctors/route.ts` |
| Create | `app/api/doctors/[id]/route.ts` |
| Edit | `app/auth/signin/page.tsx` |
| Edit | `app/admin/news/post-form.tsx` |
| Edit | `app/directory/[id]/page.tsx` |
| Edit | `app/patient/labs/page.tsx` |
| Edit | `app/patient/labs/[id]/page.tsx` |
| Delete | `lib/store.ts` |

---

## 9. Non-Goals

- No `<Form>` abstraction component — each form uses `useForm` directly
- Server actions are not replaced — only supplemented by API routes for reads
- No `zod-to-json-schema` or other Zod plugins
- No Zustand persist middleware
- No TanStack Query devtools in production
