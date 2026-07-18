# Task 10: CTA Section — Brief

**Files:** `components/landing-page/cta-section.tsx` (new)
**Depends on:** None

## Spec
- Centered text, max-w-2xl
- Headline: "Ready to understand your results?"
  - Styling: `font-headline-lg text-2xl md:text-3xl font-semibold text-text-medical-black text-balance`
- Subline: "Upload your records today. A board-certified specialist will review your case and deliver clear answers."
  - Styling: `font-body-lg text-sm text-on-surface-variant/80 max-w-xl mx-auto`
- Primary CTA: "Start a Case →" → `/patient`
  - Styling: `bg-clinical-navy text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-primary-container transition-all shadow-sm`
- Secondary: "Contact Us" → `#contact` (ghost)
  - Styling: `border border-clinical-navy/20 text-clinical-navy text-sm font-medium px-6 py-2.5 rounded-xl hover:bg-evidence-blue-light transition-all`
- Background: gradient `surface` → `evidence-blue-light/20`
  - Container: `py-16 bg-gradient-to-b from-white to-evidence-blue-light/20 border-y border-surface-gray/50`
- Content container: `max-w-7xl mx-auto px-6 md:px-16 text-center space-y-5`
- CTA container: `flex justify-center gap-3 pt-1 flex-wrap`
