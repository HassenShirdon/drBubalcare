# Task 5: How It Works Section — Brief

**Files:** `components/landing-page/how-it-works.tsx` (new)
**Depends on:** Task 1 (STEPS data from `components/landing-page/data.ts`)

## Spec
- Import STEPS from `@/components/landing-page/data`
- Section header: "How it works" + subline "From upload to answer in four simple steps."
  - Headline: `font-headline-lg text-2xl md:text-3xl lg:text-4xl font-semibold text-text-medical-black text-balance`
  - Subline: `font-body-lg text-base text-on-surface-variant/80`
- Container: `text-center max-w-3xl mx-auto space-y-3`
- 4 numbered steps with connecting line on desktop
  - Grid: `grid grid-cols-1 md:grid-cols-4 gap-6 relative`
  - Connecting line: `hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-clinical-navy/10`
- Each step:
  - Number circle: `w-10 h-10 rounded-full bg-evidence-blue-light flex items-center justify-center text-clinical-navy font-headline-md font-semibold text-sm mx-auto md:mx-0 relative z-10`
  - Title: `font-headline-md text-sm font-semibold text-clinical-navy mb-1.5`
  - Description: `font-body-md text-on-surface-variant/80 leading-relaxed text-sm`
  - Container: `relative text-center md:text-left`
- Section wrapper: `py-16 bg-surface border-b border-surface-gray/50`
- Content container: `max-w-7xl mx-auto px-6 md:px-16 space-y-10`
- Uses `motion.section` with `fadeInUp` animation variant
- Use `'use client'` directive (for motion)
