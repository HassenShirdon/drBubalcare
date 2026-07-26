# Landing Page Conversion Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the landing page for conversion optimization — lead with patient pain points, add social proof, reduce friction, and create urgency throughout.

**Architecture:** Modify 11 existing components, create 4 new components, update the central data file, remove 1 unused component. All changes stay within `components/landing-page/` and `app/globals.css`. No new dependencies needed — everything uses existing Tailwind, motion/react, and Lucide icons.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS v4, motion/react (Framer Motion), Lucide React, TypeScript

## Global Constraints

- All existing design tokens from `app/globals.css` — no new colors, fonts, or variables
- Tailwind classes only — no inline styles, no CSS modules
- `motion/react` for scroll animations (keep existing `fadeInUp` + `stagger` patterns)
- Mobile-first responsive: `<768px` mobile, `768-1024px` tablet, `>1024px` desktop
- `@/` path alias maps to project root
- Conventional Commits: `feat:`, `fix:`, `test:` — lowercase, imperative, no period
- Component files: `'use client'` only when using hooks or browser APIs; server components otherwise
- All content text lives in `data.ts` — components consume from there

---

## File Structure

```
components/landing-page/
├── data.ts                          (MODIFY — update SPECIALIZATIONS, TRUST_POINTS, SERVICES, STEPS)
├── trust-bar.tsx                    (CREATE — thin trust bar above nav)
├── navigation.tsx                   (MODIFY — integrate trust bar, update CTA)
├── hero-section.tsx                 (MODIFY — problem-led headline, trust strip)
├── problem-section.tsx              (MODIFY — emotional copy, left-border cards, bridge line)
├── how-it-works.tsx                 (MODIFY — 3 steps, dashed line, teal circles)
├── social-proof-section.tsx         (CREATE — testimonials + specialist strip + badges)
├── specializations-section.tsx      (MODIFY — 6 featured, 3-col grid)
├── services-section.tsx             (MODIFY — outcome copy, pricing, CTA per card)
├── stats-banner.tsx                 (MODIFY — context line, CTA below)
├── trust-section.tsx                (MODIFY — objection-based, checklist)
├── cta-section.tsx                  (MODIFY — urgency, micro-trust, animated gradient)
├── contact-section.tsx              (MODIFY — FAQ, simplified form)
├── trust-checklist.tsx              (CREATE — green checkmark list)
├── mini-faq.tsx                     (CREATE — FAQ accordion)
├── medical-illustration.tsx         (DELETE — unused)
app/
├── globals.css                      (MODIFY — add @keyframes for animated gradient)
__tests__/
├── components/
│   ├── landing-trust-bar.test.tsx   (CREATE)
│   ├── landing-social-proof.test.tsx (CREATE)
│   ├── landing-trust-checklist.test.tsx (CREATE)
│   └── landing-mini-faq.test.tsx    (CREATE)
```

---

## Tasks

### Task 1: Update data.ts — Content and Data Models

**Files:**
- Modify: `components/landing-page/data.ts`

**Interfaces:**
- Produces: Updated `SPECIALIZATIONS` (6 items), `TRUST_POINTS` (4 objection-based items), `SERVICES` (4 items with pricing), `STEPS` (3 items)

- [ ] **Step 1: Read current data.ts**

Read `components/landing-page/data.ts` to understand current structure and types.

- [ ] **Step 2: Update SPECIALIZATIONS to 6 items**

Replace the `SPECIALIZATIONS` array. Keep the same type signature `{ title: string; description: string; icon: LucideIcon }`. Remove: Clinical Pathology, Fetal Medicine, Pediatrics, Chronic Disease. Keep: Hematopathology, Diagnostic Radiology, Cytopathology, Dermatopathology, Women's Health, Oncology. Update descriptions to be more outcome-focused:

```typescript
export const SPECIALIZATIONS = [
  {
    title: "Hematopathology",
    description: "Blood disorders, bone marrow biopsies, and hematologic malignancies reviewed by subspecialists.",
    icon: Droplets,
  },
  {
    title: "Diagnostic Radiology",
    description: "X-rays, CT scans, MRIs, and ultrasounds interpreted by board-certified radiologists.",
    icon: Scan,
  },
  {
    title: "Cytopathology",
    description: "Fine needle aspirates, Pap smears, and fluid cytology analyzed by cytopathology experts.",
    icon: Microscope,
  },
  {
    title: "Dermatopathology",
    description: "Skin biopsies and lesion specimens reviewed by dermatopathology specialists.",
    icon: Eye,
  },
  {
    title: "Women's Health",
    description: "Gynecological pathology, breast biopsies, and prenatal screening interpretations.",
    icon: Heart,
  },
  {
    title: "Oncology",
    description: "Cancer pathology, tumor grading, and molecular marker interpretation by oncology experts.",
    icon: Stethoscope,
  },
] as const;
```

Ensure imported icons from `lucide-react` are updated to match: `Droplets, Scan, Microscope, Eye, Heart, Stethoscope`.

- [ ] **Step 3: Update TRUST_POINTS to objection-based format**

Replace `TRUST_POINTS` with objection-based trust points:

```typescript
export const TRUST_POINTS = [
  {
    question: "Is my data safe?",
    answer: "End-to-end encryption. HIPAA and GDPR compliant. Your medical records never leave our secure platform.",
    icon: Shield,
  },
  {
    question: "Are the specialists qualified?",
    answer: "Every specialist is board-certified and credential-verified. We don't compromise on expertise.",
    icon: Award,
  },
  {
    question: "What if I disagree?",
    answer: "Request a peer review at no extra cost. We stand behind every opinion.",
    icon: RefreshCw,
  },
  {
    question: "How fast is it?",
    answer: "24-48 hours on average. Urgent cases are flagged and prioritized.",
    icon: Clock,
  },
] as const;
```

Update type to `{ question: string; answer: string; icon: LucideIcon }`. Update imported icons: add `Shield, Award, RefreshCw, Clock` from lucide-react.

- [ ] **Step 4: Update SERVICES with pricing**

Replace `SERVICES` array. Add `price` field to type:

```typescript
export const SERVICES = [
  {
    title: "Specialist Opinions",
    description: "Upload slides, scans, or reports. Get a board-certified specialist's written opinion within 24-48 hours.",
    icon: FileText,
    category: "Most Popular",
    price: "From $49",
  },
  {
    title: "Result Interpretation",
    description: "Have lab results but unclear what they mean? Get a specialist's plain-language explanation.",
    icon: ClipboardCheck,
    category: "Popular",
    price: "From $29",
  },
  {
    title: "Follow-up Consultations",
    description: "Questions after your report? Ask our AI assistant or book a live consultation.",
    icon: MessageSquare,
    category: "Support",
    price: "Free / From $39",
  },
  {
    title: "Lab Trend Tracking",
    description: "Track your lab results over time. We flag significant changes before your next appointment.",
    icon: TrendingUp,
    category: "Included",
    price: "Included",
  },
] as const;
```

Update type to `{ title: string; description: string; icon: LucideIcon; category: string; price: string }`. Update imported icons: `FileText, ClipboardCheck, MessageSquare, TrendingUp`.

- [ ] **Step 5: Update STEPS to 3 items**

Replace `STEPS` array with 3 steps:

```typescript
export const STEPS = [
  {
    num: "01",
    title: "Upload Your Records",
    description: "Take a photo or upload files. Lab results, scans, slides — we accept all formats.",
  },
  {
    num: "02",
    title: "We Match You",
    description: "AI pairs your case with the right board-certified specialist. No guessing, no referrals needed.",
  },
  {
    num: "03",
    title: "Get Your Answer",
    description: "Receive a written specialist opinion within 24-48 hours. Clear, detailed, and in plain language.",
  },
] as const;
```

- [ ] **Step 6: Add TESTIMONIALS data**

Add a new exported array:

```typescript
export const TESTIMONIALS = [
  {
    quote: "I uploaded my lab results on Monday morning and had a specialist opinion by Tuesday evening. For the first time, I understood my condition.",
    name: "Sarah M.",
    location: "Nairobi, Kenya",
    rating: 5,
  },
  {
    quote: "My local doctor wasn't sure about my biopsy. Dr. Bubal Care connected me to a pathologist who gave me a clear answer in 36 hours.",
    name: "James K.",
    location: "Kampala, Uganda",
    rating: 5,
  },
  {
    quote: "The plain-language summary was the best part. No medical jargon — just clear answers I could share with my family.",
    name: "Amina H.",
    location: "Dar es Salaam, Tanzania",
    rating: 5,
  },
] as const;
```

- [ ] **Step 7: Add SPECIALISTS data**

Add a new exported array:

```typescript
export const SPECIALISTS = [
  { name: "Dr. A. Mensah", specialty: "Hematopathologist" },
  { name: "Dr. K. Okafor", specialty: "Diagnostic Radiologist" },
  { name: "Dr. P. Njeri", specialty: "Cytopathologist" },
  { name: "Dr. S. Abebe", specialty: "Dermatopathologist" },
  { name: "Dr. L. Mwangi", specialty: "Oncologist" },
] as const;
```

- [ ] **Step 8: Add FAQ data**

Add a new exported array:

```typescript
export const FAQ = [
  {
    question: "How much does it cost?",
    answer: "Pricing varies by service. Most specialist opinions start from $49.",
  },
  {
    question: "What files can I upload?",
    answer: "Lab reports, DICOM scans, histology slides, photos — we accept all common formats.",
  },
  {
    question: "Is this available in my country?",
    answer: "We serve patients globally via telehealth. Currently focused on East Africa and expanding.",
  },
] as const;
```

- [ ] **Step 9: Verify data.ts compiles**

Run: `npx tsc --noEmit components/landing-page/data.ts`
Expected: No errors

- [ ] **Step 10: Commit**

```bash
git add components/landing-page/data.ts
git commit -m "feat: update landing page data for conversion redesign"
```

---

### Task 2: Create Trust Bar Component

**Files:**
- Create: `components/landing-page/trust-bar.tsx`
- Test: `__tests__/components/landing-trust-bar.test.tsx`

**Interfaces:**
- Produces: `<TrustBar />` component (server component, no props)

- [ ] **Step 1: Create trust-bar.tsx**

```tsx
import { Shield, Award, Clock } from "lucide-react";

export function TrustBar() {
  return (
    <div className="bg-clinical-navy text-white text-xs py-1.5 hidden md:block">
      <div className="max-w-7xl mx-auto px-6 md:px-16 flex items-center justify-center gap-6">
        <span className="flex items-center gap-1.5">
          <Shield className="w-3 h-3" />
          HIPAA Compliant
        </span>
        <span className="flex items-center gap-1.5">
          <Award className="w-3 h-3" />
          Board-Certified Specialists
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          24-48h Turnaround
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write test for TrustBar**

```tsx
import { render, screen } from "@testing-library/react";
import { TrustBar } from "@/components/landing-page/trust-bar";

describe("TrustBar", () => {
  it("renders all three trust points", () => {
    render(<TrustBar />);
    expect(screen.getByText("HIPAA Compliant")).toBeInTheDocument();
    expect(screen.getByText("Board-Certified Specialists")).toBeInTheDocument();
    expect(screen.getByText("24-48h Turnaround")).toBeInTheDocument();
  });

  it("is hidden on mobile", () => {
    render(<TrustBar />);
    const bar = screen.getByText("HIPAA Compliant").closest("div")!;
    expect(bar.className).toContain("hidden");
    expect(bar.className).toContain("md:block");
  });
});
```

- [ ] **Step 3: Run test**

Run: `npx vitest run __tests__/components/landing-trust-bar.test.tsx`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add components/landing-page/trust-bar.tsx __tests__/components/landing-trust-bar.test.tsx
git commit -m "feat: add trust bar component above navigation"
```

---

### Task 3: Update Navigation Component

**Files:**
- Modify: `components/landing-page/navigation.tsx`

**Interfaces:**
- Consumes: `<TrustBar />` from Task 2

- [ ] **Step 1: Read current navigation.tsx**

Read `components/landing-page/navigation.tsx` to understand current structure.

- [ ] **Step 2: Update CTA button text**

Change the CTA button text from "Start a Case" to "Start Your Case →". Find the button element and update the text content.

- [ ] **Step 3: Add pulse animation on CTA hover**

Add a hover state to the CTA button that triggers a subtle scale animation. Add to the button className: `active:scale-95 transition-transform duration-150`.

- [ ] **Step 4: Import and render TrustBar above navigation**

Import `TrustBar` from `./trust-bar`. Wrap the component return in a fragment, placing `<TrustBar />` before the `<nav>` element:

```tsx
import { TrustBar } from "./trust-bar";

// In the return:
return (
  <>
    <TrustBar />
    <nav className="fixed top-0 md:top-[32px] w-full z-50 h-16 md:h-16 ...">
      {/* existing nav content */}
    </nav>
  </>
);
```

Note: When TrustBar is visible (md+), the nav needs `top-[32px]` (the trust bar height) instead of `top-0`. Use `md:top-[32px] top-0` on the nav.

- [ ] **Step 5: Verify visually**

Run: `npm run dev` and check that:
- Trust bar appears above nav on desktop
- Nav is positioned below trust bar
- On mobile, trust bar is hidden and nav is at top
- CTA shows "Start Your Case →"

- [ ] **Step 6: Commit**

```bash
git add components/landing-page/navigation.tsx
git commit -m "feat: integrate trust bar and update nav CTA"
```

---

### Task 4: Update Hero Section

**Files:**
- Modify: `components/landing-page/hero-section.tsx`

**Interfaces:**
- Produces: Updated hero with problem-led headline, trust strip, removed stat grid

- [ ] **Step 1: Read current hero-section.tsx**

Read `components/landing-page/hero-section.tsx` to understand current structure.

- [ ] **Step 2: Replace headline and subheadline**

Replace the headline "World-class specialists. One platform. Clear answers." with:

```tsx
<h1 className="font-headline-md text-3xl md:text-5xl text-clinical-navy font-semibold leading-[1.15] text-balance">
  Waiting weeks for a specialist opinion?
</h1>
```

Replace the subheadline with:

```tsx
<p className="font-body-lg text-base md:text-lg text-on-surface-variant/80 max-w-2xl">
  Whether your lab results need interpretation or your biopsy needs a second look — get board-certified specialist answers in 24-48 hours, not weeks.
</p>
```

- [ ] **Step 3: Update CTA buttons**

Primary CTA: Change text to "Get Your Results Reviewed →". Add classes: `px-8 py-3.5 shadow-lg hover:shadow-xl`.

Secondary CTA: Change text to "See How It Works". Add `ArrowDown` icon from lucide-react.

- [ ] **Step 4: Add trust strip below CTAs**

After the CTA buttons div, add:

```tsx
<div className="flex items-center justify-center gap-6 mt-8 text-sm text-on-surface-variant">
  <span className="flex items-center gap-1.5">
    <Clock className="w-4 h-4" />
    24-48h Turnaround
  </span>
  <span className="flex items-center gap-1.5">
    <Lock className="w-4 h-4" />
    100% Confidential
  </span>
  <span className="flex items-center gap-1.5">
    <Award className="w-4 h-4" />
    Board-Certified
  </span>
</div>
```

Import `Clock, Lock, Award` from lucide-react.

- [ ] **Step 5: Remove the stat grid at the bottom**

Remove the 3-column stat grid that currently sits at the bottom of the hero section. Those stats live in the stats-banner component.

- [ ] **Step 6: Reduce decorative blur circles**

Keep only 1-2 blur circles (remove the third). Reduce opacity further for less visual noise.

- [ ] **Step 7: Verify visually**

Run: `npm run dev` and check:
- Headline asks the question
- Subheadline gives the answer
- Trust strip shows below CTAs
- No stat grid at bottom
- Background is cleaner

- [ ] **Step 8: Commit**

```bash
git add components/landing-page/hero-section.tsx
git commit -m "feat: redesign hero with problem-led headline and trust strip"
```

---

### Task 5: Update Problem Section

**Files:**
- Modify: `components/landing-page/problem-section.tsx`

**Interfaces:**
- Consumes: Data from `data.ts` (now uses hardcoded emotional copy, not data-driven)

- [ ] **Step 1: Read current problem-section.tsx**

Read `components/landing-page/problem-section.tsx`.

- [ ] **Step 2: Replace section headline and subheadline**

Replace headline with: "The specialist care gap is real"
Replace subheadline with: "Patients in underserved regions face impossible choices: travel for hours, wait for months, or go without expert answers."

- [ ] **Step 3: Rewrite card content**

Replace the three cards with emotional copy:
1. Title: "The Access Gap" — Description: "1 specialist per 100,000+ patients in many regions. Your local doctor may never see your condition before."
2. Title: "The Travel Burden" — Description: "6+ hours average travel to reach a specialist. Families sacrifice work, savings, and time for a single consultation."
3. Title: "The Wait" — Description: "Weeks to months for an appointment. Meanwhile, anxiety builds and treatment delays compound."

- [ ] **Step 4: Change card styling to left-border accent**

Replace the top teal bar (`h-1 w-10 rounded-full bg-healing-teal`) with a left border. On the card element, add: `border-l-4 border-healing-teal`. Remove the old teal bar div.

- [ ] **Step 5: Add bridge line below cards**

After the cards grid, add:

```tsx
<div className="text-center mt-12">
  <p className="text-healing-teal font-semibold text-lg mb-2">There&apos;s a better way.</p>
  <ChevronDown className="w-6 h-6 text-healing-teal mx-auto animate-bounce" />
</div>
```

Import `ChevronDown` from lucide-react.

- [ ] **Step 6: Verify visually**

Run: `npm run dev` and check:
- Emotional headline and copy
- Cards have left border accent
- Bridge line with bouncing chevron appears below

- [ ] **Step 7: Commit**

```bash
git add components/landing-page/problem-section.tsx
git commit -m "feat: rewrite problem section with emotional copy and bridge line"
```

---

### Task 6: Update How It Works

**Files:**
- Modify: `components/landing-page/how-it-works.tsx`

**Interfaces:**
- Consumes: `STEPS` from `data.ts` (now 3 items from Task 1)

- [ ] **Step 1: Read current how-it-works.tsx**

Read `components/landing-page/how-it-works.tsx`.

- [ ] **Step 2: Update section headline and subheadline**

Replace headline with: "Get answers in 3 simple steps"
Replace subheadline with: "No travel. No waiting rooms. Just upload, relax, and get specialist answers."

- [ ] **Step 3: Change connecting line to dashed**

Find the horizontal connecting line element. Change from solid to `border-dashed`.

- [ ] **Step 4: Change step circle colors**

Change step circles from `bg-evidence-blue-light text-clinical-navy` to `bg-healing-teal text-white`.

- [ ] **Step 5: Add CTA button below steps**

After the steps grid, add:

```tsx
<div className="text-center mt-12">
  <button className="bg-clinical-navy text-white rounded-xl px-8 py-3.5 font-medium shadow-lg hover:shadow-xl transition-shadow">
    Start Your Case Now →
  </button>
</div>
```

- [ ] **Step 6: Verify visually**

Run: `npm run dev` and check:
- 3 steps displayed (not 4)
- Dashed connecting line
- Teal step circles
- CTA button below

- [ ] **Step 7: Commit**

```bash
git add components/landing-page/how-it-works.tsx
git commit -m "feat: reduce how-it-works to 3 steps with teal circles"
```

---

### Task 7: Create Social Proof Section

**Files:**
- Create: `components/landing-page/social-proof-section.tsx`
- Test: `__tests__/components/landing-social-proof.test.tsx`

**Interfaces:**
- Consumes: `TESTIMONIALS`, `SPECIALISTS` from `data.ts` (Task 1)
- Produces: `<SocialProofSection />` component

- [ ] **Step 1: Create social-proof-section.tsx**

```tsx
"use client";

import { motion } from "motion/react";
import { Star, Shield, Award } from "lucide-react";
import { TESTIMONIALS, SPECIALISTS } from "./data";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

export function SocialProofSection() {
  return (
    <section className="bg-surface py-16 md:py-24 border-y border-surface-gray/50">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="text-center mb-12"
        >
          <motion.h2
            variants={fadeInUp}
            className="font-headline-md text-2xl md:text-3xl text-text-clinical-navy font-semibold mb-4"
          >
            Trusted by patients and specialists worldwide
          </motion.h2>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {TESTIMONIALS.map((testimonial, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="bg-white rounded-2xl p-6 border border-surface-gray shadow-sm"
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="font-body-md text-sm italic text-on-surface-variant mb-4">
                &quot;{testimonial.quote}&quot;
              </p>
              <div>
                <p className="font-headline-md text-sm font-semibold text-clinical-navy">
                  {testimonial.name}
                </p>
                <p className="font-body-md text-xs text-on-surface-variant/70">
                  {testimonial.location}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Specialist Strip */}
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="flex flex-wrap justify-center gap-8 mb-12"
        >
          {SPECIALISTS.map((specialist, i) => (
            <motion.div key={i} variants={fadeInUp} className="text-center">
              <div className="w-[120px] h-[120px] rounded-full bg-surface-gray mx-auto mb-3 grayscale hover:grayscale-0 transition-all duration-300" />
              <p className="font-headline-md text-sm font-semibold text-clinical-navy">
                {specialist.name}
              </p>
              <p className="font-body-md text-xs text-on-surface-variant/70">
                {specialist.specialty}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Certification Badges */}
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="flex flex-wrap justify-center gap-3"
        >
          {[
            { label: "HIPAA Compliant", icon: Shield },
            { label: "GDPR Certified", icon: Award },
            { label: "Board-Certified Specialists", icon: Award },
          ].map((badge, i) => (
            <motion.span
              key={i}
              variants={fadeInUp}
              className="inline-flex items-center gap-1.5 bg-surface-container-low border border-surface-gray rounded-full px-4 py-1.5 text-xs font-medium text-clinical-navy"
            >
              <badge.icon className="w-3.5 h-3.5" />
              {badge.label}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Write test for SocialProofSection**

```tsx
import { render, screen } from "@testing-library/react";
import { SocialProofSection } from "@/components/landing-page/social-proof-section";

jest.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
}));

describe("SocialProofSection", () => {
  it("renders section heading", () => {
    render(<SocialProofSection />);
    expect(screen.getByText("Trusted by patients and specialists worldwide")).toBeInTheDocument();
  });

  it("renders all three testimonials", () => {
    render(<SocialProofSection />);
    expect(screen.getByText(/Sarah M/)).toBeInTheDocument();
    expect(screen.getByText(/James K/)).toBeInTheDocument();
    expect(screen.getByText(/Amina H/)).toBeInTheDocument();
  });

  it("renders specialist names", () => {
    render(<SocialProofSection />);
    expect(screen.getByText("Dr. A. Mensah")).toBeInTheDocument();
    expect(screen.getByText("Dr. K. Okafor")).toBeInTheDocument();
  });

  it("renders certification badges", () => {
    render(<SocialProofSection />);
    expect(screen.getByText("HIPAA Compliant")).toBeInTheDocument();
    expect(screen.getByText("GDPR Certified")).toBeInTheDocument();
    expect(screen.getByText("Board-Certified Specialists")).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run test**

Run: `npx vitest run __tests__/components/landing-social-proof.test.tsx`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add components/landing-page/social-proof-section.tsx __tests__/components/landing-social-proof.test.tsx
git commit -m "feat: add social proof section with testimonials and specialist strip"
```

---

### Task 8: Update Specializations Section

**Files:**
- Modify: `components/landing-page/specializations-section.tsx`

**Interfaces:**
- Consumes: `SPECIALIZATIONS` from `data.ts` (now 6 items from Task 1)

- [ ] **Step 1: Read current specializations-section.tsx**

Read `components/landing-page/specializations-section.tsx`.

- [ ] **Step 2: Update section headline and subheadline**

Replace headline with: "Expert care across every specialty"
Replace subheadline with: "From hematology to radiology — our specialists cover the disciplines that matter most."

- [ ] **Step 3: Change grid from 5-column to 3-column**

Change `lg:grid-cols-5` to `md:grid-cols-3`. Update responsive: `grid-cols-1 sm:grid-cols-2 md:grid-cols-3`.

- [ ] **Step 4: Increase card padding and icon size**

Change card padding from `p-4` to `p-6`. Change icon container from `w-10 h-10` to `w-12 h-12`.

- [ ] **Step 5: Add hover lift effect**

Add to card className: `group-hover:-translate-y-1 transition-transform duration-200`.

- [ ] **Step 6: Add "View All Specialties" link**

After the grid, add:

```tsx
<div className="text-center mt-8">
  <a href="#specializations" className="text-healing-teal font-medium hover:underline">
    View All Specialties →
  </a>
</div>
```

- [ ] **Step 7: Verify visually**

Run: `npm run dev` and check:
- 6 specialization cards in 3-col grid
- Larger cards with more padding
- Hover lift effect works
- "View All Specialties" link below

- [ ] **Step 8: Commit**

```bash
git add components/landing-page/specializations-section.tsx
git commit -m "feat: update specializations to 6 featured with 3-col grid"
```

---

### Task 9: Update Services Section

**Files:**
- Modify: `components/landing-page/services-section.tsx`

**Interfaces:**
- Consumes: `SERVICES` from `data.ts` (now with pricing from Task 1)

- [ ] **Step 1: Read current services-section.tsx**

Read `components/landing-page/services-section.tsx`.

- [ ] **Step 2: Update section headline**

Replace headline with: "How we help you"

- [ ] **Step 3: Add "Most Popular" tag to first card**

For the first service card, add a tag badge before the title:

```tsx
{service.category === "Most Popular" && (
  <span className="inline-block bg-healing-teal/10 text-healing-teal rounded-full px-3 py-0.5 text-xs font-medium mb-2">
    Most Popular
  </span>
)}
```

- [ ] **Step 4: Add pricing to each card**

After the description, add:

```tsx
<p className="font-headline-md text-sm font-semibold text-clinical-navy mt-3">
  {service.price}
</p>
```

- [ ] **Step 5: Replace "Learn More" text link with CTA button**

Replace the ArrowRight "Learn More" link with:

```tsx
<button className="mt-4 bg-clinical-navy text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary-container transition-colors">
  Get Started →
</button>
```

- [ ] **Step 6: Add top border color differentiation**

For the "Most Popular" card, add `border-t-4 border-clinical-navy`. For other cards, add `border-t-4 border-healing-teal/20`.

- [ ] **Step 7: Verify visually**

Run: `npm run dev` and check:
- "Most Popular" tag on first card
- Pricing shown on each card
- "Get Started →" buttons
- Top border color difference

- [ ] **Step 8: Commit**

```bash
git add components/landing-page/services-section.tsx
git commit -m "feat: update services with pricing, popular tag, and CTA buttons"
```

---

### Task 10: Update Stats Banner

**Files:**
- Modify: `components/landing-page/stats-banner.tsx`

**Interfaces:**
- Consumes: `STATS` from `data.ts`

- [ ] **Step 1: Read current stats-banner.tsx**

Read `components/landing-page/stats-banner.tsx`.

- [ ] **Step 2: Add contextual line above stats**

Before the stats grid, add:

```tsx
<p className="text-white/70 text-sm text-center mb-6">
  Join hundreds of patients who already got their answers
</p>
```

- [ ] **Step 3: Add CTA button below stats**

After the stats grid, add:

```tsx
<div className="text-center mt-8">
  <button className="border border-white text-white rounded-xl px-8 py-3 font-medium hover:bg-white/10 transition-colors">
    Start Your Case →
  </button>
</div>
```

- [ ] **Step 4: Verify visually**

Run: `npm run dev` and check:
- Context line above stats
- CTA button below stats on navy background

- [ ] **Step 5: Commit**

```bash
git add components/landing-page/stats-banner.tsx
git commit -m "feat: add context line and CTA to stats banner"
```

---

### Task 11: Create Trust Checklist Component

**Files:**
- Create: `components/landing-page/trust-checklist.tsx`
- Test: `__tests__/components/landing-trust-checklist.test.tsx`

**Interfaces:**
- Produces: `<TrustChecklist />` component (server component, no props)

- [ ] **Step 1: Create trust-checklist.tsx**

```tsx
import { CheckCircle2 } from "lucide-react";

const CHECKLIST_ITEMS = [
  "Encrypted uploads",
  "Board-certified only",
  "No hidden fees",
  "24-48h guarantee",
  "Peer review available",
];

export function TrustChecklist() {
  return (
    <div className="space-y-3">
      {CHECKLIST_ITEMS.map((item, i) => (
        <div key={i} className="flex items-center gap-3 text-sm text-on-surface-variant">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          {item}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Write test for TrustChecklist**

```tsx
import { render, screen } from "@testing-library/react";
import { TrustChecklist } from "@/components/landing-page/trust-checklist";

describe("TrustChecklist", () => {
  it("renders all five checklist items", () => {
    render(<TrustChecklist />);
    expect(screen.getByText("Encrypted uploads")).toBeInTheDocument();
    expect(screen.getByText("Board-certified only")).toBeInTheDocument();
    expect(screen.getByText("No hidden fees")).toBeInTheDocument();
    expect(screen.getByText("24-48h guarantee")).toBeInTheDocument();
    expect(screen.getByText("Peer review available")).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run test**

Run: `npx vitest run __tests__/components/landing-trust-checklist.test.tsx`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add components/landing-page/trust-checklist.tsx __tests__/components/landing-trust-checklist.test.tsx
git commit -m "feat: add trust checklist component"
```

---

### Task 12: Update Trust Section

**Files:**
- Modify: `components/landing-page/trust-section.tsx`

**Interfaces:**
- Consumes: `TRUST_POINTS` from `data.ts` (objection-based from Task 1), `<TrustChecklist />` from Task 11

- [ ] **Step 1: Read current trust-section.tsx**

Read `components/landing-page/trust-section.tsx`.

- [ ] **Step 2: Replace section headline and subheadline**

Replace headline with: "Your data. Your control."
Replace subheadline with: "We built Dr. Bubal Care with privacy and security as the foundation — not an afterthought."

- [ ] **Step 3: Update trust point rendering**

The `TRUST_POINTS` type changed from `{ title, description, icon }` to `{ question, answer, icon }`. Update the component to use `point.question` instead of `point.title` and `point.answer` instead of `point.description`.

Style `point.question` as: `font-headline-md text-sm font-semibold text-clinical-navy`.
Style `point.answer` as: `font-body-md text-xs text-on-surface-variant`.

- [ ] **Step 4: Replace placeholder image with TrustChecklist**

Import `TrustChecklist` from `./trust-checklist`. Replace the right-column gradient placeholder with:

```tsx
<div className="flex items-center justify-center">
  <TrustChecklist />
</div>
```

- [ ] **Step 5: Verify visually**

Run: `npm run dev` and check:
- Objection-based questions as trust point titles
- Green checkmark checklist on the right
- No gradient placeholder

- [ ] **Step 6: Commit**

```bash
git add components/landing-page/trust-section.tsx
git commit -m "feat: update trust section with objection-based copy and checklist"
```

---

### Task 13: Update CTA Section

**Files:**
- Modify: `components/landing-page/cta-section.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Produces: Updated CTA with urgency headline, micro-trust line, animated gradient

- [ ] **Step 1: Read current cta-section.tsx**

Read `components/landing-page/cta-section.tsx`.

- [ ] **Step 2: Replace headline and subheadline**

Replace headline with: "Don't wait for answers"
Replace subheadline with: "Your specialist opinion is 24-48 hours away. Upload your records now and get the clarity you deserve."

- [ ] **Step 3: Update primary CTA button**

Change text to: "Start Your Case Now →"
Add: `shadow-lg hover:shadow-xl transition-shadow`

- [ ] **Step 4: Add secondary CTA**

Add a "Questions? Chat with us" link below the primary button with a `MessageCircle` icon from lucide-react. Style: `text-healing-teal font-medium`.

- [ ] **Step 5: Add micro-trust line**

Below the buttons, add:

```tsx
<p className="text-xs text-on-surface-variant/70 mt-4">
  ✓ No credit card required · ✓ Cancel anytime · ✓ 100% confidential
</p>
```

- [ ] **Step 6: Add animated gradient background**

In `app/globals.css`, add:

```css
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient-shift 20s ease infinite;
}
```

Apply `animate-gradient` to the section background element in `cta-section.tsx`.

- [ ] **Step 7: Verify visually**

Run: `npm run dev` and check:
- Urgency headline
- "Start Your Case Now →" button
- "Questions? Chat with us" link
- Micro-trust line below
- Subtle animated gradient background

- [ ] **Step 8: Commit**

```bash
git add components/landing-page/cta-section.tsx app/globals.css
git commit -m "feat: update CTA section with urgency headline and animated gradient"
```

---

### Task 14: Create Mini FAQ Component

**Files:**
- Create: `components/landing-page/mini-faq.tsx`
- Test: `__tests__/components/landing-mini-faq.test.tsx`

**Interfaces:**
- Consumes: `FAQ` from `data.ts` (Task 1)
- Produces: `<MiniFaq />` component

- [ ] **Step 1: Create mini-faq.tsx**

```tsx
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQ } from "./data";

export function MiniFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {FAQ.map((item, i) => (
        <div
          key={i}
          className="border border-surface-gray rounded-xl overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between p-4 text-left"
          >
            <span className="font-headline-md text-sm font-semibold text-clinical-navy">
              {item.question}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-on-surface-variant transition-transform duration-200 ${
                openIndex === i ? "rotate-180" : ""
              }`}
            />
          </button>
          {openIndex === i && (
            <div className="px-4 pb-4">
              <p className="font-body-md text-sm text-on-surface-variant">
                {item.answer}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Write test for MiniFaq**

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { MiniFaq } from "@/components/landing-page/mini-faq";

describe("MiniFaq", () => {
  it("renders all FAQ questions", () => {
    render(<MiniFaq />);
    expect(screen.getByText("How much does it cost?")).toBeInTheDocument();
    expect(screen.getByText("What files can I upload?")).toBeInTheDocument();
    expect(screen.getByText("Is this available in my country?")).toBeInTheDocument();
  });

  it("expands answer on click", () => {
    render(<MiniFaq />);
    fireEvent.click(screen.getByText("How much does it cost?"));
    expect(screen.getByText(/Pricing varies by service/)).toBeInTheDocument();
  });

  it("collapses answer on second click", () => {
    render(<MiniFaq />);
    const button = screen.getByText("How much does it cost?");
    fireEvent.click(button);
    fireEvent.click(button);
    expect(screen.queryByText(/Pricing varies by service/)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run test**

Run: `npx vitest run __tests__/components/landing-mini-faq.test.tsx`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add components/landing-page/mini-faq.tsx __tests__/components/landing-mini-faq.test.tsx
git commit -m "feat: add mini FAQ accordion component"
```

---

### Task 15: Update Contact Section

**Files:**
- Modify: `components/landing-page/contact-section.tsx`

**Interfaces:**
- Consumes: `<MiniFaq />` from Task 14

- [ ] **Step 1: Read current contact-section.tsx**

Read `components/landing-page/contact-section.tsx`.

- [ ] **Step 2: Import and add MiniFaq to left column**

Import `MiniFaq` from `./mini-faq`. In the left column, add the MiniFaq component above the contact details:

```tsx
<div className="space-y-8">
  <MiniFaq />
  {/* Keep existing contact info (Mail, Phone, MapPin) below */}
</div>
```

- [ ] **Step 3: Remove Subject field from form**

Remove the Subject input field from the form. Keep Name, Email, and Message (textarea).

- [ ] **Step 4: Add response time note**

Below the submit button, add:

```tsx
<p className="text-xs text-on-surface-variant/70 mt-3 text-center">
  Typically responds within 4 hours
</p>
```

- [ ] **Step 5: Verify visually**

Run: `npm run dev` and check:
- FAQ accordion on the left
- Contact info below FAQ
- Form has 3 fields (no Subject)
- Response time note below submit

- [ ] **Step 6: Commit**

```bash
git add components/landing-page/contact-section.tsx
git commit -m "feat: update contact section with FAQ and simplified form"
```

---

### Task 16: Update Landing Page Composition

**Files:**
- Modify: The page file that composes all landing page sections (likely `app/page.tsx` or a landing page component)

**Interfaces:**
- Consumes: All updated and new components

- [ ] **Step 1: Find the landing page composition file**

Grep for imports of `hero-section` or `navigation` to find where all landing page sections are composed.

- [ ] **Step 2: Add SocialProofSection import**

Import `SocialProofSection` from `@/components/landing-page/social-proof-section`.

- [ ] **Step 3: Add SocialProofSection to page flow**

Place `<SocialProofSection />` between the How It Works section and the Specializations section, matching the page flow order from the spec.

- [ ] **Step 4: Verify full page flow**

Run: `npm run dev` and scroll through the entire page. Verify the order:
1. Trust Bar
2. Navigation
3. Hero (problem-led)
4. Problem Section (emotional)
5. How It Works (3 steps)
6. Social Proof (testimonials)
7. Specializations (6 featured)
8. Services (with pricing)
9. Stats Banner (with context)
10. Trust Section (objection-based)
11. CTA Section (urgency)
12. Contact Section (with FAQ)

- [ ] **Step 5: Commit**

```bash
git add <page-file>
git commit -m "feat: compose landing page with new section order"
```

---

### Task 17: Remove medical-illustration.tsx

**Files:**
- Delete: `components/landing-page/medical-illustration.tsx`

- [ ] **Step 1: Verify it's not imported anywhere**

Grep for `medical-illustration` across the codebase. Expected: no imports found (it's unused).

- [ ] **Step 2: Delete the file**

```bash
rm components/landing-page/medical-illustration.tsx
```

- [ ] **Step 3: Verify build still passes**

Run: `npm run build`
Expected: No errors related to missing component

- [ ] **Step 4: Commit**

```bash
git add -A components/landing-page/medical-illustration.tsx
git commit -m "feat: remove unused medical illustration component"
```

---

### Task 18: Run All Tests and Verify

**Files:**
- No new files

- [ ] **Step 1: Run all landing page component tests**

Run: `npx vitest run __tests__/components/landing-`
Expected: All 4 test files pass (trust-bar, social-proof, trust-checklist, mini-faq)

- [ ] **Step 2: Run full test suite**

Run: `npx vitest run`
Expected: All tests pass (no regressions)

- [ ] **Step 3: Run build**

Run: `npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 4: Visual verification**

Run: `npm run dev` and manually verify:
- All 12 sections render correctly
- Responsive behavior on mobile/tablet/desktop
- All animations work (scroll triggers, hover effects, pulse, bounce)
- Trust bar visible on desktop, hidden on mobile
- Navigation positioned correctly below trust bar
- All CTAs are clickable and styled correctly

- [ ] **Step 5: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: landing page redesign polish and test fixes"
```
