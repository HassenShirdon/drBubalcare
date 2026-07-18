# Task 3: Hero Section — Brief

**Files:** `components/landing-page/hero-section.tsx` (new)
**Depends on:** None

## Spec
- Badge: "AI-Assisted Specialist Care" — pill with teal dot, `evidence-blue-light` bg
  - Styling: `inline-flex items-center space-x-2 bg-evidence-blue-light px-3 py-1 rounded-full text-clinical-navy text-xs font-medium border border-clinical-navy/10`
  - Dot: `w-1.5 h-1.5 rounded-full bg-healing-teal`
- Headline: "Your lab results are in.\nNow what?" — Manrope, 4xl→5xl, semibold, tracking-tight
  - Styling: `font-headline-md text-4xl md:text-5xl text-text-medical-black tracking-tight font-semibold leading-tight text-balance`
- Subline: "You shouldn't have to travel across the country — or the continent — to understand what your results mean. Dr. Bubal Care connects you with board-certified specialists who review your case and deliver clear, plain-language answers. From your phone."
  - Styling: `font-body-lg text-base md:text-lg text-on-surface-variant/80 leading-relaxed max-w-xl mx-auto`
- Primary CTA: "Start a Case →" → `/patient`
  - Styling: `inline-flex items-center gap-2 bg-clinical-navy text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-primary-container transition-all shadow-sm`
- Secondary: "How It Works ↓" — ghost link, smooth scroll to `#how-it-works`
  - Styling: `text-on-surface-variant hover:text-clinical-navy transition-colors text-sm font-medium`
- Background: Subtle gradient from `surface` to `evidence-blue-light/20`
  - Container: `relative pt-32 pb-20 px-6 md:px-16 min-h-[70vh] flex items-center justify-center`
  - Gradient: CSS `background: linear-gradient(to bottom, var(--color-surface), var(--color-evidence-blue-light) 20%)` or Tailwind `bg-gradient-to-b from-surface to-evidence-blue-light/20`
- No stock photo — text-focused with decorative CSS gradient blob
  - Add a decorative circle: `absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-healing-teal/5 blur-3xl -z-10`
- Uses `motion.section` with `fadeInUp` animation variant
  - Import `{ motion }` from `motion/react`
  - Variants: `{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }`
  - Props: `variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}`
