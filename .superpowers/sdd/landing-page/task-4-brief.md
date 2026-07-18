# Task 4: Problem Section — Brief

**Files:** `components/landing-page/problem-section.tsx` (new)
**Depends on:** None

## Spec
- Section header: "The gap between test and answer"
  - Styling: `font-headline-lg text-2xl md:text-3xl lg:text-4xl font-semibold text-text-medical-black text-balance`
- Subline: "In East Africa, getting a specialist opinion shouldn't require a plane ticket."
  - Styling: `font-body-lg text-base text-on-surface-variant/80`
- Container: `text-center max-w-3xl mx-auto space-y-3`
- 3 cards in a grid (responsive: 1→2→3 columns)
  - Grid: `grid grid-cols-1 md:grid-cols-3 gap-6`
- Each card:
  - Container: `bg-white rounded-2xl p-6 border border-surface-gray/60 shadow hover:shadow-md transition-all duration-300`
  - Icon: Lucide icon in a circle
    - Circle: `w-10 h-10 rounded-lg bg-healing-teal/10 flex items-center justify-center text-healing-teal mb-4`
  - Stat: `font-headline-md text-2xl font-bold text-clinical-navy mb-2`
  - Description: `font-body-md text-sm text-on-surface-variant/80 leading-relaxed`

### Card Data
1. Icon: Users — "Specialist Shortage" — "1 specialist per 100,000+ people" — "Most hospitals in the region don't have a single board-certified pathologist or radiologist on staff."
2. Icon: Plane — "Travel Burden" — "Avg. 6-8 hours travel" — "Patients and their families travel for hours — sometimes across borders — just to get a second opinion."
3. Icon: Clock — "Delayed Answers" — "Weeks to months wait" — "By the time results reach a specialist, critical time has been lost. Early detection shouldn't be a luxury."

- Section wrapper: `py-16 bg-white border-y border-surface-gray/50`
- Uses `motion.section` with `fadeInUp` animation variant
