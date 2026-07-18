# Task 2: Navigation Component — Brief

**Files:** `components/landing-page/navigation.tsx` (new)
**Depends on:** None

Extract nav from current `app/page.tsx` (lines 76-117) into a standalone component.

## Spec
- Props: none (self-contained)
- Links: How It Works (`#how-it-works`), Specializations (`#specializations`), Services (`#services`), About (`#about`), Contact (`#contact`)
- CTA button: "Start a Case" → `/patient`
- Behavior: Fixed top, transparent initially → white bg + shadow on scroll (use `useEffect` + `scroll` listener)
- Mobile: Hamburger button → simple mobile menu with state (open/close)
- Logo: "Dr Bubal Care" Manrope semibold
- Uses `'use client'` directive
- Link styling: `font-label-md text-sm text-on-surface-variant hover:text-clinical-navy transition-colors px-3 py-2 rounded-lg hover:bg-surface-container-low`
- CTA styling: `bg-clinical-navy text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-primary-container transition-all`
- Nav styling: `bg-white border-b border-surface-gray/50 fixed top-0 w-full z-50 h-16`
- Mobile menu: Full-width dropdown with same link styles, CTA button at bottom
