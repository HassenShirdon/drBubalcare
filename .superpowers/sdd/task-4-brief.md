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
  Whether your lab results need interpretation or your biopsy needs a second look â€” get board-certified specialist answers in 24-48 hours, not weeks.
</p>
```

- [ ] **Step 3: Update CTA buttons**

Primary CTA: Change text to "Get Your Results Reviewed â†’". Add classes: `px-8 py-3.5 shadow-lg hover:shadow-xl`.

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


