# Problem Section Redesign

**Date:** 2026-07-19
**File:** `components/landing-page/problem-section.tsx`

---

## Goal

Replace the 3-card grid layout with a vertical timeline design. Update content to be patient-centered, covering specialist access problems in both developing and developed worlds.

---

## Layout Change

**Before:** 3-column card grid with icon + stat + description
**After:** Vertical timeline with connected nodes, alternating content sides

### Timeline structure

- Thin vertical line (`w-px bg-surface-gray`) runs center of section
- Each node is a circle (`w-3 h-3 rounded-full bg-healing-teal`) on the line
- Odd nodes: content on the left, circle on the right
- Even nodes: content on the right, circle on the left
- On mobile (`<768px`): all content stacks to the right of the line
- Each node: large stat headline + description below

### Spacing

- Section: `py-20` (up from `py-16`)
- Timeline nodes: `space-y-12` between each
- Container: `max-w-4xl mx-auto` (narrower than current `max-w-7xl` for readability)

---

## Content Updates

### Heading (unchanged)

"Getting specialist care shouldn't be this hard"

### Subheading (updated)

**Before:** "In East Africa, accessing a qualified specialist — for lab reviews, second opinions, or consultations — means travel, long waits, and uncertainty."

**After:** "Whether you're in Nairobi or New York, seeing a specialist means travel, long waits, and uncertainty."

### Timeline nodes

| # | Stat | Description |
|---|------|-------------|
| 1 | **1 specialist per 100,000+** | Most communities — rich or poor — lack board-certified specialists nearby. In Sub-Saharan Africa, the ratio is 1:1,000,000. Even in the US, rural counties average 1 specialist per 50,000+. |
| 2 | **6+ hours avg. travel** | Patients travel for hours — sometimes across borders — just for a consultation. In developing nations, it's days. In the US, rural patients drive 4x further than urban peers. |
| 3 | **Weeks to months wait** | By the time you get an appointment, critical time has been lost. Specialist access shouldn't be a luxury — but everywhere, it is. |

---

## Typography

| Element | Classes |
|---------|---------|
| Heading | `font-headline-lg text-2xl md:text-3xl lg:text-4xl font-semibold text-text-medical-black text-balance` |
| Subheading | `font-body-lg text-base text-on-surface-variant/80` |
| Stat | `font-headline-md text-3xl font-bold text-clinical-navy` |
| Description | `font-body-md text-sm text-on-surface-variant/80 leading-relaxed` |

---

## Styling

- Section background: `bg-white` (remove `border-y border-surface-gray/50`)
- Vertical line: `w-px bg-surface-gray/60`
- Node circle: `w-3 h-3 rounded-full bg-healing-teal ring-4 ring-white` (ring keeps circle visible over line)
- Cards removed — pure typography, no borders/shadows/hover states on individual items

---

## Animation

- Keep existing Framer Motion `fadeInUp` variant
- Keep staggered reveal (`staggerChildren: 0.15`)
- Each timeline node is a separate `motion.div` that fades in

---

## Responsive behavior

- **Desktop (768px+):** Alternating left/right content, centered line
- **Mobile (<768px):** Vertical line on left edge, all content to the right

---

## Removed

- `Users`, `Plane`, `Clock` icons from lucide-react (no icons in timeline)
- Card container divs (`bg-white rounded-2xl p-6 border ...`)
- `hover:shadow-md transition-all` on cards

---

## Accessibility

- Semantic heading hierarchy maintained (`<h2>`)
- No interactive elements changed
- `text-balance` on heading for readability
- Sufficient color contrast (clinical-navy on white, on-surface-variant/80 on white)

---

## Web Interface Guidelines compliance

- `text-wrap: balance` on heading ✓
- No `transition: all` — removed with cards ✓
- No icon-only elements ✓
- Semantic HTML ✓

---

## Testing

- Visual: timeline renders correctly on mobile, tablet, desktop
- Content: all 3 nodes display correct stat and description
- Animation: staggered fade-in works on scroll
- Responsive: alternating layout on desktop, stacked on mobile
