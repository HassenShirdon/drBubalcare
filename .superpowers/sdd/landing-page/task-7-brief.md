# Task 7: Services Section — Brief

**Files:** `components/landing-page/services-section.tsx` (new)
**Depends on:** Task 1 (SERVICES data from `components/landing-page/data.ts`)

## Spec
- Import SERVICES from `@/components/landing-page/data`
- Section id: `services`
- Section header: "Our services" + subline "Evidence-based pathways designed for clarity and better outcomes."
  - Headline: `font-headline-lg text-2xl md:text-3xl lg:text-4xl font-semibold text-text-medical-black text-balance`
  - Subline: `font-body-lg text-base text-on-surface-variant/80`
- Container: `text-center max-w-3xl mx-auto space-y-3`
- 4 cards in 2x2 grid
  - Grid: `grid grid-cols-1 md:grid-cols-2 gap-6`
- Each card:
  - Container: `bg-white rounded-2xl p-6 border border-surface-gray/60 shadow hover:shadow-md transition-all duration-300 group flex flex-col h-full`
  - Icon: `w-10 h-10 rounded-lg bg-evidence-blue-light flex items-center justify-center text-clinical-navy mb-4 group-hover:bg-clinical-navy group-hover:text-white transition-colors duration-300`
  - Title: `font-headline-md text-base font-semibold text-clinical-navy mb-2 group-hover:text-healing-teal transition-colors duration-300`
  - Description: `font-body-md text-sm text-on-surface-variant/80 mb-5 flex-grow`
  - Link: "Learn More →" — `inline-flex items-center text-clinical-navy font-medium text-sm mt-auto group-hover:text-healing-teal transition-colors`
    - ArrowRight icon: `ml-1 size-4 transform group-hover:translate-x-1 transition-transform`
    - Link href: `#` (placeholder — directory doesn't exist yet)
- Section wrapper: `py-16 bg-surface border-b border-surface-gray/50`
- Content container: `max-w-7xl mx-auto px-6 md:px-16 space-y-10`
- Uses `motion.section` with `fadeInUp` animation variant
- Use `'use client'` directive (for motion)
