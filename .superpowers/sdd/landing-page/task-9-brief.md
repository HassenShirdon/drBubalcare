# Task 9: Stats Banner — Brief

**Files:** `components/landing-page/stats-banner.tsx` (new)
**Depends on:** Task 1 (STATS data from `components/landing-page/data.ts`)

## Spec
- Import STATS from `@/components/landing-page/data`
- `clinical-navy` background, white text, rounded-2xl
  - Container: `bg-clinical-navy rounded-2xl p-6 md:p-8 mx-6 md:mx-16`
- 4 stats in a row
  - Grid: `grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-white/20`
- Each stat:
  - Container: `text-center px-3 pt-3 md:pt-0 first:pt-0`
  - Value: `font-headline-md text-2xl lg:text-3xl font-bold text-white mb-1`
  - Label: `font-label-md text-[11px] text-white/70 uppercase tracking-wider font-medium`
- Section wrapper: `py-16`
- No animations needed (static banner)
- Use `'use client'` only if needed (likely server component is fine)
