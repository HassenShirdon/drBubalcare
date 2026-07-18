# Data Layer Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Install & integrate Zod, React Hook Form, Zustand domain stores, and TanStack Query hooks into the existing Next.js app, refactoring all current forms and data flows.

**Architecture:** Hybrid approach — Zod + RHF for all form validation, Zustand for client-only UI state (sidebar, wizard steps, lab filters), TanStack Query for server-state reads via new API routes, while keeping existing server actions for mutations.

**Tech Stack:** Next.js 15, React 19, TypeScript, Prisma (Neon), next-auth v4

## Global Constraints

- All new files under `lib/schemas/`, `lib/stores/`, `lib/hooks/`
- No custom `<Form>` wrapper — each form uses `useForm` directly
- Server actions for mutations remain unchanged
- UI/styling of existing forms is preserved — only state management changes
- `@tanstack/react-query` is already installed and provider is wired

---

### Task 1: Install Dependencies & Create Directory Structure

**Files:**
- Modify: `package.json`
- Create: `lib/schemas/`
- Create: `lib/stores/`
- Create: `lib/hooks/`

**Interfaces:**
- Produces: Empty directories ready for schema/store/hook files

- [ ] **Step 1: Install npm packages**

Run: `npm install zod react-hook-form @hookform/resolvers` in project root

- [ ] **Step 2: Create directory structure**

Run:
```powershell
New-Item -ItemType Directory -Path lib/schemas -Force
New-Item -ItemType Directory -Path lib/stores -Force
New-Item -ItemType Directory -Path lib/hooks -Force
```

- [ ] **Step 3: Verify install**

Run: `node -e "require('zod'); require('react-hook-form'); console.log('OK')"` to confirm packages resolve.

---

### Task 2: Create Barrel Exports

**Files:**
- Create: `lib/schemas/index.ts`
- Create: `lib/stores/index.ts`
- Create: `lib/hooks/index.ts`

**Interfaces:**
- Produces: Barrel modules that re-export from sibling files (empty initially, filled by later tasks)

- [ ] **Step 1: Create `lib/schemas/index.ts`**

```ts
export * from './auth.schema';
export * from './post.schema';
export * from './appointment.schema';
```

- [ ] **Step 2: Create `lib/stores/index.ts`**

```ts
export * from './ui-store';
export * from './labs-store';
export * from './appointment-store';
```

- [ ] **Step 3: Create `lib/hooks/index.ts`**

```ts
export * from './use-lab-results';
export * from './use-posts';
export * from './use-doctor';
```

---

### Task 3: Create Zod Schemas

**Files:**
- Create: `lib/schemas/auth.schema.ts`
- Create: `lib/schemas/post.schema.ts`
- Create: `lib/schemas/appointment.schema.ts`

**Interfaces:**
- Produces: `SignInInput`, `PostInput`, `AppointmentInput` types + Zod schemas

- [ ] **Step 1: Create `lib/schemas/auth.schema.ts`**

```ts
import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
});

export type SignInInput = z.infer<typeof signInSchema>;
```

- [ ] **Step 2: Create `lib/schemas/post.schema.ts`**

```ts
import { z } from 'zod';

export const postSchema = z.object({
  title: z.string().min(1, 'Title required'),
  slug: z.string().min(1, 'Slug required').regex(/^[a-z0-9-]+$/, 'Invalid slug format (lowercase, hyphens only)'),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'Content required'),
  coverImage: z.string().url().optional().or(z.literal('')),
  category: z.string().optional(),
  tags: z.string().optional(),
  published: z.boolean(),
});

export type PostInput = z.infer<typeof postSchema>;
```

- [ ] **Step 3: Create `lib/schemas/appointment.schema.ts`**

```ts
import { z } from 'zod';

export const appointmentSchema = z.object({
  serviceId: z.string().min(1, 'Select a service'),
  date: z.string().min(1, 'Select a date'),
  time: z.string().min(1, 'Select a time'),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;
```

- [ ] **Step 4: Run TypeScript check**

Run: `npx tsc --noEmit` — verify no type errors in the new schema files.

---

### Task 4: Create Zustand Domain Stores

**Files:**
- Modify: `lib/stores/ui-store.ts` (migrate from `lib/store.ts`)
- Create: `lib/stores/labs-store.ts`
- Create: `lib/stores/appointment-store.ts`

**Interfaces:**
- Produces: `useAppStore`, `useLabsStore`, `useAppointmentStore` exports

- [ ] **Step 1: Create `lib/stores/ui-store.ts`**

```ts
import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<UIState>((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
```

Content identical to old `lib/store.ts`. This is the migration target.

- [ ] **Step 2: Create `lib/stores/labs-store.ts`**

```ts
import { create } from 'zustand';

interface LabsState {
  filterStatus: string | null;
  setFilterStatus: (status: string | null) => void;
}

export const useLabsStore = create<LabsState>((set) => ({
  filterStatus: null,
  setFilterStatus: (status) => set({ filterStatus: status }),
}));
```

- [ ] **Step 3: Create `lib/stores/appointment-store.ts`**

```ts
import { create } from 'zustand';

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

export const useAppointmentStore = create<AppointmentState>((set) => ({
  step: 1,
  selectedServiceId: null,
  selectedDate: null,
  selectedTime: null,
  nextStep: () => set((s) => ({ step: Math.min(s.step + 1, 3) })),
  prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1) })),
  goToStep: (step) => set({ step }),
  selectService: (id) => set({ selectedServiceId: id }),
  selectDateTime: (date, time) => set({ selectedDate: date, selectedTime: time }),
  reset: () => set({ step: 1, selectedServiceId: null, selectedDate: null, selectedTime: null }),
}));
```

- [ ] **Step 4: Run TypeScript check**

Run: `npx tsc --noEmit` — verify no type errors.

---

### Task 5: Create API Routes for TanStack Query

**Files:**
- Create: `app/api/lab-results/route.ts`
- Create: `app/api/lab-results/[id]/route.ts`
- Create: `app/api/news/route.ts`
- Create: `app/api/news/[slug]/route.ts`
- Create: `app/api/doctors/route.ts`
- Create: `app/api/doctors/[id]/route.ts`

**Interfaces:**
- Produces: JSON REST endpoints consumed by TanStack Query hooks

- [ ] **Step 1: Create `app/api/lab-results/route.ts`**

```ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const results = await prisma.labResult.findMany({
    where: { patientId: (session.user as { id: string }).id },
    include: { metrics: true },
    orderBy: { date: 'desc' },
  });

  return NextResponse.json(results);
}
```

- [ ] **Step 2: Create `app/api/lab-results/[id]/route.ts`**

```ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const result = await prisma.labResult.findUnique({
    where: { id },
    include: { metrics: true, trends: true },
  });

  if (!result) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (result.patientId !== (session.user as { id: string }).id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json(result);
}
```

- [ ] **Step 3: Create `app/api/news/route.ts`**

```ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: { select: { name: true } } },
    orderBy: { publishedAt: 'desc' },
  });

  return NextResponse.json(posts);
}
```

- [ ] **Step 4: Create `app/api/news/[slug]/route.ts`**

```ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: { select: { name: true, image: true } } },
  });

  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json(post);
}
```

- [ ] **Step 5: Create `app/api/doctors/route.ts`**

```ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const doctors = await prisma.doctor.findMany({
    include: { services: true, user: { select: { name: true, image: true } } },
  });

  return NextResponse.json(doctors);
}
```

- [ ] **Step 6: Create `app/api/doctors/[id]/route.ts`**

```ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const doctor = await prisma.doctor.findUnique({
    where: { id },
    include: { services: true, user: { select: { name: true, image: true } } },
  });

  if (!doctor) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json(doctor);
}
```

- [ ] **Step 7: Run TypeScript check**

Run: `npx tsc --noEmit` — verify no type errors in API routes.

---

### Task 6: Create TanStack Query Hooks

**Files:**
- Create: `lib/hooks/use-lab-results.ts`
- Create: `lib/hooks/use-posts.ts`
- Create: `lib/hooks/use-doctor.ts`

**Interfaces:**
- Consumes: API routes from Task 5
- Produces: `useLabResults()`, `useLabResult(id)`, `usePosts()`, `usePost(slug)`, `useDoctors()`, `useDoctor(id)`

- [ ] **Step 1: Create `lib/hooks/use-lab-results.ts`**

```ts
import { useQuery } from '@tanstack/react-query';

export function useLabResults() {
  return useQuery({
    queryKey: ['lab-results'],
    queryFn: async () => {
      const res = await fetch('/api/lab-results');
      if (!res.ok) throw new Error('Failed to fetch lab results');
      return res.json();
    },
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
    enabled: !!id,
  });
}
```

- [ ] **Step 2: Create `lib/hooks/use-posts.ts`**

```ts
import { useQuery } from '@tanstack/react-query';

export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await fetch('/api/news');
      if (!res.ok) throw new Error('Failed to fetch posts');
      return res.json();
    },
  });
}

export function usePost(slug: string) {
  return useQuery({
    queryKey: ['posts', slug],
    queryFn: async () => {
      const res = await fetch(`/api/news/${slug}`);
      if (!res.ok) throw new Error('Failed to fetch post');
      return res.json();
    },
    enabled: !!slug,
  });
}
```

- [ ] **Step 3: Create `lib/hooks/use-doctor.ts`**

```ts
import { useQuery } from '@tanstack/react-query';

export function useDoctors() {
  return useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const res = await fetch('/api/doctors');
      if (!res.ok) throw new Error('Failed to fetch doctors');
      return res.json();
    },
  });
}

export function useDoctor(id: string) {
  return useQuery({
    queryKey: ['doctors', id],
    queryFn: async () => {
      const res = await fetch(`/api/doctors/${id}`);
      if (!res.ok) throw new Error('Failed to fetch doctor');
      return res.json();
    },
    enabled: !!id,
  });
}
```

- [ ] **Step 4: Run TypeScript check**

Run: `npx tsc --noEmit` — verify no type errors.

---

### Task 7: Refactor Sign-In Form (RHF + Zod)

**Files:**
- Modify: `app/auth/signin/page.tsx`

**Interfaces:**
- Consumes: `signInSchema`, `SignInInput` from `lib/schemas/auth.schema.ts`
- Produces: Refactored sign-in form using RHF + Zod, identical UI

- [ ] **Step 1: Rewrite `app/auth/signin/page.tsx` to use RHF + Zod**

Replace the file content:

```tsx
'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, type SignInInput } from '@/lib/schemas/auth.schema';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  async function handleSignIn(data: SignInInput) {
    const res = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
      callbackUrl,
    });

    if (res?.error) {
      setError('root', { message: 'Invalid email or password' });
    } else if (res?.url) {
      window.location.href = res.url;
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="font-headline-md text-2xl font-semibold text-clinical-navy">
            Dr Bubal Care
          </Link>
          <h1 className="mt-6 font-headline-md text-2xl font-bold text-text-medical-black">
            Sign in to your account
          </h1>
          <p className="mt-2 font-body-md text-sm text-on-surface-variant">
            Access your patient or physician portal
          </p>
        </div>

        <form onSubmit={handleSubmit(handleSignIn)} className="bg-white rounded-2xl p-8 border border-surface-gray/60 shadow-sm space-y-5">
          {errors.root && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm p-3 rounded-xl border border-red-200">
              <AlertCircle className="size-4 flex-shrink-0" />
              <span>{errors.root.message}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="email" className="font-label-md text-sm font-medium text-clinical-navy">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-[18px] text-on-surface-variant/50" />
              <input
                id="email"
                type="email"
                {...register('email')}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-gray bg-surface text-text-medical-black font-body-md text-sm placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-clinical-navy/20 focus:border-clinical-navy transition-all"
              />
            </div>
            {errors.email && (
              <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="font-label-md text-sm font-medium text-clinical-navy">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-[18px] text-on-surface-variant/50" />
              <input
                id="password"
                type="password"
                {...register('password')}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-gray bg-surface text-text-medical-black font-body-md text-sm placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-clinical-navy/20 focus:border-clinical-navy transition-all"
              />
            </div>
            {errors.password && (
              <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-clinical-navy text-white font-medium text-sm py-3 rounded-xl hover:bg-primary-container transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center font-body-md text-sm text-on-surface-variant">
          Don&apos;t have an account?{' '}
          <Link href="/" className="text-clinical-navy font-medium hover:text-healing-teal transition-colors">
            Contact us
          </Link>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Run TypeScript check**

Run: `npx tsc --noEmit` — verify no type errors.

---

### Task 8: Refactor Post Form (RHF + Zod)

**Files:**
- Modify: `app/admin/news/post-form.tsx`

**Interfaces:**
- Consumes: `postSchema`, `PostInput` from `lib/schemas/post.schema.ts`
- Produces: Refactored post form using RHF + Zod, identical UI

- [ ] **Step 1: Rewrite `app/admin/news/post-form.tsx` to use RHF + Zod**

```tsx
'use client';

import { useRouter } from 'next/navigation';
import TiptapEditor from '@/components/tiptap-editor';
import { createPost, updatePost } from './actions';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postSchema, type PostInput } from '@/lib/schemas/post.schema';
import { useEffect } from 'react';

interface PostFormProps {
  post?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    coverImage: string | null;
    category: string | null;
    tags: string[];
    published: boolean;
  };
}

export function PostForm({ post }: PostFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title ?? '',
      slug: post?.slug ?? '',
      excerpt: post?.excerpt ?? '',
      content: post?.content ?? '{}',
      coverImage: post?.coverImage ?? '',
      category: post?.category ?? '',
      tags: post?.tags?.join(', ') ?? '',
      published: post?.published ?? false,
    },
  });

  const titleValue = watch('title');
  const slugValue = watch('slug');
  const coverImageValue = watch('coverImage');

  function autoGenerateSlug(title: string) {
    if (!post && !slugValue) {
      setValue(
        'slug',
        title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim()
      );
    }
  }

  async function handleSave(data: PostInput) {
    const formData = new FormData();
    formData.set('title', data.title);
    formData.set('slug', data.slug);
    formData.set('excerpt', data.excerpt ?? '');
    formData.set('content', data.content);
    formData.set('coverImage', data.coverImage ?? '');
    formData.set('category', data.category ?? '');
    formData.set('tags', data.tags ?? '');
    formData.set('published', String(data.published));

    try {
      if (post) {
        await updatePost(post.id, formData);
      } else {
        await createPost(formData);
      }
    } catch (err) {
      console.error('Failed to save post:', err);
    }
  }

  return (
    <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
      <div className="bg-white rounded-xl border border-surface-gray p-6 space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-clinical-navy mb-1.5">
            Title *
          </label>
          <input
            id="title"
            {...register('title', {
              onChange: (e) => autoGenerateSlug(e.target.value),
            })}
            className="w-full h-9 px-3 rounded-lg border border-surface-gray text-sm focus:outline-none focus:border-clinical-navy"
            placeholder="Post title"
          />
          {errors.title && (
            <p className="text-red-600 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-semibold text-clinical-navy mb-1.5">
            Slug *
          </label>
          <input
            id="slug"
            {...register('slug')}
            className="w-full h-9 px-3 rounded-lg border border-surface-gray text-sm focus:outline-none focus:border-clinical-navy font-mono"
            placeholder="post-url-slug"
          />
          {errors.slug && (
            <p className="text-red-600 text-xs mt-1">{errors.slug.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-semibold text-clinical-navy mb-1.5">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            {...register('excerpt')}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-surface-gray text-sm focus:outline-none focus:border-clinical-navy resize-none"
            placeholder="Short summary shown on cards"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-clinical-navy mb-1.5">
              Category
            </label>
            <input
              id="category"
              {...register('category')}
              className="w-full h-9 px-3 rounded-lg border border-surface-gray text-sm focus:outline-none focus:border-clinical-navy"
              placeholder="e.g. Company News, Medical Research"
            />
          </div>
          <div>
            <label htmlFor="tags" className="block text-sm font-semibold text-clinical-navy mb-1.5">
              Tags
            </label>
            <input
              id="tags"
              {...register('tags')}
              className="w-full h-9 px-3 rounded-lg border border-surface-gray text-sm focus:outline-none focus:border-clinical-navy"
              placeholder="comma, separated, tags"
            />
          </div>
        </div>

        <div>
          <label htmlFor="coverImage" className="block text-sm font-semibold text-clinical-navy mb-1.5">
            Cover Image URL
          </label>
          <input
            id="coverImage"
            {...register('coverImage')}
            className="w-full h-9 px-3 rounded-lg border border-surface-gray text-sm focus:outline-none focus:border-clinical-navy"
            placeholder="https://example.com/image.jpg"
          />
          {errors.coverImage && (
            <p className="text-red-600 text-xs mt-1">{errors.coverImage.message}</p>
          )}
          {coverImageValue && (
            <div className="mt-2 relative aspect-video rounded-lg overflow-hidden border border-surface-gray bg-surface-gray/30">
              <img
                src={coverImageValue}
                alt="Cover preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-surface-gray p-6 space-y-3">
        <label className="block text-sm font-semibold text-clinical-navy">Content</label>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <TiptapEditor content={field.value} onChange={field.onChange} placeholder="Write your article content..." />
          )}
        />
        {errors.content && (
          <p className="text-red-600 text-xs mt-1">{errors.content.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between bg-white rounded-xl border border-surface-gray p-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register('published')}
            className="size-4 rounded border-surface-gray text-clinical-navy focus:ring-clinical-navy"
          />
          <span className="text-sm font-medium text-clinical-navy">Publish immediately</span>
        </label>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/news')}
            className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-clinical-navy transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-clinical-navy text-white text-sm font-semibold px-6 py-2 rounded-lg hover:bg-primary-container transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
          </button>
        </div>
      </div>
    </form>
  );
}
```

- [ ] **Step 2: Run TypeScript check**

Run: `npx tsc --noEmit` — verify no type errors.

---

### Task 9: Refactor Booking Wizard (RHF + Zod + Zustand)

**Files:**
- Modify: `app/directory/[id]/page.tsx`

**Interfaces:**
- Consumes: `useAppointmentStore` from `lib/stores/appointment-store.ts`, `appointmentSchema` from `lib/schemas/appointment.schema.ts`
- Produces: Booking wizard using Zustand for step state and RHF for confirmation form

- [ ] **Step 1: Rewrite `app/directory/[id]/page.tsx` to use Zustand + RHF**

```tsx
"use client"
import Link from 'next/link';
import { ArrowLeft, Briefcase, Star, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { appointmentSchema, type AppointmentInput } from '@/lib/schemas/appointment.schema';
import { useAppointmentStore } from '@/lib/stores/appointment-store';

export default function DoctorProfile() {
  const { step, selectedServiceId, selectedDate, selectedTime, nextStep, prevStep, selectService, selectDateTime, reset } = useAppointmentStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AppointmentInput>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      serviceId: selectedServiceId ?? '',
      date: selectedDate ?? '',
      time: selectedTime ?? '',
    },
  });

  function handleConfirm(data: AppointmentInput) {
    selectService(data.serviceId);
    selectDateTime(data.date, data.time);
    alert(`Appointment Confirmed\nService: ${data.serviceId}\nDate: ${data.date}\nTime: ${data.time}`);
    reset();
  }

  return (
    <div className="p-4 md:p-margin-desktop max-w-4xl mx-auto pb-24 md:pb-8 space-y-stack-lg">
      <Link href="/directory" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-clinical-navy transition-colors mb-4">
        <ArrowLeft className="text-sm" />
        <span className="font-label-md text-sm">Back to Directory</span>
      </Link>

      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-6 border border-surface-gray shadow-sm bg-surface flex flex-col md:flex-row gap-6 items-start">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-surface-gray overflow-hidden shrink-0">
          <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Dr. Adam Bubal" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h1 className="font-headline-lg text-clinical-navy font-bold text-2xl md:text-3xl mb-1">Dr. Adam Bubal</h1>
          <p className="text-healing-teal font-label-md text-base mb-4 font-bold">Psychiatrist</p>
          
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-1.5 text-on-surface-variant text-sm bg-surface-container-low px-3 py-1.5 rounded-lg">
              <Briefcase className="text-sm" />
              <span>15 Yrs Exp</span>
            </div>
            <div className="flex items-center gap-1.5 text-on-surface-variant text-sm bg-surface-container-low px-3 py-1.5 rounded-lg">
              <Star className="text-sm text-yellow-500" />
              <span className="font-bold text-clinical-navy">4.9</span>
              <span>(124)</span>
            </div>
            <div className="flex items-center gap-1.5 text-on-surface-variant text-sm bg-surface-container-low px-3 py-1.5 rounded-lg">
              <MapPin className="text-sm" />
              <span>Telehealth & In-person</span>
            </div>
          </div>
          
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Dr. Bubal specializes in anxiety disorders, depression, and stress management. 
            He uses evidence-based approaches including CBT and medication management to help patients achieve digital sanctuary.
          </p>
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card border border-surface-gray shadow-sm bg-surface overflow-hidden">
        <div className="bg-clinical-navy p-4 text-white">
          <h2 className="font-headline-md font-bold text-lg">Book Consultation</h2>
        </div>
        
        <div className="p-6">
          <div className="wizard-steps mb-8">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <span className="step-label">Service</span>
            </div>
            <div className="step-line"></div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <span className="step-label">Date & Time</span>
            </div>
            <div className="step-line"></div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <span className="step-label">Details</span>
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-headline-md text-clinical-navy font-bold text-base mb-3">Select Service Type</h3>
              <label className="radio-card p-4 border border-surface-gray rounded-xl flex items-start gap-4 cursor-pointer hover:border-clinical-navy transition-colors relative">
                <input type="radio" name="service" className="mt-1" defaultChecked onClick={() => selectService('initial-evaluation')} />
                <div>
                  <h4 className="font-bold text-clinical-navy text-base">Initial Evaluation</h4>
                  <p className="text-on-surface-variant text-sm mt-1">Comprehensive 60-minute assessment.</p>
                </div>
                <span className="absolute top-4 right-4 font-bold text-clinical-navy">$250</span>
              </label>
              <label className="radio-card p-4 border border-surface-gray rounded-xl flex items-start gap-4 cursor-pointer hover:border-clinical-navy transition-colors relative">
                <input type="radio" name="service" className="mt-1" onClick={() => selectService('follow-up')} />
                <div>
                  <h4 className="font-bold text-clinical-navy text-base">Follow-up Session</h4>
                  <p className="text-on-surface-variant text-sm mt-1">30-minute medication or therapy review.</p>
                </div>
                <span className="absolute top-4 right-4 font-bold text-clinical-navy">$125</span>
              </label>
              
              <div className="flex justify-end mt-6">
                <button onClick={nextStep} className="bg-clinical-navy text-white px-6 py-2 rounded-lg font-label-md font-bold hover:opacity-90 transition-opacity">
                  Next Step
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-headline-md text-clinical-navy font-bold text-base mb-3">Select Date & Time</h3>
              <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                {['Mon 12', 'Tue 13', 'Wed 14', 'Thu 15', 'Fri 16'].map((date, i) => (
                  <button key={date} onClick={() => selectDateTime(date, '')} className={`shrink-0 w-20 py-3 rounded-xl border flex flex-col items-center justify-center gap-1 ${i === 0 ? 'bg-clinical-navy text-white border-clinical-navy' : 'bg-surface border-surface-gray text-on-surface-variant hover:bg-surface-container-low'}`}>
                    <span className="font-label-md text-xs uppercase">{date.split(' ')[0]}</span>
                    <span className="font-bold text-lg">{date.split(' ')[1]}</span>
                  </button>
                ))}
              </div>
              
              <div className="grid grid-cols-3 gap-3 mt-4">
                {['09:00', '10:30', '13:00', '14:30', '16:00'].map((time, i) => (
                  <button key={time} onClick={() => selectDateTime(selectedDate ?? '', time)} className={`py-2 rounded-lg border font-label-md text-sm transition-colors ${i === 2 ? 'bg-evidence-blue-light border-evidence-blue-light text-clinical-navy font-bold' : 'bg-surface border-surface-gray text-on-surface-variant hover:bg-surface-container-low'}`}>
                    {time}
                  </button>
                ))}
              </div>

              <div className="flex justify-between mt-6">
                <button onClick={prevStep} className="text-on-surface-variant px-6 py-2 rounded-lg font-label-md font-bold hover:bg-surface-container-low transition-colors">
                  Back
                </button>
                <button onClick={nextStep} className="bg-clinical-navy text-white px-6 py-2 rounded-lg font-label-md font-bold hover:opacity-90 transition-opacity">
                  Next Step
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit(handleConfirm)} className="space-y-4 animate-fade-in">
              <input type="hidden" {...register('serviceId')} value={selectedServiceId ?? ''} />
              <input type="hidden" {...register('date')} value={selectedDate ?? ''} />
              <input type="hidden" {...register('time')} value={selectedTime ?? ''} />

              <h3 className="font-headline-md text-clinical-navy font-bold text-base mb-3">Confirm Details</h3>
              <div className="bg-surface-container-low p-4 rounded-xl space-y-3">
                <div className="flex justify-between border-b border-surface-gray pb-2">
                  <span className="text-on-surface-variant text-sm">Service</span>
                  <span className="font-bold text-clinical-navy text-sm">{selectedServiceId === 'initial-evaluation' ? 'Initial Evaluation' : 'Follow-up Session'}</span>
                </div>
                <div className="flex justify-between border-b border-surface-gray pb-2">
                  <span className="text-on-surface-variant text-sm">Date & Time</span>
                  <span className="font-bold text-clinical-navy text-sm">{selectedDate}, {selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant text-sm">Total</span>
                  <span className="font-bold text-clinical-navy text-lg">{selectedServiceId === 'initial-evaluation' ? '$250' : '$125'}</span>
                </div>
              </div>

              {errors.serviceId && <p className="text-red-600 text-xs">{errors.serviceId.message}</p>}
              {errors.date && <p className="text-red-600 text-xs">{errors.date.message}</p>}
              {errors.time && <p className="text-red-600 text-xs">{errors.time.message}</p>}

              <div className="flex justify-between mt-6">
                <button type="button" onClick={prevStep} className="text-on-surface-variant px-6 py-2 rounded-lg font-label-md font-bold hover:bg-surface-container-low transition-colors">
                  Back
                </button>
                <button type="submit" className="bg-healing-teal text-white px-6 py-2 rounded-lg font-label-md font-bold hover:opacity-90 transition-opacity shadow-sm">
                  Confirm Booking
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.section>
    </div>
  );
}
```

- [ ] **Step 2: Run TypeScript check**

Run: `npx tsc --noEmit` — verify no type errors.

---

### Task 10: Refactor Labs Pages (TanStack Query + Zustand)

**Files:**
- Modify: `app/patient/labs/page.tsx`
- Modify: `app/patient/labs/[id]/page.tsx`

**Interfaces:**
- Consumes: `useLabResults()`, `useLabResult(id)` from `lib/hooks/use-lab-results.ts`, `useLabsStore` from `lib/stores/labs-store.ts`
- Produces: Live-data labs pages using TanStack Query for data + Zustand for UI state

- [ ] **Step 1: Rewrite `app/patient/labs/page.tsx` to use TanStack Query**

```tsx
"use client"
import Link from 'next/link';
import { motion } from 'motion/react';
import { CloudUpload, Filter, ChevronRight, Droplets, FlaskConical, Sun, Loader2 } from 'lucide-react';
import { useLabResults } from '@/lib/hooks/use-lab-results';
import { useLabsStore } from '@/lib/stores/labs-store';

const iconMap: Record<string, React.ReactNode> = {
  bloodtype: <Droplets />,
  science: <FlaskConical />,
  sunny: <Sun />,
};

export default function LabsPortal() {
  const { data: labResults, isLoading } = useLabResults();
  const { filterStatus, setFilterStatus } = useLabsStore();

  const filtered = labResults?.filter((r: { status?: string }) =>
    !filterStatus || r.status === filterStatus
  );

  return (
    <div className="p-4 md:p-margin-desktop max-w-5xl mx-auto pb-24 md:pb-8 space-y-stack-xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="font-caption text-on-surface-variant text-sm mb-1">Patient Portal</p>
        <h1 className="font-headline-lg text-clinical-navy font-bold text-2xl md:text-3xl">Lab Portal</h1>
      </motion.div>

      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="upload-area p-8 rounded-xl border-2 border-dashed border-surface-gray bg-surface flex flex-col items-center justify-center text-center cursor-pointer hover:border-healing-teal transition-colors group">
          <div className="w-16 h-16 rounded-full bg-evidence-blue-light/50 flex items-center justify-center text-clinical-navy mb-4 group-hover:scale-110 transition-transform">
            <CloudUpload className="text-3xl" />
          </div>
          <h3 className="font-headline-md text-clinical-navy font-bold text-lg mb-1">Upload New Lab Results</h3>
          <p className="text-on-surface-variant text-sm max-w-sm">Drag and drop your PDF results here, or click to browse files.</p>
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-headline-md text-clinical-navy font-bold text-lg">Historical Results</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterStatus(filterStatus ? null : 'REVIEW_NEEDED')}
              className="text-on-surface-variant hover:text-clinical-navy p-1"
            >
              <Filter />
            </button>
          </div>
        </div>
        
        <div className="card border border-surface-gray shadow-sm bg-surface overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-6 animate-spin text-on-surface-variant" />
            </div>
          ) : (
            <div className="divide-y divide-surface-gray">
              {filtered?.map((lab: { id: string; name: string; date: string; doctor: string; status: string; icon: string }) => (
                <Link href={`/patient/labs/${lab.id}`} key={lab.id} className="p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors group block">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant group-hover:bg-evidence-blue-light/50 group-hover:text-clinical-navy transition-colors shrink-0">
                      {iconMap[lab.icon]}
                    </div>
                    <div>
                      <h3 className="font-headline-md font-bold text-clinical-navy text-base">{lab.name}</h3>
                      <p className="text-on-surface-variant text-sm mt-0.5">{lab.date} • {lab.doctor}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`hidden sm:inline-block px-3 py-1 rounded-full text-xs font-bold ${lab.status === 'REVIEW_NEEDED' ? 'bg-error/10 text-error' : 'bg-healing-teal/10 text-healing-teal'}`}>
                      {lab.status === 'REVIEW_NEEDED' ? 'Review Needed' : 'Normal'}
                    </span>
                    <ChevronRight className="text-on-surface-variant text-sm group-hover:text-healing-teal transition-colors" />
                  </div>
                </Link>
              ))}
              {filtered?.length === 0 && (
                <div className="px-4 py-12 text-center text-on-surface-variant">
                  No lab results found.
                </div>
              )}
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
}
```

- [ ] **Step 2: Rewrite `app/patient/labs/[id]/page.tsx` to use TanStack Query**

```tsx
"use client"
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeft, Download, Sparkles, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLabResult } from '@/lib/hooks/use-lab-results';

export default function LabResultDetails() {
  const params = useParams();
  const { data: labResult, isLoading } = useLabResult(params.id as string);

  if (isLoading) {
    return (
      <div className="p-4 md:p-margin-desktop max-w-5xl mx-auto flex items-center justify-center min-h-[50vh]">
        <Loader2 className="size-8 animate-spin text-on-surface-variant" />
      </div>
    );
  }

  if (!labResult) {
    return (
      <div className="p-4 md:p-margin-desktop max-w-5xl mx-auto">
        <p className="text-on-surface-variant">Lab result not found.</p>
        <Link href="/patient/labs" className="text-clinical-navy font-medium mt-2 inline-block">Back to Labs</Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-margin-desktop max-w-5xl mx-auto pb-24 md:pb-8 space-y-stack-lg">
      <Link href="/patient/labs" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-clinical-navy transition-colors mb-2">
        <ArrowLeft className="text-sm" />
        <span className="font-label-md text-sm">Back to Labs</span>
      </Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-clinical-navy font-bold text-2xl md:text-3xl mb-1">{labResult.name}</h1>
          <p className="text-on-surface-variant text-sm">Tested on {new Date(labResult.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} • Ordered by {labResult.doctor}</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-surface border border-surface-gray rounded-lg text-clinical-navy font-label-md text-sm hover:bg-surface-container-low transition-colors shadow-sm">
            <Download className="text-sm" />
            Download PDF
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="font-headline-md text-clinical-navy font-bold text-lg mb-4">Key Metrics</h2>
            <div className="card border border-surface-gray shadow-sm bg-surface overflow-hidden">
              <div className="divide-y divide-surface-gray">
                {labResult.metrics?.map((metric: { id: string; name: string; referenceRange: string; value: number; unit: string; status: string }) => (
                  <div key={metric.id} className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${metric.status === 'HIGH' || metric.status === 'LOW' ? 'bg-error/5' : ''}`}>
                    <div>
                      <h3 className="font-bold text-clinical-navy text-base">{metric.name}</h3>
                      <p className="text-on-surface-variant text-sm mt-0.5">Reference range: {metric.referenceRange}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className={`font-headline-lg font-bold text-2xl ${metric.status === 'HIGH' || metric.status === 'LOW' ? 'text-error' : 'text-clinical-navy'}`}>{metric.value}</span>
                        <span className="text-on-surface-variant text-sm ml-1">{metric.unit}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${metric.status === 'NORMAL' ? 'bg-healing-teal/10 text-healing-teal' : 'bg-error/10 text-error'}`}>
                        {metric.status === 'NORMAL' ? 'Normal' : metric.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="font-headline-md text-clinical-navy font-bold text-lg mb-4">RBC Historical Trend</h2>
            <div className="card border border-surface-gray shadow-sm bg-surface p-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={labResult.trends ?? []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} domain={['dataMin - 0.5', 'dataMax + 0.5']} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ color: '#0F172A', fontWeight: 'bold' }}
                  />
                  <Line type="monotone" dataKey="value" stroke="#00796B" strokeWidth={3} dot={{ r: 4, fill: '#00796B', strokeWidth: 2, stroke: '#FFFFFF' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.section>
        </div>

        <motion.div className="space-y-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <section>
            <h2 className="font-headline-md text-clinical-navy font-bold text-lg mb-4 flex items-center gap-2">
              <Sparkles className="text-healing-teal" />
              AI Interpretation
            </h2>
            <div className="card p-5 border border-evidence-blue-light shadow-sm bg-gradient-to-br from-surface to-evidence-blue-light/20 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-healing-teal/5 rounded-full blur-2xl"></div>
              
              <div className="relative z-10 space-y-4">
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Your overall {labResult.name} is mostly within normal limits. Your metrics show a stable, healthy trend over the past months.
                </p>
                {labResult.aiInterpretation && (
                  <div className="p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-white/40">
                    <h4 className="font-bold text-clinical-navy text-sm mb-1">AI Assessment</h4>
                    <p className="text-on-surface-variant text-sm">{labResult.aiInterpretation}</p>
                  </div>
                )}
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Dr. Bubal has been notified of these results and will discuss them during your next follow-up.
                </p>
              </div>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Run TypeScript check**

Run: `npx tsc --noEmit` — verify no type errors.

---

### Task 11: Clean Up Old Files

**Files:**
- Delete: `lib/store.ts`

- [ ] **Step 1: Delete `lib/store.ts`**

Verify all imports pointed to `@/lib/store` have been updated to `@/lib/stores/ui-store`. There are no existing imports of `lib/store` (only the file itself). Remove it.

```powershell
Remove-Item lib/store.ts
```

- [ ] **Step 2: Final TypeScript check**

Run: `npx tsc --noEmit` — verify the entire project compiles cleanly.

- [ ] **Step 3: Run lint**

Run: `npm run lint` — verify no lint errors.
