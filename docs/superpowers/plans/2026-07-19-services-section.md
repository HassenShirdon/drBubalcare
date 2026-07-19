# Services Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the Services Section component for the Dr. Bubal Care landing page, displaying 4 core services in a 2x2 grid with hover effects and animations.

**Architecture:** Single React component using motion/react for animations, Tailwind CSS v4 for styling, and Lucide React for icons. Imports service data from existing data.ts file.

**Tech Stack:** Next.js 15 App Router, Tailwind CSS v4, motion/react, Lucide React, TypeScript

## Global Constraints
- Must use `'use client'` directive
- Import `{ motion }` from `motion/react`
- Import `{ SERVICES }` from `@/components/landing-page/data`
- Import `{ ArrowRight }` from `lucide-react`
- Import Link from `next/link`
- Section id: `services`
- Each card renders its icon as `<service.icon />` (component)
- "Learn More" links go to `#` (placeholder)
- No comments in code

---

### Task 1: Create Services Section Component

**Files:**
- Create: `components/landing-page/services-section.tsx`

**Interfaces:**
- Consumes: `SERVICES` array from `@/components/landing-page/data`
- Produces: `ServicesSection` component (default export)

- [ ] **Step 1: Create the component file**

Create `components/landing-page/services-section.tsx` with the following structure:

```tsx
'use client'

import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { SERVICES } from '@/components/landing-page/data'

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

export default function ServicesSection() {
  return (
    <motion.section
      id="services"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.15 } },
      }}
      className="py-16 bg-surface border-b border-surface-gray/50"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-16 space-y-10">
        <motion.div
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto space-y-3"
        >
          <h2 className="font-headline-lg text-2xl md:text-3xl lg:text-4xl font-semibold text-text-medical-black text-balance">
            Our services
          </h2>
          <p className="font-body-lg text-base text-on-surface-variant/80">
            Evidence-based pathways designed for clarity and better outcomes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map((service) => (
            <motion.div
              key={service.title}
              variants={fadeInUp}
              className="bg-white rounded-2xl p-6 border border-surface-gray/60 shadow hover:shadow-md transition-all duration-300 group flex flex-col h-full"
            >
              <div className="w-10 h-10 rounded-lg bg-evidence-blue-light flex items-center justify-center text-clinical-navy mb-4 group-hover:bg-clinical-navy group-hover:text-white transition-colors duration-300">
                <service.icon className="w-5 h-5" />
              </div>
              <h3 className="font-headline-md text-base font-semibold text-clinical-navy mb-2 group-hover:text-healing-teal transition-colors duration-300">
                {service.title}
              </h3>
              <p className="font-body-md text-sm text-on-surface-variant/80 mb-5 flex-grow">
                {service.description}
              </p>
              <Link
                href="#"
                className="inline-flex items-center text-clinical-navy font-medium text-sm mt-auto group-hover:text-healing-teal transition-colors"
              >
                Learn More
                <ArrowRight className="ml-1 size-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit changes**

```bash
git add components/landing-page/services-section.tsx
git commit -m "feat(landing): add services section with 4 core services"
```

## Self-Review Checklist

1. ✅ Component uses `'use client'` directive
2. ✅ Imports `{ motion }` from `motion/react`
3. ✅ Imports `{ SERVICES }` from `@/components/landing-page/data`
4. ✅ Imports `{ ArrowRight }` from `lucide-react`
5. ✅ Imports Link from `next/link`
6. ✅ Section has id="services"
7. ✅ Each card renders icon as `<service.icon />`
8. ✅ "Learn More" links go to `#` (placeholder)
9. ✅ No comments in code
10. ✅ Follows existing patterns from problem-section.tsx
11. ✅ Uses correct Tailwind classes from task brief
12. ✅ Animation variant matches existing fadeInUp pattern
13. ✅ TypeScript compilation passes