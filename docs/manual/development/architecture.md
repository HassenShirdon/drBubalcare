# Code Architecture

Patterns and conventions used throughout the Dr. Bubal Care codebase.

## Directory Structure

The codebase follows Next.js App Router conventions with a `lib/` directory for shared business logic:

| Directory | Responsibility |
|-----------|---------------|
| `app/` | Pages (route components) and API route handlers |
| `components/` | Shared React components (UI primitives + feature components) |
| `hooks/` | Shared React hooks |
| `lib/` | Business logic, utilities, schemas, stores, and services |
| `prisma/` | Database schema and migrations |
| `types/` | TypeScript ambient type declarations |
| `__tests__/` | Test suites organized by test type |

## Design Patterns

### API Routes

All API routes live under `app/api/` and follow Next.js App Router conventions. Each route exports named HTTP method handlers (`GET`, `POST`, `PUT`, `DELETE`):

```typescript
// app/api/cases/route.ts
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // ...
}

export async function POST(request: Request) {
  // ...
}
```

Dynamic segments use the folder convention (`app/api/cases/[id]/route.ts`). Route parameters are accessed via the `params` prop:

```typescript
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // ...
}
```

**Auth pattern:** Most routes call `getServerSession(authOptions)` to verify the session and extract the user ID and role. AI internal routes use a separate `x-internal-secret` header check instead.

**Response pattern:** All routes return `NextResponse.json()` with appropriate status codes. Successful mutations return `201`. Error responses include `{ error: string }`.

**Validation pattern:** Request bodies are validated with Zod schemas before processing:

```typescript
const parsed = createCaseSchema.safeParse(body);
if (!parsed.success) {
  return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
}
```

### React Query Hooks

Data fetching uses TanStack React Query. Custom hooks are defined in `lib/hooks/` and follow a consistent pattern:

```typescript
// lib/hooks/use-cases.ts
export function useCases() {
  return useQuery({
    queryKey: ['cases'],
    queryFn: async () => {
      const res = await fetch('/api/cases');
      if (!res.ok) throw new Error('Failed to fetch cases');
      return res.json();
    },
    staleTime: 60 * 1000,
  });
}
```

Mutations invalidate related query caches on success:

```typescript
export function useCreateCase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => { /* ... */ },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
    },
  });
}
```

Query keys follow the pattern `['resource']` for lists and `['resource', id]` for individual items.

### Zod Schemas

Input validation schemas live in `lib/schemas/` and are exported from `lib/schemas/index.ts`. Each schema file defines both the schema and its inferred TypeScript type:

```typescript
// lib/schemas/case.schema.ts
import { z } from 'zod';

export const createCaseSchema = z.object({
  serviceType: z.enum(['SPECIALIST_OPINION', 'RESULT_INTERPRETATION', 'FOLLOW_UP', 'TREND_ANALYSIS']),
  description: z.string().min(10).max(2000),
});

export type CreateCaseInput = z.infer<typeof createCaseSchema>;
```

Schemas are used in API routes for request body validation and in client components with `react-hook-form` + `@hookform/resolvers`.

### Component Architecture

UI primitives in `components/ui/` are built with shadcn/ui (base-nova style, Tailwind CSS). Feature components sit alongside them in `components/`.

Portal layouts (`PatientLayout.tsx`, `DoctorLayout.tsx`) provide role-specific navigation and chrome. Each portal directory under `app/` has its own `layout.tsx` that wraps pages with the appropriate layout component.

## State Management

The app uses a layered state management approach:

| Layer | Tool | Purpose |
|-------|------|---------|
| **Server state** | TanStack React Query | API data fetching, caching, and synchronization |
| **Client state** | Zustand | UI state (sidebar toggle, etc.) |
| **Form state** | React Hook Form + Zod | Form validation and submission |
| **Session state** | NextAuth.js (JWT) | Authentication and user session |

Zustand stores in `lib/stores/` are lightweight and focused on UI concerns:

```typescript
// lib/stores/ui-store.ts
export const useAppStore = create<UIState>((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));
```

## Security Patterns

**Authentication:** NextAuth.js with JWT strategy. Credentials provider authenticates against bcrypt password hashes in the database.

**Route protection:** `middleware.ts` enforces role-based access at the edge. Routes under `/patient/*`, `/doctor/*`, and `/admin/*` require the matching role in the session token.

**API authorization:** Every API route handler verifies the session and checks the user's role before returning data. Patient routes only return the user's own data. Doctor routes only return assigned cases. Admin routes return all data.

**PHI-safe AI prompting:** Before any LLM call, the PHI stripper (`lib/ai/phi-stripper.ts`) removes or redacts patient names, emails, phone numbers, dates of birth, MRNs, and addresses. Clinical content is preserved.

**Internal API secret:** AI routes that are triggered server-side (pre-screening, routing, summary generation) require an `x-internal-secret` header instead of a user session, since they run as background jobs.

**Cache control:** API routes return `Cache-Control: private, no-store` headers to prevent caching of sensitive data.

## Performance Patterns

**Turbopack:** The dev server and build use Turbopack (`next dev --turbopack`) for faster compilation.

**React Query caching:** Default stale time is 5 minutes (configured in `Providers.tsx`). Individual queries override this as needed (e.g., 60 seconds for case data).

**Prisma singleton:** The Prisma client is cached in `globalThis` during development to prevent connection exhaustion from hot-reload (`lib/db.ts`).

**Server Components:** Pages default to React Server Components. Client components are explicitly marked with `"use client"` at the top of the file.

**Image optimization:** Next.js `Image` component with remote patterns configured in `next.config.ts`.

## Key Configuration Files

| File | Purpose |
|------|---------|
| `tsconfig.json` | TypeScript config with `@/*` path alias |
| `vitest.config.ts` | Test runner config with `@` alias |
| `eslint.config.mjs` | ESLint with next/core-web-vitals and next/typescript |
| `postcss.config.mjs` | PostCSS with Tailwind CSS plugin |
| `next.config.ts` | Next.js config with Turbopack and experimental features |
| `components.json` | shadcn/ui configuration (base-nova style) |
| `prisma.config.ts` | Prisma config with migrations path and datasource URL |
