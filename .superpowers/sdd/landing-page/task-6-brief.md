# Task 6: Specializations Section — Brief

**Files:** `components/landing-page/specializations-section.tsx` (new)
**Depends on:** Task 1 (SPECIALIZATIONS data from `components/landing-page/data.ts`)

## Spec
- Import SPECIALIZATIONS from `@/components/landing-page/data`
- Section id: `specializations`
- Section header: "Specialist areas we cover" + subline "Board-certified specialists across 10 medical disciplines."
  - Headline: `font-headline-lg text-2xl md:text-3xl lg:text-4xl font-semibold text-text-medical-black text-balance`
  - Subline: `font-body-lg text-base text-on-surface-variant/80`
- Container: `text-center max-w-3xl mx-auto space-y-3`
- 2x5 grid on desktop, 2-col tablet, 1-col mobile
  - Grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4`
- Each card:
  - Container: `bg-white rounded-2xl p-4 border border-surface-gray/60 shadow hover:shadow-md transition-all duration-300 text-center`
  - Icon: Alternate between `clinical-navy` and `healing-teal` circle backgrounds
    - Even index (0,2,4,6,8): `bg-clinical-navy/10 text-clinical-navy`
    - Odd index (1,3,5,7,9): `bg-healing-teal/10 text-healing-teal`
    - Circle: `w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3`
  - Title: `font-headline-md text-sm font-semibold text-clinical-navy mb-1`
  - Description: `font-body-md text-xs text-on-surface-variant/80 leading-relaxed`
- Cards are informational only (no links)
- Section wrapper: `py-16 bg-white border-y border-surface-gray/50`
- Content container: `max-w-7xl mx-auto px-6 md:px-16 space-y-10`
- Uses `motion.section` with staggered fade-in animation
- Use `'use client'` directive (for motion)
