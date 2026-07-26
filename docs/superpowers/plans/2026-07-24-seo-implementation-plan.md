# SEO Implementation Plan — Dr. Bubal Care

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement full SEO layer across all public pages — metadata, sitemap, robots.txt, JSON-LD structured data, error pages, security headers.

**Architecture:** Centralized `lib/seo.ts` utility with `SITE` constant, `buildMetadata()` helper, and `JsonLd` component. Each page exports its own `generateMetadata` or static `metadata`. Landing page and directory doctor page converted from client to server components. All protected portal pages get `noindex`.

**Tech Stack:** Next.js 15.5.20 (App Router), TypeScript, Prisma, Tailwind CSS v4

## Global Constraints

- No new npm dependencies
- Domain placeholder: `https://drbubalcare.com`
- OG image placeholder path: `/og-default.png`
- All new files use TypeScript
- Follow existing code patterns (clinical-navy, healing-teal color scheme, font-headline-md/font-body-md classes)
- Every public page gets its own metadata export
- Every protected portal layout gets `robots: { index: false, follow: false }`
- Metadata description should reference board-certified specialist opinions, 24-48 hour turnaround

---

### Task 1: SEO Utility Module (`lib/seo.ts`)

**Files:**
- Create: `lib/seo.ts`

**Interfaces:**
- Produces: `SITE` (const), `buildMetadata(overrides: Partial<Metadata>): Metadata`, `JsonLd({ data }: { data: Record<string, unknown> })` (React component)

- [ ] **Step 1: Create `lib/seo.ts`**

```typescript
import type { Metadata } from 'next';

export const SITE = {
  name: 'Dr Bubal Care',
  url: 'https://drbubalcare.com',
  description: 'AI-assisted diagnostic coordination platform. Get board-certified specialist opinions on lab results, biopsies, and medical images in 24-48 hours.',
  ogImage: '/og-default.png',
} as const;

export function buildMetadata(overrides: Partial<Metadata> = {}): Metadata {
  const { openGraph: ogOverrides, twitter: twitterOverrides, ...rest } = overrides;

  return {
    metadataBase: new URL(SITE.url),
    openGraph: {
      siteName: SITE.name,
      locale: 'en_US',
      type: 'website',
      images: [{ url: SITE.ogImage, width: 1200, height: 630 }],
      ...ogOverrides,
    },
    twitter: {
      card: 'summary_large_image',
      ...twitterOverrides,
    },
    robots: {
      index: true,
      follow: true,
    },
    ...rest,
  };
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

- [ ] **Step 2: Verify build passes**

Run: `npm run build`
Expected: Build succeeds, no type errors

- [ ] **Step 3: Commit**

```bash
git add lib/seo.ts
git commit -m "feat(seo): add SEO utility module with SITE const, buildMetadata, and JsonLd"
```

---

### Task 2: Root Layout Metadata

**Files:**
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `buildMetadata` from `lib/seo.ts`
- Produces: Root `metadata` export with enriched OG, Twitter, canonical, robots, icons

- [ ] **Step 1: Edit `app/layout.tsx`** — update the metadata export

Replace the existing metadata:
```typescript
export const metadata: Metadata = {
  title: 'Dr Bubal Care',
  description: 'Evidence-Based Care',
};
```

With:
```typescript
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: {
    default: 'Dr Bubal Care — Specialist Medical Opinions in 24-48 Hours',
    template: '%s | Dr Bubal Care',
  },
  metadataBase: new URL('https://drbubalcare.com'),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
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

Keep all other existing code unchanged (font imports, Providers, body classes, head stylesheet link).

- [ ] **Step 2: Verify build passes**

Run: `npm run build`
Expected: Build succeeds, no type errors

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat(seo): enrich root layout metadata with OG, Twitter, canonical, robots"
```

---

### Task 3: Landing Page Conversion

**Files:**
- Create: `components/landing-page/landing-content.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `buildMetadata` from `lib/seo.ts`
- Produces: `LandingContent` (client component), `Home` page as server component with metadata

- [ ] **Step 1: Create `components/landing-page/landing-content.tsx`**

This file takes the EXACT content of the current `app/page.tsx` body (minus the `'use client'` directive is added):

```typescript
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
  return (
    <div className="bg-surface text-on-surface font-body-md antialiased pt-24 selection:bg-healing-teal/30 selection:text-clinical-navy scroll-smooth">
      <Navigation />
      <main>
        <HeroSection />
        <ProblemSection />
        <HowItWorks />
        <SpecializationsSection />
        <ServicesSection />
        <TrustSection />
        <StatsBanner />
        <LatestNewsClient />
        <CTASection />
        <ContactSection />
      </main>
      <footer className="bg-clinical-navy w-full border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-6 md:px-16 py-12 text-on-primary">
          <div className="space-y-3">
            <div className="font-headline-md text-xl font-bold text-white">Dr Bubal Care</div>
            <p className="text-white/80 max-w-xs text-xs leading-relaxed">Delivering uncompromising medical excellence and evidence-based guidance to patients globally.</p>
          </div>
          <div className="space-y-3">
            <h4 className="font-label-md text-xs text-white uppercase tracking-wider opacity-60 font-semibold">Clinical Navigation</h4>
            <div className="flex flex-col space-y-1.5">
              <a className="text-white/80 hover:text-white transition-colors text-xs w-fit" href="#home">Home</a>
              <a className="text-white/80 hover:text-white transition-colors text-xs w-fit" href="#services">Services</a>
              <a className="text-white/80 hover:text-white transition-colors text-xs w-fit" href="#about">About</a>
              <a className="text-white/80 hover:text-white transition-colors text-xs w-fit" href="#specializations">Specializations</a>
              <Link className="text-white/80 hover:text-white transition-colors text-xs w-fit" href="/news">News</Link>
              <a className="text-white/80 hover:text-white transition-colors text-xs w-fit" href="#contact">Contact</a>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-label-md text-xs text-white uppercase tracking-wider opacity-60 font-semibold">Legal &amp; Privacy</h4>
            <div className="flex flex-col space-y-1.5">
              <a className="text-white/80 hover:text-white transition-colors text-xs w-fit" href="#">Privacy Policy</a>
              <a className="text-white/80 hover:text-white transition-colors text-xs w-fit" href="#">Terms &amp; Conditions</a>
              <a className="text-white/80 hover:text-white transition-colors text-xs w-fit" href="#">Patient Rights</a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center">
          <p className="text-white/60 text-xs">&copy; 2026 Dr Bubal Care. Evidence-based medical excellence.</p>
        </div>
      </footer>
    </div>
  );
}
```

- [ ] **Step 2: Rewrite `app/page.tsx`** to be a server component with metadata

Replace the entire file content with:

```typescript
import LandingContent from '@/components/landing-page/landing-content';
import { buildMetadata, JsonLd, SITE } from '@/lib/seo';

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
  return (
    <>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'MedicalOrganization',
        name: SITE.name,
        url: SITE.url,
        description: SITE.description,
        medicalSpecialty: 'Diagnostic Medicine',
      }} />
      <LandingContent />
    </>
  );
}
```

- [ ] **Step 3: Verify build passes**

Run: `npm run build`
Expected: Build succeeds, no type errors

- [ ] **Step 4: Commit**

```bash
git add components/landing-page/landing-content.tsx app/page.tsx
git commit -m "feat(seo): convert landing page to server component with metadata and JSON-LD"
```

---

### Task 4: Directory Pages (Listing + [id])

**Files:**
- Create: `app/directory/[id]/doctor-profile-content.tsx`
- Modify: `app/directory/page.tsx`
- Modify: `app/directory/[id]/page.tsx`

**Interfaces:**
- Consumes: `buildMetadata`, `JsonLd`, `SITE` from `lib/seo.ts`
- Produces: Doctor profile page as server component with dynamic metadata and Physician JSON-LD

- [ ] **Step 1: Add static metadata to `app/directory/page.tsx`**

Add this metadata export before the component:

```typescript
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Specialist Directory — Dr Bubal Care',
  description: 'Browse board-certified specialists available for remote medical consultations. Find the right expert for your diagnostic needs.',
  alternates: { canonical: '/directory' },
  openGraph: {
    title: 'Specialist Directory — Dr Bubal Care',
    description: 'Find board-certified specialists for remote consultations.',
    type: 'website',
  },
});
```

- [ ] **Step 2: Create `app/directory/[id]/doctor-profile-content.tsx`**

Create a client component that contains the current booking wizard UI. This absorbs all the `'use client'` code from the current `app/directory/[id]/page.tsx`.

```typescript
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Briefcase, Star, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { appointmentSchema, type AppointmentInput } from '@/lib/schemas/appointment.schema';
import { useAppointmentStore } from '@/lib/stores/appointment-store';

interface DoctorProfileContentProps {
  doctor: {
    name: string;
    specialty: string | null;
    experience: string | null;
    rating: number | null;
    reviewCount: number | null;
    bio: string | null;
    imageUrl: string | null;
    services: { id: string; title: string; description: string | null; price: number }[];
  };
}

export default function DoctorProfileContent({ doctor }: DoctorProfileContentProps) {
  const { step, selectedServiceId, selectedDate, selectedTime, nextStep, prevStep, selectService, selectDateTime, reset } = useAppointmentStore();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<AppointmentInput>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: { serviceId: '', date: '', time: '' },
  });

  useEffect(() => {
    if (selectedServiceId) setValue('serviceId', selectedServiceId);
  }, [selectedServiceId, setValue]);

  useEffect(() => {
    if (selectedDate) setValue('date', selectedDate);
  }, [selectedDate, setValue]);

  useEffect(() => {
    if (selectedTime) setValue('time', selectedTime);
  }, [selectedTime, setValue]);

  const handleConfirm = (data: AppointmentInput) => {
    selectService(data.serviceId);
    selectDateTime(data.date, data.time);
    alert('Appointment Confirmed');
    reset();
  };

  const serviceLabel = selectedServiceId ? SERVICE_LABELS[selectedServiceId]?.name : 'Not selected';
  const dateTimeLabel = selectedDate && selectedTime ? `${selectedDate}, ${selectedTime}` : 'Not selected';
  const priceLabel = selectedServiceId ? SERVICE_LABELS[selectedServiceId]?.price : '$0';

  return (
    <div className="p-4 md:p-margin-desktop max-w-4xl mx-auto pb-24 md:pb-8 space-y-stack-lg">
      <Link href="/directory" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-clinical-navy transition-colors mb-4">
        <ArrowLeft className="text-sm" />
        <span className="font-label-md text-sm">Back to Directory</span>
      </Link>

      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-6 border border-surface-gray shadow-sm bg-surface flex flex-col md:flex-row gap-6 items-start">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-surface-gray overflow-hidden shrink-0 relative">
          <Image
            src={doctor.imageUrl ?? 'https://i.pravatar.cc/150?u=a042581f4e29026704d'}
            alt={`Dr. ${doctor.name}`}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="flex-1">
          <h1 className="font-headline-lg text-clinical-navy font-bold text-2xl md:text-3xl mb-1">Dr. {doctor.name}</h1>
          <p className="text-healing-teal font-label-md text-base mb-4 font-bold">{doctor.specialty ?? 'Specialist'}</p>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-1.5 text-on-surface-variant text-sm bg-surface-container-low px-3 py-1.5 rounded-lg">
              <Briefcase className="text-sm" />
              <span>{doctor.experience ?? ''} Yrs Exp</span>
            </div>
            <div className="flex items-center gap-1.5 text-on-surface-variant text-sm bg-surface-container-low px-3 py-1.5 rounded-lg">
              <Star className="text-sm text-yellow-500" />
              <span className="font-bold text-clinical-navy">{doctor.rating ?? 'N/A'}</span>
              {doctor.reviewCount && <span>({doctor.reviewCount})</span>}
            </div>
            <div className="flex items-center gap-1.5 text-on-surface-variant text-sm bg-surface-container-low px-3 py-1.5 rounded-lg">
              <MapPin className="text-sm" />
              <span>Telehealth & In-person</span>
            </div>
          </div>
          <p className="text-on-surface-variant text-sm leading-relaxed">{doctor.bio ?? ''}</p>
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
              {doctor.services.map((service) => (
                <label key={service.id}
                  className={`radio-card p-4 border rounded-xl flex items-start gap-4 cursor-pointer transition-colors relative ${selectedServiceId === service.id ? 'border-clinical-navy bg-surface-container-low' : 'border-surface-gray hover:border-clinical-navy'}`}
                >
                  <input type="radio" name="service" className="mt-1" checked={selectedServiceId === service.id} onChange={() => selectService(service.id)} />
                  <div>
                    <h4 className="font-bold text-clinical-navy text-base">{service.title}</h4>
                    {service.description && <p className="text-on-surface-variant text-sm mt-1">{service.description}</p>}
                  </div>
                  <span className="absolute top-4 right-4 font-bold text-clinical-navy">${service.price}</span>
                </label>
              ))}
              <div className="flex justify-end mt-6">
                <button onClick={nextStep} className="bg-clinical-navy text-white px-6 py-2 rounded-lg font-label-md font-bold hover:opacity-90 transition-opacity">Next Step</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-headline-md text-clinical-navy font-bold text-base mb-3">Select Date & Time</h3>
              <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                {['Mon 12', 'Tue 13', 'Wed 14', 'Thu 15', 'Fri 16'].map((date) => (
                  <button key={date} onClick={() => selectDateTime(date, selectedTime ?? '')}
                    className={`shrink-0 w-20 py-3 rounded-xl border flex flex-col items-center justify-center gap-1 ${selectedDate === date ? 'bg-clinical-navy text-white border-clinical-navy' : 'bg-surface border-surface-gray text-on-surface-variant hover:bg-surface-container-low'}`}
                  >
                    <span className="font-label-md text-xs uppercase">{date.split(' ')[0]}</span>
                    <span className="font-bold text-lg">{date.split(' ')[1]}</span>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {['09:00', '10:30', '13:00', '14:30', '16:00'].map((time) => (
                  <button key={time} onClick={() => selectDateTime(selectedDate ?? '', time)}
                    className={`py-2 rounded-lg border font-label-md text-sm transition-colors ${selectedTime === time ? 'bg-evidence-blue-light border-evidence-blue-light text-clinical-navy font-bold' : 'bg-surface border-surface-gray text-on-surface-variant hover:bg-surface-container-low'}`}
                  >
                    {time}
                  </button>
                ))}
              </div>
              <div className="flex justify-between mt-6">
                <button onClick={prevStep} className="text-on-surface-variant px-6 py-2 rounded-lg font-label-md font-bold hover:bg-surface-container-low transition-colors">Back</button>
                <button onClick={nextStep} className="bg-clinical-navy text-white px-6 py-2 rounded-lg font-label-md font-bold hover:opacity-90 transition-opacity">Next Step</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit(handleConfirm)} className="space-y-4 animate-fade-in">
              <h3 className="font-headline-md text-clinical-navy font-bold text-base mb-3">Confirm Details</h3>
              <input type="hidden" {...register('serviceId')} />
              <input type="hidden" {...register('date')} />
              <input type="hidden" {...register('time')} />
              <div className="bg-surface-container-low p-4 rounded-xl space-y-3">
                <div className="flex justify-between border-b border-surface-gray pb-2">
                  <span className="text-on-surface-variant text-sm">Service</span>
                  <span className="font-bold text-clinical-navy text-sm">{serviceLabel}</span>
                </div>
                <div className="flex justify-between border-b border-surface-gray pb-2">
                  <span className="text-on-surface-variant text-sm">Date & Time</span>
                  <span className="font-bold text-clinical-navy text-sm">{dateTimeLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant text-sm">Total</span>
                  <span className="font-bold text-clinical-navy text-lg">{priceLabel}</span>
                </div>
              </div>
              {(errors.serviceId || errors.date || errors.time) && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                  {errors.serviceId && <p>{errors.serviceId.message}</p>}
                  {errors.date && <p>{errors.date.message}</p>}
                  {errors.time && <p>{errors.time.message}</p>}
                </div>
              )}
              <div className="flex justify-between mt-6">
                <button type="button" onClick={prevStep} className="text-on-surface-variant px-6 py-2 rounded-lg font-label-md font-bold hover:bg-surface-container-low transition-colors">Back</button>
                <button type="submit" className="bg-healing-teal text-white px-6 py-2 rounded-lg font-label-md font-bold hover:opacity-90 transition-opacity shadow-sm">Confirm Booking</button>
              </div>
            </form>
          )}
        </div>
      </motion.section>
    </div>
  );
}
```

- [ ] **Step 3: Rewrite `app/directory/[id]/page.tsx`** to be a server component

Replace the entire file content with:

```typescript
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { buildMetadata, JsonLd, SITE } from '@/lib/seo';
import DoctorProfileContent from './doctor-profile-content';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const doctor = await prisma.doctor.findUnique({
    where: { id },
    select: {
      id: true,
      specialty: true,
      bio: true,
      rating: true,
      reviewCount: true,
      user: { select: { name: true } },
    },
  });
  if (!doctor) return {};
  const name = doctor.user.name ?? 'Specialist';
  const specialty = doctor.specialty ?? 'Medicine';
  return buildMetadata({
    title: `Dr. ${name} — ${specialty}`,
    description: doctor.bio ?? `Book a consultation with Dr. ${name}, a ${specialty} specialist.`,
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
    include: {
      user: { select: { name: true, email: true } },
      services: { select: { id: true, title: true, description: true, price: true } },
    },
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
        image: doctor.imageUrl,
        worksFor: { '@type': 'MedicalOrganization', name: SITE.name, url: SITE.url },
        aggregateRating: doctor.rating ? {
          '@type': 'AggregateRating',
          ratingValue: doctor.rating,
          reviewCount: doctor.reviewCount ?? 0,
        } : undefined,
      }} />
      <DoctorProfileContent doctor={{
        name,
        specialty,
        experience: doctor.experience,
        rating: doctor.rating,
        reviewCount: doctor.reviewCount,
        imageUrl: doctor.imageUrl,
        services: doctor.services,
      }} />
    </>
  );
}
```

- [ ] **Step 4: Verify build passes**

Run: `npm run build`
Expected: Build succeeds, no type errors

- [ ] **Step 5: Commit**

```bash
git add app/directory/page.tsx app/directory/[id]/page.tsx app/directory/[id]/doctor-profile-content.tsx
git commit -m "feat(seo): add metadata to directory pages, convert [id] page to server component"
```

---

### Task 5: News Pages Metadata

**Files:**
- Modify: `app/news/page.tsx`
- Modify: `app/news/[slug]/page.tsx`

**Interfaces:**
- Consumes: `buildMetadata`, `JsonLd`, `SITE` from `lib/seo.ts`
- Produces: Static metadata on `/news`, dynamic `generateMetadata` on `/news/[slug]` with Article JSON-LD

- [ ] **Step 1: Add static metadata to `app/news/page.tsx`**

Add after the imports:

```typescript
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'News & Updates — Dr Bubal Care',
  description: 'Latest news, medical insights, and platform updates from Dr. Bubal Care. Stay informed about diagnostic medicine and telehealth developments.',
  alternates: { canonical: '/news' },
  openGraph: {
    title: 'News & Updates — Dr Bubal Care',
    description: 'Latest medical news and platform updates.',
    type: 'website',
  },
});
```

- [ ] **Step 2: Add `generateMetadata` to `app/news/[slug]/page.tsx`**

Add after imports:

```typescript
import type { Metadata } from 'next';
import { buildMetadata, JsonLd } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    select: { title: true, excerpt: true, coverImage: true, updatedAt: true, slug: true, publishedAt: true },
  });
  if (!post) return {};
  return buildMetadata({
    title: `${post.title} — Dr Bubal Care`,
    description: post.excerpt ?? 'Read more on Dr Bubal Care.',
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

Then in the component's JSX, after the `<main>` opening tag, add the JSON-LD:

```typescript
<JsonLd data={{
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: post.title,
  description: post.excerpt ?? undefined,
  image: post.coverImage ?? undefined,
  datePublished: post.publishedAt?.toISOString(),
  dateModified: post.updatedAt.toISOString(),
  author: post.author?.name ? {
    '@type': 'Person',
    name: post.author.name,
  } : undefined,
  publisher: {
    '@type': 'Organization',
    name: 'Dr Bubal Care',
    logo: { '@type': 'ImageObject', url: 'https://drbubalcare.com/icon.svg' },
  },
}} />
```

Place the `<JsonLd>` component right after the `<main>` tag, before the `<article>` tag.

- [ ] **Step 3: Verify build passes**

Run: `npm run build`
Expected: Build succeeds, no type errors

- [ ] **Step 4: Commit**

```bash
git add app/news/page.tsx app/news/[slug]/page.tsx
git commit -m "feat(seo): add metadata to news pages with Article JSON-LD"
```

---

### Task 6: Auth Pages — Noindex

**Files:**
- Modify: `app/auth/signin/page.tsx`
- Modify: `app/auth/signup/patient/page.tsx`
- Modify: `app/auth/signup/doctor/page.tsx`

**Interfaces:**
- Consumes: `buildMetadata` from `lib/seo.ts`
- Produces: Metadata with `robots: { index: false }` on auth pages

- [ ] **Step 1: Add metadata to `app/auth/signin/page.tsx`**

Since this is a client component, we need to add a metadata export using Next.js App Router convention. Note that for client components, metadata must be defined in the layout or via `generateMetadata` exported — actually, in App Router, `metadata` export from client components IS supported for basic metadata. Let me verify...

Actually in Next.js App Router, `export const metadata` does NOT work from client components. The metadata must be exported from a server component. Since `/auth/signin` doesn't have its own layout (it goes through the root layout), I need to either:
1. Convert it to a server component (but it uses hooks)
2. Add a parent layout for the auth route group

Actually the cleanest approach is: since the root layout already has the metadata template `'%s | Dr Bubal Care'`, I can add a `generateMetadata` export. Wait, no — client components can't export metadata.

The best approach here is to create a `layout.tsx` inside the `app/auth/` directory. This layout will be a server component that wraps all auth pages and can export metadata with `noindex`.

Let me update this task accordingly.

- [ ] **Step 1: Create `app/auth/layout.tsx`**

```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

This is a server component that wraps all auth pages and exports the noindex directive. The auth pages (`signin`, `signup/patient`, `signup/doctor`) remain as client components underneath.

No changes needed to the individual auth page files since the layout provides the metadata.

- [ ] **Step 2: Verify build passes**

Run: `npm run build`
Expected: Build succeeds, no type errors

- [ ] **Step 3: Commit**

```bash
git add app/auth/layout.tsx
git commit -m "feat(seo): add noindex metadata to auth route group layout"
```

---

### Task 7: Portal Layouts — Noindex

**Files:**
- Modify: `app/patient/layout.tsx`
- Modify: `app/doctor/layout.tsx`
- Modify: `app/admin/layout.tsx`

**Interfaces:**
- Consumes: Nothing from lib/seo.ts (simple static metadata)
- Produces: `robots: { index: false, follow: false }` on all protected portal pages

- [ ] **Step 1: Read each portal layout to find where to add metadata**

Check the existing portal layout files. Add a `metadata` export to each.

For `app/patient/layout.tsx`:
```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};
```

For `app/doctor/layout.tsx`:
```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};
```

For `app/admin/layout.tsx`:
```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};
```

Add the import and export at the top of each file, before the component definition.

- [ ] **Step 2: Verify build passes**

Run: `npm run build`
Expected: Build succeeds, no type errors

- [ ] **Step 3: Commit**

```bash
git add app/patient/layout.tsx app/doctor/layout.tsx app/admin/layout.tsx
git commit -m "feat(seo): add noindex to protected portal layouts"
```

---

### Task 8: Dynamic Sitemap

**Files:**
- Create: `app/sitemap.ts`

**Interfaces:**
- Consumes: `SITE` from `lib/seo.ts`
- Produces: `GET /sitemap.xml` response with all public pages

- [ ] **Step 1: Create `app/sitemap.ts`**

```typescript
import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';
import { SITE } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE.url,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE.url}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${SITE.url}/directory`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  const newsPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE.url}/news/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const doctors = await prisma.doctor.findMany({
    select: { id: true, updatedAt: true },
  });

  const doctorPages: MetadataRoute.Sitemap = doctors.map((doctor) => ({
    url: `${SITE.url}/directory/${doctor.id}`,
    lastModified: doctor.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [...staticPages, ...newsPages, ...doctorPages];
}
```

- [ ] **Step 2: Verify build passes**

Run: `npm run build`
Expected: Build succeeds, no type errors

- [ ] **Step 3: Commit**

```bash
git add app/sitemap.ts
git commit -m "feat(seo): add dynamic sitemap with news and doctor pages"
```

---

### Task 9: Robots.txt

**Files:**
- Create: `app/robots.ts`

**Interfaces:**
- Consumes: `SITE` from `lib/seo.ts`
- Produces: `GET /robots.txt` response

- [ ] **Step 1: Create `app/robots.ts`**

```typescript
import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/patient/', '/doctor/', '/auth/'],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
```

- [ ] **Step 2: Verify build passes**

Run: `npm run build`
Expected: Build succeeds, no type errors

- [ ] **Step 3: Commit**

```bash
git add app/robots.ts
git commit -m "feat(seo): add robots.txt disallowing protected routes"
```

---

### Task 10: Error Pages

**Files:**
- Create: `app/not-found.tsx`
- Create: `app/error.tsx`

- [ ] **Step 1: Create `app/not-found.tsx`**

```typescript
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="text-center max-w-md space-y-6">
        <div className="text-clinical-navy font-headline-md text-8xl font-bold opacity-10">404</div>
        <h1 className="font-headline-lg text-clinical-navy text-3xl font-bold">Page Not Found</h1>
        <p className="text-on-surface-variant">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-clinical-navy text-white text-sm font-medium px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `app/error.tsx`**

```typescript
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="text-center max-w-md space-y-6">
        <h1 className="font-headline-lg text-clinical-navy text-3xl font-bold">Something went wrong</h1>
        <p className="text-on-surface-variant">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 bg-clinical-navy text-white text-sm font-medium px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify build passes**

Run: `npm run build`
Expected: Build succeeds, no type errors

- [ ] **Step 4: Commit**

```bash
git add app/not-found.tsx app/error.tsx
git commit -m "feat(seo): add custom 404 and error boundary pages"
```

---

### Task 11: Security Headers

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Edit `next.config.ts`**

Add the `headers` async function to the config:

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
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
```

- [ ] **Step 2: Verify build passes**

Run: `npm run build`
Expected: Build succeeds, no type errors

- [ ] **Step 3: Commit**

```bash
git add next.config.ts
git commit -m "feat(seo): add security headers to next.config"
```
