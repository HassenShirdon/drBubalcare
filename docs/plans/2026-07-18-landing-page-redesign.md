# Landing Page Redesign — Implementation Plan

**Design Doc:** `docs/design/landing-page-redesign.md`
**Approach:** Storytelling-first (Approach A)
**Date:** 2026-07-18

---

## Context

The current landing page (`app/page.tsx`, 574 lines) has generic clinical copy, only 3 services, stock doctor photos, and no specializations or problem/solution narrative. The redesign makes it patient-first, warm, and focused on East African patients.

All sections live in `app/page.tsx` today. This plan extracts them into a `components/landing-page/` directory and adds new sections per the approved design doc.

**Design tokens available:** `clinical-navy`, `healing-teal`, `evidence-blue-light`, `surface-gray`, `text-medical-black`, `on-surface-variant`, Manrope headlines, Inter body. Utility class `.card` = `bg-white rounded-2xl shadow border border-surface-gray`.

---

## Tasks

### Task 1: Data Constants
**Files:** `components/landing-page/data.ts` (new)
**Depends on:** None

Create a constants file exporting:
- `SPECIALIZATIONS` — 10 items: `{ title, description, icon }` (Lucide icon component names)
- `TRUST_POINTS` — 4 items: `{ title, description, icon }`
- `STATS` — 4 items: `{ value, label }`
- `STEPS` — 4 items: `{ num, title, description }`
- `SERVICES` — 4 items: `{ title, description, icon, category }`

Icons imported from `lucide-react`. All copy from design doc.

---

### Task 2: Navigation Component
**Files:** `components/landing-page/navigation.tsx` (new)
**Depends on:** None

Extract nav from current `app/page.tsx` (lines 76-117) into a standalone component.

**Spec:**
- Props: none (self-contained)
- Links: How It Works (`#how-it-works`), Specializations (`#specializations`), Services (`#services`), About (`#about`), Contact (`#contact`)
- CTA button: "Start a Case" → `/patient`
- Behavior: Fixed top, transparent initially → white bg + shadow on scroll (use `useEffect` + `scroll` listener or `IntersectionObserver`)
- Mobile: Hamburger button → Sheet component (already in `components/ui/dialog.tsx` — use as slide-over, or implement a simple mobile menu with state)
- Logo: "Dr Bubal Care" Manrope semibold

---

### Task 3: Hero Section
**Files:** `components/landing-page/hero-section.tsx` (new)
**Depends on:** None

**Spec:**
- Badge: "AI-Assisted Specialist Care" — pill with teal dot, `evidence-blue-light` bg
- Headline: "Your lab results are in.\nNow what?" — Manrope, 4xl→5xl
- Subline: Empathetic paragraph about East Africa's specialist access gap
- CTAs: "Start a Case →" (primary) + "How It Works ↓" (ghost, smooth scroll)
- Background: Subtle gradient from `surface` to `evidence-blue-light/20`
- No stock photo — text-focused with decorative CSS gradient blob
- Uses `fadeInUp` animation variant from current page

---

### Task 4: Problem Section
**Files:** `components/landing-page/problem-section.tsx` (new)
**Depends on:** Task 1 (SPECIALIZATIONS not needed — uses its own data inline or from a shared constant)

**Spec:**
- Section header: "The gap between test and answer"
- 3 cards in a grid (responsive: 1→2→3 columns)
- Each card: Lucide icon in teal circle, stat number (Manrope, 2xl, clinical-navy), description (Inter, sm)
- Data: Specialist Shortage, Travel Burden, Delayed Answers (from design doc)
- White bg, top/bottom border `surface-gray/50`

---

### Task 5: How It Works Section
**Files:** `components/landing-page/how-it-works.tsx` (new)
**Depends on:** Task 1 (STEPS data)

**Spec:**
- Refactor current step section (lines 185-209 of page.tsx)
- Section header: "How it works" + subline
- 4 numbered steps with connecting line on desktop
- Patient-friendly copy (from design doc)
- Background: `surface` tint

---

### Task 6: Specializations Section
**Files:** `components/landing-page/specializations-section.tsx` (new)
**Depends on:** Task 1 (SPECIALIZATIONS data)

**Spec:**
- Section header: "Specialist areas we cover"
- 2x5 grid on desktop, 2-col tablet, 1-col mobile
- Each card: Icon (alternating navy/teal circle bg), title, 1-line description
- Cards are informational only (no links, directory doesn't exist yet)
- Staggered fade-in animation on scroll
- White bg, top/bottom border

---

### Task 7: Services Section
**Files:** `components/landing-page/services-section.tsx` (new)
**Depends on:** Task 1 (SERVICES data)

**Spec:**
- Refactor current services section (lines 244-294 of page.tsx)
- Section header: "Our services"
- 4 cards in 2x2 grid
- Each card: Icon in navy circle, title, description, "Learn More →" link
- Background: `surface` tint
- Remove the featured Precision Medicine card (not in scope)

---

### Task 8: Trust Section
**Files:** `components/landing-page/trust-section.tsx` (new)
**Depends on:** Task 1 (TRUST_POINTS data)

**Spec:**
- 2-column layout: text+list left, decorative right
- Headline: "Why patients trust Dr. Bubal Care"
- Description paragraph
- 4 trust points: icon + title + description
- Right side: Decorative gradient circle (CSS only, no image)
- White bg, top border

---

### Task 9: Stats Banner
**Files:** `components/landing-page/stats-banner.tsx` (new)
**Depends on:** Task 1 (STATS data)

**Spec:**
- Refactor current stats (lines 347-364 of page.tsx)
- `clinical-navy` bg, white text, rounded-2xl
- 4 stats: "10+" / "Specialist Disciplines", "24-48h" / "Average Turnaround", "Encrypted" / "Data Security", "East Africa" / "Primary Coverage"
- Responsive grid, dividers between columns

---

### Task 10: CTA Section
**Files:** `components/landing-page/cta-section.tsx` (new)
**Depends on:** None

**Spec:**
- Centered text, max-w-2xl
- Headline: "Ready to understand your results?"
- Subline: Upload records today, specialist will review
- Primary CTA: "Start a Case →"
- Secondary: "Contact Us" (ghost link)
- Background: gradient `surface` → `evidence-blue-light/20`

---

### Task 11: Contact Section
**Files:** `components/landing-page/contact-section.tsx` (new)
**Depends on:** None

**Spec:**
- Extract from current page.tsx (lines 473-538)
- 2-column: contact info left, form right
- Email: care@drbubalcare.com, Phone: +1 (800) 555-1234, Location: Ghent, Belgium
- Contact form with name, email, subject, message fields
- Keep current implementation, minor copy updates

---

### Task 12: Page Assembly
**Files:** `app/page.tsx` (rewrite)
**Depends on:** Tasks 2-11

**Spec:**
- Replace all inline sections with imported components
- Section order: Nav → Hero → Problem → How It Works → Specializations → Services → Trust → Stats → Latest News → CTA → Contact → Footer
- Remove: DOCTORS array, selectedDoctor state, doctor modal, SERVICES array (moved to data.ts)
- Keep: LatestNewsClient import and rendering
- Footer: Extract or keep inline (simple enough to stay inline)
- All `fadeInUp` animations applied at section level
- `use client` directive stays (for nav scroll behavior and mobile menu)

---

## Parallelization

```
Wave 1 (start immediately — no dependencies):
├── Task 1:  Data Constants
├── Task 2:  Navigation
├── Task 3:  Hero Section
├── Task 4:  Problem Section
├── Task 10: CTA Section
└── Task 11: Contact Section

Wave 2 (depends on Task 1):
├── Task 5:  How It Works
├── Task 6:  Specializations
├── Task 7:  Services
├── Task 8:  Trust Section
└── Task 9:  Stats Banner

Wave 3 (depends on all above):
└── Task 12: Page Assembly

Final: Build verification (tsc --noEmit)
```

---

## Commit Strategy

1. `feat(landing): add data constants and extract navigation`
2. `feat(landing): add hero, problem, and how-it-works sections`
3. `feat(landing): add specializations, services, trust, stats, cta, contact sections`
4. `feat(landing): assemble redesigned landing page`

---

## Verification

1. `npx tsc --noEmit` — no type errors
2. Visual check: `pnpm dev` → visit `http://localhost:3000` → verify all sections render
3. Responsive check: Verify mobile layout (hamburger nav, stacked grids)
4. Scroll check: Verify smooth scroll to anchored sections
5. Nav scroll check: Verify nav background changes on scroll
