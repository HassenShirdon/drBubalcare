# Caching Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add multi-layer caching to Dr. Bubal Care — TanStack Query client-side caching, Next.js `use cache` for Server Components, and Cache-Control headers for public API routes.

**Architecture:** Three-layer caching strategy:
1. **Client-side (TanStack Query):** Set proper `staleTime`/`gcTime` defaults and per-hook overrides so data isn't refetched on every window focus or navigation.
2. **Server-side (`use cache`):** Cache Prisma queries in Server Components (news page) with `cacheTag` for on-demand invalidation.
3. **HTTP Cache-Control headers:** Add `Cache-Control` to public API routes (news, doctors directory) so CDN/browsers cache responses.

**Tech Stack:** Next.js 15.5.20, TanStack Query v5.101, React 19.1.0, Prisma 7.8.0

## Global Constraints

- Next.js 15.5.20 with App Router + Turbopack
- React 19.1.0
- TanStack React Query v5.101.2
- Prisma 7.8.0 with `prisma-client` generator (not `@prisma/client`)
- `use cache` in v15 requires `experimental: { useCache: true }` in next.config.ts
- All client pages use `"use client"` directive
- News page (`app/news/page.tsx`) is a Server Component — can use `use cache`
- Mutations must invalidate relevant query keys after writes

---

### Task 1: Enable `use cache` and Configure QueryClient Defaults

**Files:**
- Modify: `next.config.ts`
- Modify: `app/Providers.tsx`

**Interfaces:**
- Consumes: existing next.config.ts, existing Providers.tsx
- Produces: enabled `use cache` experimental flag, QueryClient with global staleTime/gcTime defaults

- [ ] **Step 1: Enable `use cache` in next.config.ts**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    useCache: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 2: Configure QueryClient with global defaults in Providers.tsx**

Set `staleTime: 5 * 60 * 1000` (5 min) as default for all queries, and `gcTime: 10 * 60 * 1000` (10 min).

```tsx
"use client"
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,  // 5 minutes
        gcTime: 10 * 60 * 1000,    // 10 minutes
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </SessionProvider>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `pnpm build` and verify no errors from experimental flag.

- [ ] **Step 4: Commit**

```bash
git add next.config.ts app/Providers.tsx
git commit -m "feat: enable use cache and configure React Query global defaults"
```

---

### Task 2: Add Per-Hook staleTime Overrides

**Files:**
- Modify: `lib/hooks/use-posts.ts`
- Modify: `lib/hooks/use-lab-results.ts`
- Modify: `lib/hooks/use-doctor.ts`
- Modify: `lib/hooks/use-doctor-cases.ts`
- Modify: `lib/hooks/use-cases.ts`

**Interfaces:**
- Consumes: QueryClient defaults from Task 1
- Produces: hooks with appropriate staleTime overrides per data type

**StaleTime strategy:**
| Data Type | staleTime | Rationale |
|-----------|-----------|-----------|
| News posts | 30 min | Changes rarely, public data |
| Doctors directory | 15 min | Changes on verification, semi-static |
| Lab results | 2 min | Patient-specific, moderate update frequency |
| Cases (patient/doctor) | 1 min | Clinical data, needs near-real-time |
| Single item (post/[id], lab/[id]) | Inherits 5 min default | Same as parent list |

- [ ] **Step 1: Update use-posts.ts**

Add `staleTime: 30 * 60 * 1000` to `usePosts`. Single post inherits default.

```typescript
import { useQuery } from '@tanstack/react-query';

export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await fetch('/api/news');
      if (!res.ok) throw new Error('Failed to fetch posts');
      return res.json();
    },
    staleTime: 30 * 60 * 1000, // 30 min — news changes rarely
  });
}

export function usePost(slug: string) {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: async () => {
      const res = await fetch(`/api/news/${slug}`);
      if (!res.ok) throw new Error('Failed to fetch post');
      return res.json();
    },
    staleTime: 30 * 60 * 1000, // 30 min — inherits news freshness
  });
}
```

- [ ] **Step 2: Update use-doctor.ts**

Add `staleTime: 15 * 60 * 1000` to both hooks.

```typescript
import { useQuery } from '@tanstack/react-query';

export function useDoctors() {
  return useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const res = await fetch('/api/doctors');
      if (!res.ok) throw new Error('Failed to fetch doctors');
      return res.json();
    },
    staleTime: 15 * 60 * 1000, // 15 min — directory changes infrequently
  });
}

export function useDoctor(id: string) {
  return useQuery({
    queryKey: ['doctor', id],
    queryFn: async () => {
      const res = await fetch(`/api/doctors/${id}`);
      if (!res.ok) throw new Error('Failed to fetch doctor');
      return res.json();
    },
    staleTime: 15 * 60 * 1000, // 15 min
  });
}
```

- [ ] **Step 3: Update use-lab-results.ts**

Add `staleTime: 2 * 60 * 1000` to both hooks.

```typescript
import { useQuery } from '@tanstack/react-query';

export function useLabResults() {
  return useQuery({
    queryKey: ['lab-results'],
    queryFn: async () => {
      const res = await fetch('/api/lab-results');
      if (!res.ok) throw new Error('Failed to fetch lab results');
      return res.json();
    },
    staleTime: 2 * 60 * 1000, // 2 min — patient data, moderate frequency
  });
}

export function useLabResult(id: string) {
  return useQuery({
    queryKey: ['lab-results', id],
    queryFn: async () => {
      const res = await fetch(`/api/lab-results/${id}`);
      if (!res.ok) throw new Error('Failed to fetch lab result');
      return res.json();
    },
    staleTime: 2 * 60 * 1000, // 2 min
  });
}
```

- [ ] **Step 4: Update use-doctor-cases.ts**

Add `staleTime: 60 * 1000` to query hooks. Mutations stay as-is.

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useDoctorCases() {
  return useQuery({
    queryKey: ['doctor-cases'],
    queryFn: async () => {
      const res = await fetch('/api/doctor/cases');
      if (!res.ok) throw new Error('Failed to fetch cases');
      return res.json();
    },
    staleTime: 60 * 1000, // 1 min — clinical data, near-real-time
  });
}

export function useDoctorCase(id: string) {
  return useQuery({
    queryKey: ['doctor-case', id],
    queryFn: async () => {
      const res = await fetch(`/api/doctor/cases/${id}`);
      if (!res.ok) throw new Error('Failed to fetch case');
      return res.json();
    },
    staleTime: 60 * 1000, // 1 min
  });
}

export function useSubmitOpinion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ caseId, content, sign }: { caseId: string; content: string; sign: boolean }) => {
      const res = await fetch(`/api/doctor/cases/${caseId}/opinion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, sign }),
      });
      if (!res.ok) throw new Error('Failed to submit opinion');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor-cases'] });
      queryClient.invalidateQueries({ queryKey: ['doctor-case'] });
    },
  });
}
```

- [ ] **Step 5: Update use-cases.ts**

Add `staleTime: 60 * 1000` to query hooks. Mutations stay as-is.

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useCases() {
  return useQuery({
    queryKey: ['cases'],
    queryFn: async () => {
      const res = await fetch('/api/cases');
      if (!res.ok) throw new Error('Failed to fetch cases');
      return res.json();
    },
    staleTime: 60 * 1000, // 1 min — clinical data
  });
}

export function useCase(id: string) {
  return useQuery({
    queryKey: ['case', id],
    queryFn: async () => {
      const res = await fetch(`/api/cases/${id}`);
      if (!res.ok) throw new Error('Failed to fetch case');
      return res.json();
    },
    staleTime: 60 * 1000, // 1 min
  });
}

export function useCreateCase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: FormData) => {
      const res = await fetch('/api/cases', {
        method: 'POST',
        body: data,
      });
      if (!res.ok) throw new Error('Failed to create case');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
    },
  });
}
```

- [ ] **Step 6: Update inline queries in admin pages**

In `app/admin/cases/page.tsx`, the `useQuery` calls for `admin-cases` and `admin-specialists` need staleTime overrides. Add to each:

```typescript
staleTime: 60 * 1000, // 1 min — admin dashboard data
```

- [ ] **Step 7: Verify build**

Run: `pnpm build` — no errors expected.

- [ ] **Step 8: Commit**

```bash
git add lib/hooks/
git commit -m "feat: add per-hook staleTime overrides for TanStack Query caching"
```

---

### Task 3: Add `use cache` to News Server Component

**Files:**
- Modify: `app/news/page.tsx`

**Interfaces:**
- Consumes: Prisma client, news Post model
- Produces: cached server-side data fetching with `cacheTag` for invalidation

- [ ] **Step 1: Add `use cache` with cacheTag to the news page**

The news page is a Server Component — perfect for `use cache`. Wrap the data fetch in a cached function with `cacheTag('news')`.

```tsx
import Link from 'next/link';
import { prisma } from '@/lib/db';
import Image from 'next/image';
import { Calendar, ArrowRight, Tag } from 'lucide-react';
import { cacheTag } from 'next/cache';

async function getLatestPosts() {
  'use cache';
  cacheTag('news');

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      category: true,
      createdAt: true,
    },
  });

  return posts;
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function NewsPage() {
  const posts = await getLatestPosts();

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pb-24 md:pb-8 space-y-8">
      <div>
        <p className="text-on-surface-variant text-sm mb-1">Dr. Bubal Care</p>
        <h1 className="text-clinical-navy font-bold text-2xl md:text-3xl">News & Updates</h1>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 text-on-surface-variant">
          <p className="text-lg">No posts yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/news/${post.slug}`}
              className="group block bg-white rounded-2xl border border-surface-gray/60 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {post.coverImage && (
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-5">
                {post.category && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-clinical-navy bg-evidence-blue-light/30 px-2 py-1 rounded-full mb-2">
                    <Tag className="size-3" />
                    {post.category}
                  </span>
                )}
                <h2 className="font-semibold text-text-medical-black text-lg group-hover:text-clinical-navy transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-on-surface-variant text-sm mt-1 line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-3 text-xs text-on-surface-variant">
                  <Calendar className="size-3" />
                  {formatDate(post.createdAt)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Add revalidateTag to news admin actions**

In `app/admin/news/actions.ts`, add `revalidateTag('news')` after any CRUD operation so the cached news page invalidates.

Read the file first, then add `import { revalidateTag } from 'next/cache'` and call `revalidateTag('news')` after `revalidatePath` in each action.

- [ ] **Step 3: Verify build**

Run: `pnpm build` — news page should now be cached at build time.

- [ ] **Step 4: Commit**

```bash
git add app/news/page.tsx app/admin/news/actions.ts
git commit -m "feat: add use cache to news server component with cacheTag"
```

---

### Task 4: Add Cache-Control Headers to Public API Routes

**Files:**
- Modify: `app/api/news/route.ts`
- Modify: `app/api/news/[slug]/route.ts`
- Modify: `app/api/news/latest/route.ts`
- Modify: `app/api/doctors/route.ts`

**Interfaces:**
- Consumes: existing API routes
- Produces: API routes with `Cache-Control` headers for CDN/browser caching

- [ ] **Step 1: Add Cache-Control to news list API**

In `app/api/news/route.ts`, add cache headers to the GET response:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { name: true, image: true } } },
  });

  return NextResponse.json(posts, {
    headers: {
      'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
    },
  });
}
```

- [ ] **Step 2: Add Cache-Control to single news post API**

In `app/api/news/[slug]/route.ts`:

```typescript
return NextResponse.json(post, {
  headers: {
    'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
  },
});
```

- [ ] **Step 3: Add Cache-Control to latest news API**

In `app/api/news/latest/route.ts`:

```typescript
return NextResponse.json(posts, {
  headers: {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
  },
});
```

- [ ] **Step 4: Add Cache-Control to doctors directory API**

In `app/api/doctors/route.ts`:

```typescript
return NextResponse.json(doctors, {
  headers: {
    'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
  },
});
```

- [ ] **Step 5: Add no-store to authenticated/personal routes**

For all authenticated routes (cases, lab results, doctor cases), add `no-store` to prevent caching personal data:

```typescript
return NextResponse.json(data, {
  headers: {
    'Cache-Control': 'private, no-store',
  },
});
```

Apply to: `app/api/cases/route.ts`, `app/api/cases/[id]/route.ts`, `app/api/lab-results/route.ts`, `app/api/lab-results/[id]/route.ts`, `app/api/doctor/cases/route.ts`, `app/api/doctor/cases/[id]/route.ts`.

- [ ] **Step 6: Verify build**

Run: `pnpm build` — no errors expected.

- [ ] **Step 7: Commit**

```bash
git add app/api/news/ app/api/doctors/ app/api/cases/ app/api/lab-results/ app/api/doctor/cases/
git commit -m "feat: add Cache-Control headers to API routes"
```

---

### Task 5: Add Query Invalidation to All Mutations

**Files:**
- Modify: `app/admin/cases/[id]/assign/route.ts` (or page)
- Modify: `app/admin/specialists/verify-button.tsx`

**Interfaces:**
- Consumes: existing mutation patterns
- Produces: mutations that invalidate relevant query keys after writes

- [ ] **Step 1: Invalidate admin-cases after case assignment**

After successful PATCH in the assign route, the client-side mutation in `app/admin/cases/page.tsx` should already invalidate `['admin-cases']`. Verify this is correct and add invalidation if missing.

- [ ] **Step 2: Invalidate admin-specialists after verification**

In `app/admin/specialists/verify-button.tsx`, verify the mutation invalidates `['admin-specialists']` on success.

- [ ] **Step 3: Invalidate cases after case creation**

In `app/patient/cases/new/page.tsx` or wherever case creation happens, ensure `useCreateCase` mutation invalidates `['cases']`.

- [ ] **Step 4: Verify build**

Run: `pnpm build`

- [ ] **Step 5: Commit**

```bash
git commit -m "feat: ensure all mutations invalidate relevant query caches"
```

(Only commit if changes were made)

---

### Task 6: Verify Caching Works End-to-End

**Files:**
- No new files — verification only

- [ ] **Step 1: Build and verify no errors**

Run: `pnpm build`

- [ ] **Step 2: Start dev server and verify staleTime behavior**

Run: `pnpm dev`
1. Navigate to `/news` — should fetch once, then use cache on re-navigation
2. Navigate to `/patient/cases` — should fetch once, then use cache
3. Navigate to `/doctor/cases` — should fetch once, then use cache
4. Check Network tab: re-navigation should NOT trigger new API calls within staleTime

- [ ] **Step 3: Verify news page uses server cache**

Check `/news` loads fast on second visit (server-side `use cache` hit).

- [ ] **Step 4: Verify Cache-Control headers**

Check Network tab for API responses:
- `/api/news` → `Cache-Control: public, s-maxage=600, stale-while-revalidate=1200`
- `/api/doctors` → `Cache-Control: public, s-maxage=900, stale-while-revalidate=1800`
- `/api/cases` → `Cache-Control: private, no-store`

- [ ] **Step 5: Final commit (if any fixes needed)**

```bash
git add -A
git commit -m "fix: caching adjustments from end-to-end verification"
```
