# Task 8: Trust Section — Brief

**Files:** `components/landing-page/trust-section.tsx` (new)
**Depends on:** Task 1 (TRUST_POINTS data from `components/landing-page/data.ts`)

## Spec
- Import TRUST_POINTS from `@/components/landing-page/data`
- Section id: `about`
- 2-column layout: text+list left, decorative right
  - Grid: `grid grid-cols-1 lg:grid-cols-2 gap-10 items-center`
- Left column:
  - Headline: "Why patients trust Dr. Bubal Care"
    - Styling: `font-headline-lg text-2xl md:text-3xl lg:text-4xl font-semibold text-text-medical-black leading-tight text-balance`
  - Description: "We don't replace your doctor. We help you understand your results — clearly, quickly, and securely."
    - Styling: `font-body-lg text-sm text-on-surface-variant leading-relaxed`
  - Trust points (4):
    - Each point:
      - Icon container: `flex-shrink-0 w-8 h-8 rounded-lg bg-surface-container-low border border-surface-gray flex items-center justify-center text-healing-teal mt-0.5`
      - Title: `font-headline-md text-sm font-semibold text-clinical-navy mb-0.5`
      - Description: `font-body-md text-xs text-on-surface-variant leading-relaxed`
      - Layout: `flex items-start space-x-3`
    - Container: `space-y-4 pt-4 border-t border-surface-gray/50`
- Right column:
  - Decorative gradient circle: `relative rounded-2xl overflow-hidden aspect-square border border-surface-gray/50`
  - Inner: `w-full h-full bg-gradient-to-br from-clinical-navy/10 to-healing-teal/10 rounded-2xl`
  - Or a simpler approach: just a large gradient circle with CSS
- Section wrapper: `py-16 bg-white border-y border-surface-gray/50`
- Content container: `max-w-7xl mx-auto px-6 md:px-16`
- Uses `motion.section` with `fadeInUp` animation variant
- Use `'use client'` directive (for motion)
