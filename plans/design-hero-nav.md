# Dr. Bubal Care — Hero & Navigation Redesign Plan

## Brief
Redesign the landing hero and navigation to match the structural composition of the attached reference image (Leafcare-style health landing), while preserving Dr. Bubal Care's existing brand colors, typography, and clinical content.

## Design Decisions

### Color Palette (derived from existing tokens)
- **Dominant surface:** `#ffffff` (white) + `#F1F5F9` (surface-gray) — owns ~70% of screen.
- **Primary blue:** `#1D4ED8` (clinical-navy) — primary CTAs, nav logo, accents.
- **Secondary accent:** `#00A3AD` (healing-teal) — outline CTA, icons, hover states.
- **Soft background wash:** `#DBEAFE` (evidence-blue-light) at low opacity — hero card background.
- **Text:** `#0F172A` (text-medical-black) for headings, `#42474F` (on-surface-variant) for body.

### Typography (existing tokens)
- **Display/Headlines:** `Manrope` (via `--font-manrope`) — semi-bold, tight tracking.
- **Body/UI:** `Inter` (via `--font-inter`) — readable, clean.
- **Scale jumps:** 16px body → 20px subheadline → 48px/56px display headline.

### Layout Structure (from reference image)
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]        Home   Services   About   Contact      [CTA] │
│                                                             │
│  ┌─────────────────────────────┐  ┌──────────────────────┐ │
│  │  Headline (2-3 lines)       │  │                      │ │
│  │  Subheadline                │  │   Hero Image         │ │
│  │  [Primary CTA] [Secondary]  │  │   (smiling care pro) │ │
│  │  ◉◉◉◉  20k+ Happy Patients  │  │                      │ │
│  │  ┌────────┐  ┌────────────┐  │  │                      │ │
│  │  │ Card 1 │  │ Card 2     │  │  │                      │ │
│  │  └────────┘  └────────────┘  │  └──────────────────────┘ │
│  └─────────────────────────────┘                           │
└─────────────────────────────────────────────────────────────┘
```
- Rounded-3xl outer card (≈40px radius) with soft blue/white gradient.
- Navigation is inside the card, not a separate fixed bar.
- Hero is left-aligned two-column: content (55%) + image (45%).
- Floating cards at bottom-left of content area.
- Decorative SVG: curved line + starburst between content and image.

### Signature Element
The **rounded-3xl hero shell** that wraps the nav + hero into one calm, clinical card. This distinguishes Dr. Bubal Care from a generic split-section SaaS landing and gives the medical brand a trustworthy, "enclosed" feel.

### Components to Modify
1. `components/landing-page/navigation.tsx` — remove fixed positioning, remove TrustBar, centered links, outline CTA.
2. `components/landing-page/hero-section.tsx` — rebuild to two-column layout with floating cards, avatar group, decorative SVG, hero image.
3. `app/page.tsx` — wrap nav + hero in a shared rounded shell with margin and top padding.

### Content Mapping
- **Headline:** "Specialist clarity for your health, in 24–48 hours."
- **Subheadline:** "Upload your lab results, scans, or biopsy. A board-certified specialist reviews your case and returns a plain-language written opinion."
- **Primary CTA:** "Start Your Case →" (clinical-navy filled)
- **Secondary CTA:** "See How It Works" (outline + play icon) — links to `#how-it-works`
- **Social proof:** "500+ patients helped" with overlapping avatar placeholders
- **Floating cards:**
  - "24-48h Turnaround" — "Board-certified answers, fast."
  - "AI-Assisted Review" — "AI surfaces, specialists decide."

### Accessibility Notes
- Headline remains `<h1>`.
- Nav links are real anchor links to page sections.
- CTAs have sufficient contrast (clinical-navy on white, white on clinical-navy).
- Decorative SVG elements are `aria-hidden`.
- Mobile: stack image above content, keep nav hamburger.

### Do / Don't
- **Do:** Use large type scale, generous whitespace, rounded corners, and the existing color tokens.
- **Do:** Keep the hero as one enclosed card.
- **Don't:** Add neon glows, gradient meshes, or multiple competing accent colors.
- **Don't:** Use generic Inter-only typography; keep Manrope for headlines.

## Self-Critique (Pass 2)
- Original instinct: keep the fixed nav + separate hero section. Revised to match the reference image: nav inside the hero card, which is the distinctive structural choice.
- Original instinct: use a solid white background. Revised to use the soft evidence-blue-light wash to add depth without breaking the medical/clinical feel.
- Hero image: use a remote placeholder image of a smiling healthcare professional. This should be replaced with a Dr. Bubal-owned asset before production.
