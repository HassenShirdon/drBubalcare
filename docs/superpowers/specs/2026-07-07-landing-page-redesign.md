# Dr. Bubal Care — Landing Page Redesign

## Overview

Redesign the Dr. Bubal Care landing page to a clean, light medical-tech aesthetic inspired by modern telehealth platforms (notably MedSecOp's design language) while remaining wholly original. The page targets two primary audiences equally: **diaspora patients** seeking remote care coordination and **referring physicians** seeking referral partnerships.

## Visual Direction

- **Palette:** Light, white-dominant background with soft `evidence-blue-light` (#E0F2FE) gradients. Primary `clinical-navy` (#0F4C81) retained for headings and key CTAs. `healing-teal` (#00A3AD) for accents and interactive elements. Ample whitespace throughout.
- **Typography:** Manrope for headings (unchanged), Inter for body (unchanged). Larger, more generous type scale in hero.
- **Shadows & Borders:** Softer shadows (`shadow-sm`), lighter borders (`border-surface-gray/50`), generous border-radius on cards.
- **Layout:** Max-width 7xl centered, generous horizontal padding, consistent vertical spacing (py-20/py-24).

## Page Structure (top-to-bottom)

### 1. Navigation
- Transparent sticky nav that becomes white with backdrop blur on scroll
- Logo left, nav links center (Home, Services, About, Doctors)
- Right side: two buttons — "Patient Portal" and "Physician Portal" (outline + filled style)
- Mobile: hamburger menu with same links

### 2. Hero Section
- Soft gradient background (evidence-blue-light fading to white)
- No background image — clean gradient only
- Large headline: "Global Medical Coordination, Precision Delivered."
- Subtitle: "Connecting diaspora patients and referring physicians to world-class specialists — one platform."
- Two role-based CTA cards side by side:
  - **"I'm a Patient"** — icon + "Access global specialists, track your case in real time"
  - **"I'm a Physician"** — icon + "Submit referrals, collaborate globally, close the loop"
- Each card links to respective portal/registration
- Cards have hover lift effect, subtle border, light shadow

### 3. "Who We Serve" — 2 Role Cards
- Two large cards in a 2-column grid:
  - **Patients** — "Get second opinions, track lab results, upload records, and receive plain-language interpretations. Your entire diagnostic journey in one place."
  - **Referring Physicians** — "Submit cases, track referral completion, receive structured results. Free to join. The loop is always closed."
- Each card: icon top-left, title, description, primary CTA button ("Start a Case" / "Join Free")
- Soft shadow, rounded corners, hover lift

### 4. "How It Works" — 4-Step Process
- Horizontal 4-column layout with connecting line between steps (desktop), stacked on mobile
- Each step: numbered circle (1-4) on light blue background, bold label, short description
- Steps:
  1. **Open a Case** — Select your service, upload records, describe your needs. Takes under 5 minutes.
  2. **AI Coordinates** — Smart triage matches you to the right specialist; agents begin dossier preparation.
  3. **Everyone Stays Informed** — Real-time status for patients and referring physicians. No one chases anyone.
  4. **Clarity Delivered** — Result uploaded, plain-language summary generated, next steps recommended.
- Section heading: "How It Works" + subtitle: "From first contact to final answer — we handle the coordination."

### 5. AI Intelligence
- Section heading: "Intelligence Built Into Every Step" + subtitle: "Powered by a multi-agent system that automates the diagnostic workflow."
- 3 feature cards in a 3-column grid:
  - **Lab Analysis Agent** — Automated biomarker extraction and risk flagging from uploaded lab reports. Flags abnormal values for physician review.
  - **Dossier Synthesizer** — Transforms messy medical records into a structured chronological timeline, clinician-ready in seconds.
  - **Smart Triage & Matching** — Routes every case to the optimal global specialist based on clinical data and availability.
- Each card: small "AI" badge, icon, title, one-paragraph description
- Hover: subtle lift, accent border color

### 6. Services (existing, restyled)
- Keep the 3 service cards + 1 featured Precision Medicine card
- Restyle to match lighter aesthetic: cleaner borders, softer shadows, teal accent buttons
- Remove search functionality (no longer filtering services)
- Data-driven Protocols → keep copy as-is

### 7. About + Statistics
- Keep image + feature bullets layout (left: image, right: text + 3 feature items)
- Keep 3 feature items: Board-Certified Specialists, Data-Driven Protocols, Transparent Communication
- Stats banner below: 15+ Yrs, 50k Patients, 120 Specialists, 98% Accuracy
- Update styling to match lighter aesthetic (white cards, soft borders)

### 8. Doctors
- Keep 3 doctor profile cards + quick-view modal
- Update styling to match lighter aesthetic
- Keep hover effects (image zoom, overlay)

### 9. Final CTA
- Light evidence-blue background (not dark)
- Headline: "Ready to begin your clinical journey?"
- Subtitle: "Schedule a comprehensive evaluation or refer a patient — we're here for both."
- Two buttons: "Secure an Appointment" (primary) and "Refer a Patient" (outline)

### 10. Footer
- Keep dark clinical-navy footer as visual anchor
- 3 columns: Brand info, Navigation links, Legal links
- Same content as current, restyled slightly cleaner

## Key Design Decisions

- **No background images in hero** — clean gradient-only hero for faster load and cleaner look
- **Role-based CTAs** replace search bar — clearer value proposition for each audience
- **How It Works + AI sections** added to differentiate from competitors and showcase the AGENTS.md technology
- **Removed service search** — services are now static showcase cards
- **Lighter palette** — more approachable, trustworthy feel for medical platform
- **Dual-role CTAs in CTA section** — reinforces equal focus on patients and physicians

## Component Architecture

All sections remain in a single `app/page.tsx` client component. No new components created (keeping it simple). Changes are:
- Restyle existing sections (hero, services, about, doctors, CTA, footer)
- Add 3 new sections (Who We Serve, How It Works, AI Intelligence)
- Remove search state/filtering from services
- Add `motion` entrance animations for sections (fade-up on scroll)

## Animation

- Sections animate in on scroll using `motion` (framer-motion successor) — `fadeInUp` variant
- Hero cards: staggered entrance with slight delay
- How It Works steps: sequential entrance
- All animations: subtle, 0.5s duration, ease-out
