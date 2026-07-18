# Landing Page Redesign — Design Doc

**Date:** 2026-07-18
**Status:** Approved
**Approach:** Storytelling-first (Approach A)
**Primary audience:** Patients in East Africa
**Tone:** Warm, accessible, demystifying specialist care

---

## Design Principles

1. **Patient-first language** — No jargon. Write as if explaining to a family member.
2. **Problem → Solution flow** — Educate before asking for action.
3. **Warmth over clinical coldness** — Rounded shapes, soft gradients, friendly copy.
4. **Credibility without intimidation** — Board-certified specialists feel approachable, not distant.
5. **Mobile-first** — East African patients primarily access via mobile.

---

## Color & Typography

| Token | Value | Usage |
|-------|-------|-------|
| `clinical-navy` | #1D4ED8 | Primary CTAs, headlines, links |
| `healing-teal` | #00A3AD | Accent, secondary highlights, success states |
| `evidence-blue-light` | #DBEAFE | Badge backgrounds, subtle section tints |
| `surface-gray` | #F1F5F9 | Card borders, dividers, subtle backgrounds |
| `text-medical-black` | #0F172A | Body text headings |
| `on-surface-variant` | #42474f | Body text, descriptions |
| `surface` | #ffffff | Page background |
| Manrope | --font-headline-lg/md | All headlines |
| Inter | --font-body-lg/md, --font-label-md | Body text, labels, buttons |

---

## Section-by-Section Design

### 1. Navigation

**Behavior:** Transparent over hero → solid white with shadow on scroll.
**Layout:** Logo left, nav links center, "Start a Case" CTA button right.

- Logo: "Dr Bubal Care" in Manrope semibold
- Links: How It Works, Specializations, Services, About, Contact
- CTA: `clinical-navy` bg, white text, rounded-xl, small size
- Mobile: Hamburger menu (Sheet component), full-width links, CTA at bottom

### 2. Hero Section

**Layout:** Centered text, max-w-3xl, generous vertical padding (pt-40 pb-20).
**Background:** Subtle gradient from `surface` to `evidence-blue-light/20` at bottom.

```
Badge:  "AI-Assisted Specialist Care" (pill, teal accent dot, blue-light bg)
Headline: "Your lab results are in.\nNow what?"
          (Manrope, 4xl → 5xl on md, semibold, tracking-tight)
Subline:  "You shouldn't have to travel across the country — or the continent —
           to understand what your results mean. Dr. Bubal Care connects you
           with board-certified specialists who review your case and deliver
           clear, plain-language answers. From your phone."
          (Inter, base →-lg on md, on-surface-variant/80)
CTA:      "Start a Case →" (clinical-navy bg, white text, rounded-xl, py-3 px-6)
Secondary: "How It Works ↓" (ghost link, smooth scroll)
```

**Visual treatment:** No stock photo. Clean text-focused hero with a subtle decorative element — a soft teal/navy gradient blob or abstract medical pattern in the background (CSS only, no image). This keeps the page fast and avoids generic stock photo feel.

### 3. The Problem Section

**Layout:** 3-column grid on desktop, stacked on mobile. Section padding py-16.
**Background:** White with top/bottom border (`surface-gray/50`).

```
Section header:
  Headline: "The gap between test and answer"
  Subline:  "In East Africa, getting a specialist opinion shouldn't require
             a plane ticket."

Cards (3):
  Card 1 — "Specialist Shortage"
    Stat: "1 specialist per 100,000+ people"
    Description: "Most hospitals in the region don't have a single
                  board-certified pathologist or radiologist on staff."

  Card 2 — "Travel Burden"
    Stat: "Avg. 6-8 hours travel"
    Description: "Patients and their families travel for hours — sometimes
                  across borders — just to get a second opinion."

  Card 3 — "Delayed Answers"
    Stat: "Weeks to months wait"
    Description: "By the time results reach a specialist, critical time
                  has been lost. Early detection shouldn't be a luxury."

Card style: White bg, rounded-2xl, border surface-gray/60, p-6.
  Stat: Manrope, 2xl font-bold, clinical-navy color
  Description: Inter,-sm, on-surface-variant/80
  Icon: Lucide icon in a teal-light circle above the stat
```

**Icons:** Users (specialist shortage), Car/Plane (travel burden), Clock (delayed answers)

### 4. How It Works

**Layout:** 4-step horizontal flow with connecting line. Section padding py-16.
**Background:** `surface` (light gray tint) with bottom border.

```
Section header:
  Headline: "How it works"
  Subline:  "From upload to answer in four simple steps."

Steps (4, horizontal on md+):
  Step 1:
    Number: "01" (in clinical-navy circle, 10x10)
    Title: "Upload your records"
    Description: "Lab reports, scans, slides — upload anything.
                  Takes under 5 minutes."

  Step 2:
    Number: "02"
    Title: "AI matches your specialist"
    Description: "Our system reviews your case and routes it to
                  the right board-certified specialist."

  Step 3:
    Number: "03"
    Title: "Specialist reviews"
    Description: "A qualified specialist reviews your materials
                  alongside an AI pre-screen. Target: 24-48 hours."

  Step 4:
    Number: "04"
    Title: "Clear answers delivered"
    Description: "You receive a structured report with a
                  plain-language summary. No jargon."
```

**Visual treatment:** Same as current (numbered circles with connecting line) — this works well. Keep it.

### 5. Specializations Section

**Layout:** 2x5 grid on desktop, 2-column on tablet, 1-column on mobile. Section padding py-16.
**Background:** White with top/bottom border.

```
Section header:
  Headline: "Specialist areas we cover"
  Subline:  "Board-certified specialists across 10 medical disciplines."

Specialization Cards (10):
  Each card:
    - Icon (Lucide, in a colored circle — alternate clinical-navy and healing-teal backgrounds)
    - Title (Manrope, sm font-semibold)
    - Brief description (Inter, xs, on-surface-variant)
    - Hover: subtle shadow increase, icon circle bg changes

  Specializations:
    1. Hematopathology — "Blood disorders, leukemia, lymphoma diagnosis"
       Icon: Droplets
    2. Clinical Pathology — "Lab medicine, biochemical analysis, diagnostics"
       Icon: FlaskConical
    3. Diagnostic Radiology — "X-ray, CT, MRI interpretation"
       Icon: ScanLine
    4. Fetal Medicine — "Prenatal screening, fetal anomaly assessment"
       Icon: Baby
    5. Cytopathology — "Cell-level analysis, fine needle aspirates"
       Icon: Microscope
    6. Dermatopathology — "Skin biopsy analysis, melanoma screening"
       Icon: Sun
    7. Women's Health — "Gynecological pathology, fertility-related diagnostics"
       Icon: Heart
    8. Pediatrics — "Childhood disease diagnostics, neonatal screening"
       Icon: Child
    9. Oncology — "Cancer staging, tumor classification, treatment monitoring"
       Icon: Ribbon
    10. Chronic Disease — "Diabetes, hypertension, long-term monitoring"
       Icon: Activity
```

**Card style:** Compact cards — icon + title + 1-line description. No CTA per card. These are informational, not clickable (directory doesn't exist yet).

### 6. Services Section

**Layout:** 2x2 grid on desktop, stacked on mobile. Section padding py-16.
**Background:** `surface` (light gray tint) with bottom border.

```
Section header:
  Headline: "Our services"
  Subline:  "Evidence-based pathways designed for clarity and better outcomes."

Service Cards (4):
  Each card:
    - Icon (Lucide, in clinical-navy circle)
    - Title (Manrope, base font-semibold)
    - Description (Inter, sm, on-surface-variant/80)
    - "Learn More →" link (clinical-navy, hover teal)

  Services:
    1. Specialist Opinions
       "Submit your records — slides, scans, or lab reports — and receive
        a written opinion from a board-certified specialist within 24-48 hours."
       Icon: FileText

    2. Result Interpretation
       "Already have test results but don't understand them? Get a clear,
        plain-language explanation from a qualified specialist."
       Icon: ClipboardList

    3. Follow-up Consultations
       "After receiving your report, ask questions. Our AI answers within
        the scope of the opinion, or book a live consultation."
       Icon: MessageSquareText

    4. Lab Trend Tracking
       "Repeat lab tests tracked over time. AI flags statistically
        significant changes — an early warning for you and your doctor."
       Icon: TrendingUp
```

**Card style:** Same white bg, rounded-2xl, border, shadow pattern. Consistent with specializations but slightly larger (more description text).

### 7. Why Dr. Bubal Care (Trust Section)

**Layout:** 2-column — left side text + list, right side visual (decorative, not stock photo). Section padding py-16.
**Background:** White with top border.

```
Left column:
  Headline: "Why patients trust Dr. Bubal Care"
  Description: "We don't replace your doctor. We help you understand
                your results — clearly, quickly, and securely."

  Trust points (4, icon + text):
    1. BadgeCheck icon — "Board-certified specialists only"
       "Every specialist is verified. No exceptions."

    2. Shield icon — "Your data stays private"
       "HIPAA and GDPR compliant. Files encrypted. AI never sees your name."

    3. MessageSquareText icon — "Plain-language reports"
       "No medical jargon. Your report is written as if by a trusted GP."

    4. Clock icon — "24-48 hour turnaround"
       "Most cases reviewed within 2 days. Urgent cases get priority."

Right column:
  Decorative: A large, soft gradient circle (clinical-navy/10 → healing-teal/10)
  with an abstract pattern or a simple SVG medical illustration (stethoscope,
  DNA helix, or heartbeat line). NO stock photos.
```

### 8. Stats Banner

**Layout:** 4-column grid, single row. Section padding py-12.
**Background:** `clinical-navy` with white text. Rounded-2xl, mx-6 md:mx-16.

```
Stats:
  "10+" — "Specialist Disciplines"
  "24-48h" — "Average Turnaround"
  "Encrypted" — "Data Security"
  "East Africa" — "Primary Coverage"
```

**Style:** All text white. Numbers in Manrope 2xl bold. Labels in Inter xs uppercase tracking-wider. Dividers between columns (white/20).

### 9. CTA Section

**Layout:** Centered text, max-w-2xl, py-16.
**Background:** Gradient from `surface` to `evidence-blue-light/20`.

```
Headline: "Ready to understand your results?"
Subline:  "Upload your records today. A board-certified specialist
           will review your case and deliver clear answers."
CTA:      "Start a Case →" (clinical-navy bg, white text, rounded-xl, py-3 px-8)
Secondary: "Contact Us" (ghost, clinical-navy text)
```

### 10. Contact Section

**Layout:** 2-column — left side contact info, right side form. Section padding py-16.
**Background:** White with top border.

**Keep existing structure** — email, phone, location (Ghent, Belgium), contact form.
Update phone to reflect real number if available.

### 11. Footer

**Keep existing structure** — 3-column grid, logo, nav links, legal links, copyright.

---

## Component Structure

```
app/page.tsx (orchestrator)
├── components/landing-page/
│   ├── navigation.tsx          ← extracted from page.tsx
│   ├── hero-section.tsx        ← NEW (problem headline, empathetic copy)
│   ├── problem-section.tsx     ← NEW (3 stat cards)
│   ├── how-it-works.tsx        ← refactored from current step section
│   ├── specializations-section.tsx  ← NEW (10 cards)
│   ├── services-section.tsx    ← refactored (4 services, not 3)
│   ├── trust-section.tsx       ← NEW (why Dr. Bubal Care)
│   ├── stats-banner.tsx        ← refactored (navy bg)
│   ├── cta-section.tsx         ← NEW (warm CTA)
│   └── contact-section.tsx     ← extracted from page.tsx
├── components/latest-news-client.tsx  ← keep as-is
└── footer (inline or extracted)
```

---

## What Changes vs. Current

| Section | Current | New |
|---------|---------|-----|
| Hero | "Global Medical Coordination, Precision Delivered" (clinical) | "Your lab results are in. Now what?" (warm, patient-first) |
| Problem | Does not exist | NEW — 3 stat cards explaining the gap |
| How It Works | 4 steps, generic | 4 steps, patient-focused language |
| Specializations | Does not exist | NEW — 10 medical disciplines |
| Services | 3 services + 1 featured | 4 core services (from AGENTS.md) |
| Trust | Embedded in About section | NEW — dedicated section with 4 trust points |
| About | "Advancing Global Health Through Evidence" (stock photo) | Replaced by Problem + Trust sections |
| Doctors | 3 stock photo cards with modal | REMOVED (no real doctor photos yet; add back when available) |
| Stats | "15+ years, 50k patients, 120 specialists, 98% accuracy" | Updated to realistic: "10+ disciplines, 24-48h turnaround, Encrypted, East Africa" |
| CTA | "Ready to begin your clinical journey?" | "Ready to understand your results?" |
| Contact | Kept | Kept, minor copy updates |
| Footer | Kept | Kept |

---

## Animations

- All sections use existing `fadeInUp` variant with `whileInView` (viewport once)
- Stats numbers: Consider counting animation (react-countup or custom) — nice-to-have, not required
- Specialization cards: Staggered fade-in on scroll (delay by index * 0.05s)
- No heavy animations — keep performance high on mobile

---

## Decisions

- Specializations: 10 as listed (minor tweaks during implementation)
- Doctors section: Removed (add back when real photos exist)
- Stats: Realistic values as listed
- Contact: Keep current values
