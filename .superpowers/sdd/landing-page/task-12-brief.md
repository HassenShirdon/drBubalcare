# Task 12: Page Assembly — Brief

**Files:** `app/page.tsx` (rewrite)
**Depends on:** Tasks 2-11 (all section components must exist)

## Spec

Rewrite `app/page.tsx` to import and compose all landing page section components.

### Section Order
1. Navigation (`components/landing-page/navigation.tsx`)
2. Hero Section (`components/landing-page/hero-section.tsx`)
3. Problem Section (`components/landing-page/problem-section.tsx`)
4. How It Works (`components/landing-page/how-it-works.tsx`)
5. Specializations (`components/landing-page/specializations-section.tsx`)
6. Services (`components/landing-page/services-section.tsx`)
7. Trust Section (`components/landing-page/trust-section.tsx`)
8. Stats Banner (`components/landing-page/stats-banner.tsx`)
9. Latest News (`components/latest-news-client.tsx`)
10. CTA Section (`components/landing-page/cta-section.tsx`)
11. Contact Section (`components/landing-page/contact-section.tsx`)
12. Footer (inline)

### What to Remove
- DOCTORS array
- selectedDoctor state and useState import (if no longer needed)
- Doctor Quick-View Modal
- SERVICES array (moved to data.ts)
- All inline section JSX (replaced by component imports)
- Unused Lucide imports (Stethoscope, ArrowRight, BadgeCheck, BarChart3, MessageSquareText, Eye, X, Briefcase, HeartPulse, FlaskConical, FileText, Cpu, Globe, Brain, Dna, Mail, Phone, MapPin)

### What to Keep
- `'use client'` directive (needed for any client-side behavior)
- LatestNewsClient import and rendering
- Footer (inline, simple enough to keep)

### Footer Spec (keep inline)
- Background: `bg-clinical-navy`
- 3-column grid: Logo + description, Clinical Navigation links, Legal & Privacy links
- Copyright: "© 2026 Dr Bubal Care. Evidence-based medical excellence."
- Links: Home (#home), Services (#services), About (#about), Doctors (removed — change to #specializations), News (/news), Contact (#contact)
- Legal: Privacy Policy, Terms & Conditions, Patient Rights (all # placeholder)

### Page Structure
```tsx
'use client';

import Navigation from '@/components/landing-page/navigation';
import HeroSection from '@/components/landing-page/hero-section';
import ProblemSection from '@/components/landing-page/problem-section';
import HowItWorks from '@/components/landing-page/how-it-works';
import SpecializationsSection from '@/components/landing-page/specializations-section';
import ServicesSection from '@/components/landing-page/services-section';
import TrustSection from '@/components/landing-page/trust-section';
import StatsBanner from '@/components/landing-page/stats-banner';
import LatestNewsClient from '@/components/latest-news-client';
import CTASection from '@/components/landing-page/cta-section';
import ContactSection from '@/components/landing-page/contact-section';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-surface text-on-surface font-body-md antialiased pt-24 selection:bg-healing-teal/30 selection:text-clinical-navy scroll-smooth">
      <Navigation />
      <main>
        <HeroSection />
        <ProblemSection />
        <HowItWorks />
        <SpecializationsSection />
        <ServicesSection />
        <TrustSection />
        <StatsBanner />
        <LatestNewsClient />
        <CTASection />
        <ContactSection />
      </main>
      <footer>...</footer>
    </div>
  );
}
```

### Notes
- The `pt-24` on the outer div accounts for the fixed nav height
- All section components handle their own animations internally
- The footer stays inline (not extracted to a component)
- Remove the `id="home"` from the hero section wrapper (hero component handles its own structure)
