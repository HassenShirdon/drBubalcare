# Hero Section Redesign

**Date:** 2026-07-19
**File:** `components/landing-page/hero-section.tsx`

---

## Goal

Simplify the hero section by removing the badge pill and condensing the paragraph text, maintaining a clean visual hierarchy with balanced font sizes.

---

## Changes

### Remove badge

Delete the `div` containing the "AI-Assisted Specialist Care" badge pill (lines 28-31 in the current file). No replacement — the hero flows directly from headline to paragraph.

### Condense paragraph

**Before (3 sentences):**
"Connect with board-certified specialists from leading hospitals — for lab reviews, second opinions, and consultations. Upload your records, get matched, and receive clear answers. All from your phone, with minimum effort."

**After (2 sentences):**
"Connect with board-certified specialists for lab reviews, second opinions, and consultations. Clear answers, from your phone."

### Adjust spacing

Change container `space-y-5` to `space-y-6` for slightly more breathing room between headline, paragraph, and CTAs.

### Typography (unchanged)

| Element | Size | Font |
|---------|------|------|
| Headline | `text-4xl md:text-5xl` | `font-headline-md` (Manrope), semibold |
| Paragraph | `text-base md:text-lg` | `font-body-lg` (Inter) |
| CTAs | `text-sm` | `font-medium` |

### Everything else unchanged

- Gradient background (`bg-gradient-to-b from-surface to-evidence-blue-light/20`)
- Decorative blur circle (`bg-healing-teal/5 blur-3xl`)
- Framer Motion `fadeInUp` animation
- Responsive padding (`px-6 md:px-16`)
- CTA button styles and link targets

---

## Accessibility

- Headline uses `<h1>` — no change
- CTA primary uses `<Link>` (renders `<a>`) — accessible
- CTA secondary uses `<a href="#how-it-works">` — accessible
- Decorative blur circle has `-z-10`, no interaction — acceptable
- No icon-only buttons, no ARIA issues from this change
- `text-balance` on headline — improves readability

---

## Web Interface Guidelines compliance

- `text-wrap: balance` on heading — prevents widows ✓
- Interactive elements use semantic `<a>`/`<Link>` ✓
- Hover states present on both CTAs ✓
- No `outline: none` without replacement ✓
- No `transition: all` — Tailwind handles specific properties ✓

---

## Testing

- Visual: hero renders correctly on mobile (`<640px`), tablet (`768px+`), and desktop (`1024px+`)
- Text: paragraph is 2 sentences, no badge visible
- Spacing: vertical rhythm feels balanced between headline, paragraph, and buttons
- Links: "Start a Case" navigates to `/patient`, "How It Works" scrolls to `#how-it-works`
