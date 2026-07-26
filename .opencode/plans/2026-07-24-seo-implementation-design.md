# SEO Implementation Design — Dr. Bubal Care

**Date:** 2026-07-24
**Status:** Approved
**Scope:** Full SEO layer for all public pages on the Dr. Bubal Care platform

---

## 1. Problem Statement

The Dr. Bubal Care project currently has **zero SEO infrastructure** beyond a minimal root layout title. Key gaps:

- Root metadata is `title: 'Dr Bubal Care', description: 'Evidence-Based Care'` — no OG, no Twitter cards, no robots config, no canonical URLs
- **No page has its own metadata export** — every page inherits the root default
- Landing page (`app/page.tsx`) is `'use client'` — metadata exports are ignored by crawlers in App Router
- `directory/[id]` is also `'use client'` with hardcoded data — same metadata problem
- No `sitemap.ts`, no `robots.ts`, no `not-found.tsx`, no `error.tsx`
- No JSON-LD structured data on any page
- Protected portal pages (`/patient/*`, `/doctor/*`, `/admin/*`) have no `noindex` directive
- No security headers in `next.config.ts`

---

## 2. Approach

**Centralized SEO utility + per-page metadata** using Next.js App Router's built-in `Metadata` API.

- New `lib/seo.ts` module with `SITE` constant, `buildMetadata()` helper, and `JsonLd` component
- Each public page exports its own `generateMetadata` or static `metadata`
- `app/sitemap.ts` and `app/robots.ts` for crawler directives
- Landing page and directory doctor page converted from client to server components
- No new dependencies

---

## 3. Design

### 3.1 SEO Utility Module (`lib/seo.ts`)

**New file.** Central source of truth for all SEO constants and helpers.

**Exports:**

| Export | Type | Purpose |
|--------|------|---------|
| `SITE` | `const` | `{ name: 'Dr Bubal Care', url: 'https://drbubalcare.com', description: '...', ogImage: '/og-default.png' }` |
| `buildMetadata(overrides)` | `function` | Merges SITE defaults with per-page `Metadata` overrides. Returns `Metadata` object. |
| `JsonLd({ data })` | `React component` | Renders `<script type="application/ld+json">` tag with serialized schema data. |

**`SITE` constant values:**
```ts
export const SITE = {
  name: 'Dr Bubal Care',
  url: 'https://drbubalcare.com',  // placeholder, swappable
  description: 'AI-assisted diagnostic coordination platform. Get board-certified specialist opinions in 24-48 hours.',
  ogImage: '/og-default.png',       // placeholder, to be designed
} as const;
```

**`buildMetadata` behavior:**
- Accepts partial `Metadata` object
- Fills `metadataBase` from `SITE.url`
- Fills default `openGraph.siteName`, `openGraph.locale`, `openGraph.images` from `SITE.ogImage`
- Fills default `twitter.card` as `summary_large_image`
- Fills default `robots` as `{ index: true, follow: true }`
- Merges caller overrides on top (shallow merge for top-level, deep for `openGraph`/`twitter`)

### 3.2 Root Layout (`app/layout.tsx`)

**Modified.** Enrich the existing metadata export.

**Current state:**
```ts
export const metadata: Metadata = {
  title: 'Dr Bubal Care',
  description: 'Evidence-Based Care',
};
```

**New state:**
```ts
import { buildMetadata, SITE } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: {
    default: 'Dr Bubal Care — Specialist Medical Opinions in 24-48 Hours',
    template: '%s | Dr Bubal Care',
  },
  description: SITE.description,
  metadataBase: new URL(SITE.url),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: SITE.name,
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/icon.svg',
  },
});
```

**What stays unchanged:** Font imports, `<head>` stylesheet link, Providers wrapper, body classes.

### 3.3 Landing Page Conversion

**New file: `components/landing-page/landing-content.tsx`**
**Modified file: `app/page.tsx`**

**Problem:** `app/page.tsx` is `'use client'`. In App Router, `export const metadata` from a client component is ignored by crawlers. The page renders fine visually but search engines see only the root layout metadata.

**Solution:** Extract all client-side content into a wrapper component.

**`components/landing-page/landing-content.tsx`** (new):
```tsx
'use client';

import Navigation from '@/components/landing-page/navigation';
import HeroSection from '@/components/landing-page/hero-section';
import ProblemSection from '@/components/landing-page/problem-section';
import HowItWorks from '@/components/landing-page/how-it-works';
import SpecializationsSection from '@/components/landing-page/specializations-section';
import ServicesSection from '@/components/landing-page/services-section';
import TrustSection from '@/components/landing-page/trust-section';
import StatsBanner from '@/components/landing-page/stats-banner';
import LatestNewsClient from '@/components/latest-news-client';
import CTASection from '@/components/landing-page/cta-section';
import ContactSection from '@/components/landing-page/contact-section';
import Link from 'next/link';

export default function LandingContent() {
  // ...exact current body of app/page.tsx (lines 18-63)...
}
```

**`app/page.tsx`** (modified — server component):
```tsx
import LandingContent from '@/components/landing-page/landing-content';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Dr Bubal Care — Specialist Medical Opinions in 24-48 Hours',
  description: 'Get board-certified specialist opinions on lab results, biopsies, and medical images in 24-48 hours. AI-assisted diagnostic coordination for patients worldwide.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Dr Bubal Care — Specialist Medical Opinions in 24-48 Hours',
    description: 'Get board-certified specialist opinions on lab results, biopsies, and medical images in 24-48 hours.',
    type: 'website',
  },
});

export default function Home() {
  return <LandingContent />;
}
```

**Behavioral impact:** Zero. The page renders identically. The only change is which component holds the `'use client'` directive.

### 3.4 Directory Doctor Page Conversion

**Modified file: `app/directory/[id]/page.tsx`**

**Problem:** Currently `'use client'` with hardcoded doctor data. No real DB fetch, no metadata.

**Solution:** Convert to server component that fetches from Prisma, exports dynamic metadata.

```tsx
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { buildMetadata, JsonLd, SITE } from '@/lib/seo';
import DoctorProfileContent from './doctor-profile-content';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const doctor = await prisma.doctor.findUnique({
    where: { id },
    include: { user: { select: { name: true } } },
  });
  if (!doctor) return {};
  const name = doctor.user.name ?? 'Specialist';
  const specialty = doctor.specialty ?? 'Medicine';
  return buildMetadata({
    title: `Dr. ${name} — ${specialty}`,
    description: doctor.bio ?? `Book a consultation with Dr. ${name}, ${specialty} specialist.`,
    alternates: { canonical: `/directory/${id}` },
    openGraph: {
      title: `Dr. ${name} — ${specialty} — Dr Bubal Care`,
      description: doctor.bio ?? `Consult with Dr. ${name}.`,
      type: 'profile',
    },
  });
}

export default async function DoctorProfilePage({ params }: Props) {
  const { id } = await params;
  const doctor = await prisma.doctor.findUnique({
    where: { id },
    include: { user: { select: { name: true, email: true } }, services: true },
  });
  if (!doctor) notFound();

  const name = doctor.user.name ?? 'Specialist';
  const specialty = doctor.specialty ?? 'Medicine';

  return (
    <>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'Physician',
        name: `Dr. ${name}`,
        medicalSpecialty: specialty,
        description: doctor.bio,
        image: doctor.avatarUrl,
        worksFor: { '@type': 'MedicalOrganization', name: SITE.name, url: SITE.url },
        aggregateRating: doctor.rating ? {
          '@type': 'AggregateRating',
          ratingValue: doctor.rating,
          reviewCount: doctor.reviewCount ?? 0,
        } : undefined,
      }} />
      <DoctorProfileContent doctor={doctor} />
    </>
  );
}
```

**New file: `app/directory/[id]/doctor-profile-content.tsx`** — client component containing the current booking wizard UI (motion animations, form handling, state management). This absorbs the existing `'use client'` logic from the current page.

### 3.5 Per-Page Metadata

| Page | File | Metadata Type | Title | Description | OG Type | Robots |
|------|------|---------------|-------|-------------|---------|--------|
| `/` | `app/page.tsx` | Static `metadata` | Dr Bubal Care — Specialist Medical Opinions in 24-48 Hours | Get board-certified specialist opinions... | `website` | index, follow |
| `/news` | `app/news/page.tsx` | Static `metadata` | News & Updates | Latest news, medical insights... | `website` | index, follow |
| `/news/[slug]` | `app/news/[slug]/page.tsx` | Dynamic `generateMetadata` | `{post.title} — Dr Bubal Care` | `{post.excerpt}` | `article` | index, follow |
| `/directory` | `app/directory/page.tsx` | Static `metadata` | Specialist Directory | Browse board-certified specialists... | `website` | index, follow |
| `/directory/[id]` | `app/directory/[id]/page.tsx` | Dynamic `generateMetadata` | `Dr. {name} — {specialty}` | `{doctor.bio}` | `profile` | index, follow |
| `/auth/signin` | `app/auth/signin/page.tsx` | Static `metadata` | Sign In | — | — | noindex, nofollow |
| `/auth/signup/patient` | `app/auth/signup/patient/page.tsx` | Static `metadata` | Patient Registration | — | — | noindex, nofollow |
| `/auth/signup/doctor` | `app/auth/signup/doctor/page.tsx` | Static `metadata` | Doctor Registration | — | — | noindex, nofollow |

**Protected portals** — add to each portal layout (`app/patient/layout.tsx`, `app/doctor/layout.tsx`, `app/admin/layout.tsx`):
```ts
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};
```

**News `[slug]` dynamic metadata** — the page already fetches the post from Prisma. `generateMetadata` does the same fetch (Next.js deduplicates the request):

```tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    select: { title: true, excerpt: true, coverImage: true, updatedAt: true, slug: true, publishedAt: true },
  });
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.excerpt ?? SITE.description,
    alternates: { canonical: `/news/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      images: post.coverImage ? [{ url: post.coverImage, width: 1200, height: 630 }] : undefined,
    },
  });
}
```

**All pages** use `alternates: { canonical: pathname }` for duplicate content prevention (UTM parameters, etc.).

### 3.6 Sitemap (`app/sitemap.ts`)

**New file.** Dynamic, queries Prisma for news posts and doctor profiles.

**Includes:**
- `/` — priority 1, changeFrequency `weekly`
- `/news` — priority 0.8, changeFrequency `daily`
- `/directory` — priority 0.7, changeFrequency `weekly`
- `/news/{slug}` — priority 0.6, changeFrequency `monthly`, lastModified from `post.updatedAt`
- `/directory/{id}` — priority 0.5, changeFrequency `monthly`, lastModified from `doctor.updatedAt`

**Excludes:** `/api/*`, `/admin/*`, `/patient/*`, `/doctor/*`, `/auth/*` — these are either behind auth or are API routes.

### 3.7 Robots.txt (`app/robots.ts`)

**New file.**

```ts
rules: [
  { userAgent: '*', allow: '/', disallow: ['/api/', '/admin/', '/patient/', '/doctor/', '/auth/'] },
],
sitemap: `${SITE.url}/sitemap.xml`,
```

### 3.8 JSON-LD Structured Data

| Page | Schema Type | Key Fields |
|------|-------------|------------|
| `/` | `MedicalOrganization` + `WebPage` | `name`, `url`, `logo`, `description`, `medicalSpecialty`, `contactPoint`, `sameAs` |
| `/news/[slug]` | `Article` | `headline`, `description`, `image`, `datePublished`, `dateModified`, `author`, `publisher` |
| `/directory/[id]` | `Physician` | `name`, `medicalSpecialty`, `description`, `image`, `worksFor`, `aggregateRating` |

**Implementation:** `<JsonLd>` component from `lib/seo.ts` renders `<script type="application/ld+json">` in each page's JSX.

### 3.9 Error Pages

**New file: `app/not-found.tsx`**

Custom 404 page. Branded design consistent with the app (clinical navy, healing teal accents). Shows:
- "404 — Page Not Found" heading
- Brief message
- Link back to homepage

**New file: `app/error.tsx`**

Global error boundary. Client component (`'use client'`) with:
- Error message display
- "Try Again" button (`router.refresh()`)

### 3.10 Security Headers (`next.config.ts`)

**Modified.** Add to `nextConfig`:

```ts
headers: [
  {
    source: '/(.*)',
    headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    ],
  },
],
```

---

## 4. Files Changed/Created

| Action | File |
|--------|------|
| **Create** | `lib/seo.ts` |
| **Create** | `app/sitemap.ts` |
| **Create** | `app/robots.ts` |
| **Create** | `app/not-found.tsx` |
| **Create** | `app/error.tsx` |
| **Create** | `components/landing-page/landing-content.tsx` |
| **Create** | `app/directory/[id]/doctor-profile-content.tsx` |
| **Modify** | `app/layout.tsx` |
| **Modify** | `app/page.tsx` |
| **Modify** | `app/directory/[id]/page.tsx` |
| **Modify** | `app/directory/page.tsx` |
| **Modify** | `app/news/page.tsx` |
| **Modify** | `app/news/[slug]/page.tsx` |
| **Modify** | `app/auth/signin/page.tsx` |
| **Modify** | `app/auth/signup/patient/page.tsx` |
| **Modify** | `app/auth/signup/doctor/page.tsx` |
| **Modify** | `app/patient/layout.tsx` |
| **Modify** | `app/doctor/layout.tsx` |
| **Modify** | `app/admin/layout.tsx` |
| **Modify** | `next.config.ts` |

**Total: 7 new files, 13 modified files**

---

## 5. What This Does NOT Cover

- **Core Web Vitals optimization** — the app already uses server components and Turbopack; no structural performance changes needed
- **AMP** — deprecated in Next.js 16, not applicable
- **OG image generation** — a placeholder path is used; actual image design is a separate task
- **Google Search Console submission** — post-deployment manual step
- **Content/keyword strategy** — outside scope of technical SEO
- **Backlink strategy** — outside scope
