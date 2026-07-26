# Task 6: Update How It Works — Report

**Status:** Complete

**Commit:** `8a6006f` — `feat: reduce how-it-works to 3 steps with teal circles`

## Changes Made

**File:** `components/landing-page/how-it-works.tsx`

1. **Headline** — Changed from "How it works" to "Get answers in 3 simple steps"
2. **Subheadline** — Changed from "From first contact to specialist answers — we handle the coordination." to "No travel. No waiting rooms. Just upload, relax, and get specialist answers."
3. **Grid** — Changed from `md:grid-cols-4` to `md:grid-cols-3`
4. **Connecting line** — Changed from solid `h-px bg-clinical-navy/10` to `border-t-2 border-dashed border-clinical-navy/20`
5. **Step circles** — Changed from `bg-evidence-blue-light text-clinical-navy` to `bg-healing-teal text-white`
6. **CTA button** — Added below the steps grid: "Start Your Case Now →" with `bg-clinical-navy` styling and shadow hover effect

## Verification

- STEPS data already contained 3 items (from Task 1)
- File compiles as JSX — no TypeScript changes needed
- No tests to run for this component (no test file exists for how-it-works)

## Report

Path: `.superpowers/sdd/task-6-report.md`
