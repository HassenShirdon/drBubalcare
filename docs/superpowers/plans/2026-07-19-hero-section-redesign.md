# Hero Section Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Simplify the hero section by removing the badge pill, condensing the paragraph, and adjusting spacing.

**Architecture:** Single-file change to `components/landing-page/hero-section.tsx`. Remove one JSX element, edit paragraph text, update one Tailwind class.

**Tech Stack:** React, Next.js, Tailwind CSS, Framer Motion

## Global Constraints

- Use existing Tailwind design tokens (no new colors/fonts)
- Maintain Framer Motion `fadeInUp` animation unchanged
- Preserve all responsive breakpoints (`md:` prefix)
- No new dependencies

---

### Task 1: Update Hero Section

**Files:**
- Modify: `components/landing-page/hero-section.tsx:27-44`

**Interfaces:**
- Consumes: None (standalone change)
- Produces: Updated `HeroSection` component with simplified content

- [ ] **Step 1: Remove the badge pill**

Remove lines 28-31 (the `div` with class `inline-flex items-center space-x-2 bg-evidence-blue-light ...` containing "AI-Assisted Specialist Care").

The `<div className="text-center max-w-2xl mx-auto space-y-5">` should now go directly into the `<h1>`.

- [ ] **Step 2: Condense the paragraph text**

Replace the current paragraph content:

```tsx
<p className="font-body-lg text-base md:text-lg text-on-surface-variant/80 leading-relaxed max-w-xl mx-auto">
  Connect with board-certified specialists from leading hospitals —
  for lab reviews, second opinions, and consultations. Upload your
  records, get matched, and receive clear answers. All from your phone,
  with minimum effort.
</p>
```

With:

```tsx
<p className="font-body-lg text-base md:text-lg text-on-surface-variant/80 leading-relaxed max-w-xl mx-auto">
  Connect with board-certified specialists for lab reviews, second
  opinions, and consultations. Clear answers, from your phone.
</p>
```

- [ ] **Step 3: Adjust vertical spacing**

Change `space-y-5` to `space-y-6` on the container div (line 27):

```tsx
<div className="text-center max-w-2xl mx-auto space-y-6">
```

- [ ] **Step 4: Verify the final file**

Read `components/landing-page/hero-section.tsx` and confirm:
- No badge pill div exists
- Paragraph is 2 sentences
- `space-y-6` is set on the text container
- All other code (animation, gradient, blur circle, CTAs) is unchanged

- [ ] **Step 5: Run linter/typecheck**

Run: `npm run lint`
Run: `npm run typecheck` (or `npx tsc --noEmit`)
Expected: No errors

- [ ] **Step 6: Commit**

```bash
git add components/landing-page/hero-section.tsx
git commit -m "style: simplify hero section — remove badge, condense copy"
```
