# Landing Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Dr. Bubal Care landing page to a clean, light medical-tech aesthetic with role-based CTAs, How It Works process, and AI Intelligence section.

**Architecture:** Single `'use client'` page component (`app/page.tsx`) with all sections inline — matching existing pattern. Data arrays (SERVICES, DOCTORS) preserved. `motion` library used for scroll-triggered entrance animations. No new components or files.

**Tech Stack:** Next.js 15.5 (App Router), React 19, Tailwind CSS v4, motion v12, Material Symbols Outlined icons.

## Global Constraints

- Keep the `'use client'` directive
- Keep existing SERVICES and DOCTORS data arrays (content unchanged, only styling updated)
- Use Tailwind CSS utility classes only — no CSS modules or styled-components
- Use `motion/react` for animations (the installed package is `motion` v12, import from `motion/react`)
- Use Material Symbols Outlined for icons (already loaded in layout)
- All sections remain in one file: `app/page.tsx`
- Color palette: `clinical-navy` (#0F4C81) for headings/key CTAs, `healing-teal` (#00A3AD) for accents, `evidence-blue-light` (#E0F2FE) for soft backgrounds, `surface` (#F7F9FB) for page bg, white for cards
- Max width: `max-w-7xl mx-auto` for sections, padding `px-6 md:px-16`

---

### Task 1: Rewrite Navigation + Hero Section

**Files:**
- Modify: `app/page.tsx:69-153` (replaces current nav + hero)

**Interfaces:**
- Consumes: existing `useState` declarations at lines 58-61 (`searchQuery`, `activeTab`, `selectedDoctor`)
- Produces: updated nav with role buttons + new hero with dual CTAs

- [ ] **Step 1: Replace the nav bar**

Replace the existing `<nav>` element (lines 71-107) with a transparent-to-white sticky nav:
```tsx
<nav className="bg-white/80 backdrop-blur-md border-b border-surface-gray/50 fixed top-0 w-full z-50">
  <div className="flex justify-between items-center max-w-7xl mx-auto px-6 md:px-16 py-4">
    <Link href="/" className="font-headline-md text-2xl font-bold text-clinical-navy">
      Dr Bubal Care
    </Link>
    <div className="hidden md:flex space-x-6 items-center">
      {['Home', 'Services', 'About', 'Doctors'].map((tab) => (
        <a
          key={tab}
          className={`font-label-md text-sm transition-colors pb-1 border-b-2 ${
            activeTab === tab
              ? 'text-clinical-navy border-clinical-navy font-bold'
              : 'text-on-surface-variant border-transparent hover:text-clinical-navy'
          }`}
          href={`#${tab.toLowerCase()}`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </a>
      ))}
    </div>
    <div className="flex space-x-3 items-center">
      <Link
        href="/patient"
        className="text-clinical-navy text-sm font-semibold border border-clinical-navy/30 px-5 py-2.5 rounded-lg hover:bg-evidence-blue-light transition-all"
      >
        Patient Portal
      </Link>
      <Link
        href="/doctor"
        className="bg-clinical-navy text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-primary-container transition-all shadow-sm"
      >
        Physician Portal
      </Link>
    </div>
  </div>
</nav>
```

- [ ] **Step 2: Replace the hero section**

Replace lines 112-153 with the new hero — gradient background, no image, dual role CTA cards:
```tsx
<section className="relative pt-40 pb-28 px-6 md:px-16 min-h-[85vh] flex items-center justify-center overflow-hidden" id="home">
  <div className="absolute inset-0 bg-gradient-to-b from-evidence-blue-light/60 via-white to-white pointer-events-none"></div>
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-healing-teal/5 rounded-full blur-3xl pointer-events-none"></div>
  <div className="relative z-10 max-w-6xl mx-auto w-full">
    <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
      <div className="inline-flex items-center space-x-2 bg-evidence-blue-light px-4 py-2 rounded-full text-clinical-navy text-sm font-medium border border-clinical-navy/10">
        <span className="w-2 h-2 rounded-full bg-healing-teal"></span>
        <span>Global Telehealth & Referral Platform</span>
      </div>
      <h1 className="font-display-lg text-4xl md:text-6xl lg:text-7xl text-text-medical-black tracking-tight font-black leading-tight">
        Global Medical Coordination,<br />
        <span className="text-clinical-navy">Precision Delivered.</span>
      </h1>
      <p className="font-body-lg text-lg md:text-xl text-on-surface-variant/80 leading-relaxed max-w-2xl mx-auto">
        Connecting diaspora patients and referring physicians to world-class specialists — one platform.
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
      <Link href="/patient" className="group bg-white rounded-2xl p-8 border border-surface-gray/60 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div className="w-14 h-14 rounded-xl bg-evidence-blue-light flex items-center justify-center text-clinical-navy mb-5 group-hover:bg-clinical-navy group-hover:text-white transition-colors duration-300">
          <span className="material-symbols-outlined text-2xl">person</span>
        </div>
        <h3 className="font-headline-md text-xl font-bold text-clinical-navy mb-3">I'm a Patient</h3>
        <p className="font-body-md text-on-surface-variant/80 mb-6 leading-relaxed">Access global specialists, track your case in real time, and receive plain-language results.</p>
        <span className="inline-flex items-center text-healing-teal font-semibold text-sm group-hover:translate-x-1 transition-transform">Start a Case →</span>
      </Link>
      <Link href="/doctor" className="group bg-white rounded-2xl p-8 border border-surface-gray/60 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div className="w-14 h-14 rounded-xl bg-evidence-blue-light flex items-center justify-center text-clinical-navy mb-5 group-hover:bg-clinical-navy group-hover:text-white transition-colors duration-300">
          <span className="material-symbols-outlined text-2xl">stethoscope</span>
        </div>
        <h3 className="font-headline-md text-xl font-bold text-clinical-navy mb-3">I'm a Physician</h3>
        <p className="font-body-md text-on-surface-variant/80 mb-6 leading-relaxed">Submit referrals, track completion, receive structured results. Free to join.</p>
        <span className="inline-flex items-center text-healing-teal font-semibold text-sm group-hover:translate-x-1 transition-transform">Join Free →</span>
      </Link>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Remove `searchQuery` state from `useState` (line 59)**

Since we're removing the search bar, delete the `searchQuery` state and the `filteredServices` computed variable (lines 63-66). Keep `activeTab` and `selectedDoctor`.

- [ ] **Step 4: Verify**

Run: `npx next lint`
Expected: No errors or warnings

---

### Task 2: Add Who We Serve + How It Works Sections

**Files:**
- Modify: `app/page.tsx` (insert after hero section, before Services)

**Interfaces:**
- Consumes: Task 1 complete (hero section in place)
- Produces: two new sections between hero and services

- [ ] **Step 1: Add "Who We Serve" section**

Insert after the hero `</section>` closing tag and before Services opens:
```tsx
<section className="py-24 bg-white border-y border-surface-gray/50" id="services">
  <div className="max-w-7xl mx-auto px-6 md:px-16 space-y-16">
    <div className="text-center max-w-3xl mx-auto space-y-4">
      <h2 className="font-headline-lg text-3xl md:text-4xl lg:text-5xl font-bold text-text-medical-black">Who We Serve</h2>
      <p className="font-body-lg text-lg text-on-surface-variant/80">Two sides of the same mission — better global healthcare coordination.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Patients card */}
      <div className="bg-white rounded-2xl p-10 border border-surface-gray/60 shadow-sm hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-evidence-blue-light/30 rounded-bl-full -mr-10 -mt-10"></div>
        <div className="relative z-10">
          <div className="w-14 h-14 rounded-xl bg-evidence-blue-light flex items-center justify-center text-clinical-navy mb-6">
            <span className="material-symbols-outlined text-2xl">heart_plus</span>
          </div>
          <h3 className="font-headline-md text-2xl font-bold text-clinical-navy mb-4">For Patients</h3>
          <p className="font-body-md text-on-surface-variant/80 mb-8 leading-relaxed max-w-md">
            Get second opinions, track lab results, upload records, and receive plain-language interpretations. Your entire diagnostic journey in one place.
          </p>
          <Link href="/patient" className="inline-flex items-center text-clinical-navy font-semibold text-sm group-hover:text-healing-teal transition-colors">
            Start a Case <span className="material-symbols-outlined ml-1 text-[18px] transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>
      </div>
      {/* Physicians card */}
      <div className="bg-white rounded-2xl p-10 border border-surface-gray/60 shadow-sm hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-evidence-blue-light/30 rounded-bl-full -mr-10 -mt-10"></div>
        <div className="relative z-10">
          <div className="w-14 h-14 rounded-xl bg-evidence-blue-light flex items-center justify-center text-clinical-navy mb-6">
            <span className="material-symbols-outlined text-2xl">stethoscope</span>
          </div>
          <h3 className="font-headline-md text-2xl font-bold text-clinical-navy mb-4">For Referring Physicians</h3>
          <p className="font-body-md text-on-surface-variant/80 mb-8 leading-relaxed max-w-md">
            Submit cases, track referral completion, receive structured results. Free to join. The loop is always closed.
          </p>
          <Link href="/doctor" className="inline-flex items-center text-clinical-navy font-semibold text-sm group-hover:text-healing-teal transition-colors">
            Join Free <span className="material-symbols-outlined ml-1 text-[18px] transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add "How It Works" section**

Insert after Who We Serve section:
```tsx
<section className="py-24 bg-surface border-b border-surface-gray/50">
  <div className="max-w-7xl mx-auto px-6 md:px-16 space-y-16">
    <div className="text-center max-w-3xl mx-auto space-y-4">
      <h2 className="font-headline-lg text-3xl md:text-4xl lg:text-5xl font-bold text-text-medical-black">How It Works</h2>
      <p className="font-body-lg text-lg text-on-surface-variant/80">From first contact to final answer — we handle the coordination.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
      {/* Connecting line */}
      <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-clinical-navy/10"></div>
      {[
        { num: '01', title: 'Open a Case', desc: 'Select your service, upload records, describe your needs. Takes under 5 minutes.' },
        { num: '02', title: 'AI Coordinates', desc: 'Smart triage matches you to the right specialist. Agents begin dossier preparation.' },
        { num: '03', title: 'Everyone Stays Informed', desc: 'Real-time status for patients and physicians. No one has to chase anyone.' },
        { num: '04', title: 'Clarity Delivered', desc: 'Result uploaded, plain-language summary generated, next steps recommended.' },
      ].map((step, i) => (
        <div key={i} className="relative text-center md:text-left">
          <div className="w-14 h-14 rounded-full bg-evidence-blue-light flex items-center justify-center text-clinical-navy font-headline-md font-bold text-lg mb-6 mx-auto md:mx-0 relative z-10">
            {step.num}
          </div>
          <h3 className="font-headline-md text-lg font-bold text-clinical-navy mb-3">{step.title}</h3>
          <p className="font-body-md text-on-surface-variant/80 leading-relaxed text-sm">{step.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 3: Verify**

Run: `npx next lint`
Expected: No errors or warnings

---

### Task 3: Add AI Intelligence Section

**Files:**
- Modify: `app/page.tsx` (insert after How It Works, before Services)

**Interfaces:**
- Consumes: Task 2 complete (How It Works section in place)
- Produces: new AI Intelligence section before Services

- [ ] **Step 1: Add AI Intelligence section**

Insert between How It Works `</section>` and the existing Services `<section id="services">`:
```tsx
<section className="py-24 bg-white border-b border-surface-gray/50">
  <div className="max-w-7xl mx-auto px-6 md:px-16 space-y-16">
    <div className="text-center max-w-3xl mx-auto space-y-4">
      <div className="inline-flex items-center space-x-2 bg-evidence-blue-light px-4 py-1.5 rounded-full text-clinical-navy text-xs font-semibold uppercase tracking-wider">
        <span className="w-1.5 h-1.5 rounded-full bg-healing-teal"></span>
        <span>AI-Powered</span>
      </div>
      <h2 className="font-headline-lg text-3xl md:text-4xl lg:text-5xl font-bold text-text-medical-black">Intelligence Built Into Every Step</h2>
      <p className="font-body-lg text-lg text-on-surface-variant/80">Not a chatbot. Three specialized AI agents triggered by real events in your diagnostic journey.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        { icon: 'lab_profile', title: 'Lab Analysis Agent', desc: 'Automated biomarker extraction and risk flagging from uploaded lab reports. Flags abnormal values for immediate physician review.' },
        { icon: 'description', title: 'Dossier Synthesizer', desc: 'Transforms messy medical records into a structured chronological timeline — clinician-ready in seconds.' },
        { icon: 'smart_toy', title: 'Smart Triage & Matching', desc: 'Routes every case to the optimal global specialist based on clinical data, expertise, and availability.' },
      ].map((item, i) => (
        <div key={i} className="bg-surface rounded-2xl p-8 border border-surface-gray/60 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex items-center space-x-2 mb-5">
            <div className="w-10 h-10 rounded-lg bg-healing-teal/10 flex items-center justify-center text-healing-teal">
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-healing-teal bg-healing-teal/10 px-2 py-0.5 rounded">Agent</span>
          </div>
          <h3 className="font-headline-md text-xl font-bold text-clinical-navy mb-3">{item.title}</h3>
          <p className="font-body-md text-on-surface-variant/80 leading-relaxed text-sm">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Update the Services section `id`**

The new Who We Serve section uses `id="services"`. Change the existing Services section `id` from `"services"` to `"specialties"`:
- Find: `<section className="py-24 bg-surface border-y border-surface-gray" id="services">`
- Replace `id="services"` with `id="specialties"`

Also update the nav link `href="#services"` to `href="#specialties"`.

- [ ] **Step 3: Verify**

Run: `npx next lint`
Expected: No errors or warnings

---

### Task 4: Restyle Services Section — Remove Search, Lighter Styling

**Files:**
- Modify: `app/page.tsx` (services section lines 155-217)

**Interfaces:**
- Consumes: Task 3 complete (AI section in place, services id changed to "specialties")
- Produces: restyled services section

- [ ] **Step 1: Update Services section heading and grid**

Replace the existing services section (currently with `id="specialties"` after Task 3) with:
- Remove `searchQuery` filtering — show all 3 service cards + 1 featured card directly
- Update section heading from "Comprehensive Specialized Care" to "Our Services"
- Update subtitle
- Keep the 3 SERVICE data items but update card styling to lighter aesthetic
- Keep the featured "Precision Medicine & Genomics" card (last in grid)

Replace the section with:
```tsx
<section className="py-24 bg-surface border-y border-surface-gray/50" id="specialties">
  <div className="max-w-7xl mx-auto px-6 md:px-16 space-y-16">
    <div className="text-center max-w-3xl mx-auto space-y-4">
      <h2 className="font-headline-lg text-3xl md:text-4xl lg:text-5xl font-bold text-text-medical-black">Our Services</h2>
      <p className="font-body-lg text-lg text-on-surface-variant/80">Evidence-based pathways designed for clarity and positive clinical outcomes.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {SERVICES.map((service) => (
        <div key={service.id} className="bg-white rounded-2xl p-8 border border-surface-gray/60 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col h-full hover:-translate-y-1">
          <div className="w-14 h-14 rounded-xl bg-evidence-blue-light flex items-center justify-center text-clinical-navy mb-6 group-hover:bg-clinical-navy group-hover:text-white transition-colors duration-300">
            <span className="material-symbols-outlined text-2xl">{service.icon}</span>
          </div>
          <h3 className="font-headline-md text-xl font-bold text-clinical-navy mb-4 group-hover:text-healing-teal transition-colors duration-300">{service.title}</h3>
          <p className="font-body-md text-on-surface-variant/80 mb-8 flex-grow leading-relaxed">{service.description}</p>
          <Link href={`/directory?category=${service.category}`} className="inline-flex items-center text-clinical-navy font-semibold text-sm mt-auto group-hover:text-healing-teal transition-colors">
            Learn More <span className="material-symbols-outlined ml-1 text-[18px] transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>
      ))}
      {/* Featured: Precision Medicine */}
      <div className="md:col-span-2 lg:col-span-3 bg-clinical-navy rounded-2xl p-8 md:p-12 border border-clinical-navy shadow-lg hover:shadow-xl transition-all duration-300 group flex flex-col md:flex-row gap-8 relative overflow-hidden">
        <div className="relative z-10 md:w-2/3 flex flex-col h-full">
          <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center text-healing-teal mb-6">
            <span className="material-symbols-outlined text-2xl">science</span>
          </div>
          <h3 className="font-headline-md text-2xl font-bold text-white mb-4">Precision Medicine & Genomics</h3>
          <p className="font-body-md text-white/80 mb-8 max-w-2xl text-lg leading-relaxed">Tailoring treatment protocols based on individual genetic profiles and advanced molecular diagnostics to maximize efficacy and minimize adverse reactions.</p>
          <Link href="/directory?precision=true" className="inline-flex items-center text-healing-teal font-semibold text-sm mt-auto w-fit hover:text-white transition-colors">
            Learn More <span className="material-symbols-outlined ml-1 text-[18px] transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-clinical-navy via-clinical-navy/90 to-transparent pointer-events-none"></div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Verify**

Run: `npx next lint`
Expected: No errors or warnings

---

### Task 5: Restyle About + Statistics + Doctors + CTA + Footer

**Files:**
- Modify: `app/page.tsx` (about section lines 219-286, doctors section lines 288-327, modal lines 329-370, CTA lines 372-386, footer lines 389-417)

**Interfaces:**
- Consumes: Tasks 1-4 complete
- Produces: restyled remaining sections

- [ ] **Step 1: Restyle About section**

Update the about section with lighter styling — keep the same layout (image left, text right + 3 feature bullets + stats banner). Update border colors from `border-surface-gray` to `border-surface-gray/50`, keep content identical.

- [ ] **Step 2: Restyle Doctors section**

Update the doctors section — keep the same 3 doctor cards + modal layout. Update border colors, card backgrounds to `bg-white`, refine shadows and hover effects.

- [ ] **Step 3: Restyle CTA section**

Replace the CTA background from `bg-evidence-blue-light/30` to light gradient, update headline/subtitle, add dual buttons:
```tsx
<section className="py-24 bg-gradient-to-b from-white to-evidence-blue-light/20 border-y border-surface-gray/50">
  <div className="max-w-7xl mx-auto px-6 md:px-16 text-center space-y-8">
    <h2 className="font-headline-lg text-3xl md:text-4xl font-bold text-text-medical-black">Ready to begin your clinical journey?</h2>
    <p className="font-body-lg text-lg text-on-surface-variant/80 max-w-2xl mx-auto">Schedule a comprehensive evaluation or refer a patient — we're here for both.</p>
    <div className="flex justify-center gap-4 pt-4 flex-wrap">
      <Link href="/directory" className="bg-clinical-navy text-white text-sm font-semibold px-8 py-4 rounded-xl hover:bg-primary-container transition-all shadow-md">
        Secure an Appointment
      </Link>
      <Link href="/doctor" className="border border-clinical-navy/30 text-clinical-navy text-sm font-semibold px-8 py-4 rounded-xl hover:bg-evidence-blue-light transition-all">
        Refer a Patient
      </Link>
    </div>
  </div>
</section>
```

- [ ] **Step 4: Restyle Footer**

Keep the dark clinical-navy footer as-is (it provides good visual anchor). Minor refinements if needed.

- [ ] **Step 5: Verify**

Run: `npx next lint`
Expected: No errors or warnings

---

### Task 6: Add Entrance Animations with motion

**Files:**
- Modify: `app/page.tsx` (wrap sections with motion.div for scroll-triggered animations)

**Interfaces:**
- Consumes: All prior tasks complete
- Produces: animated page sections

- [ ] **Step 1: Import motion at the top**

Add to existing imports:
```tsx
import { motion } from 'motion/react';
```

- [ ] **Step 2: Define animation variants**

Add before the `export default function Home()`:
```tsx
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};
```

- [ ] **Step 3: Wrap sections with motion.div**

For each major section tag (`<section>`) in the page, change the opening tag to:
```tsx
<motion.section
  variants={fadeInUp}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-80px" }}
  // ... existing class and props
>
```

Apply to: Hero, Who We Serve, How It Works, AI Intelligence, Services, About, Doctors sections.

Keep the closing `</section>` as is (motion handles it).

- [ ] **Step 4: Add staggered entrance for hero cards**

Wrap the hero role cards grid with:
```tsx
<motion.div
  initial="hidden"
  animate="visible"
  variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
  className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto"
>
```
And add `variants={fadeInUp}` to each card Link.

- [ ] **Step 5: Verify**

Run: `npx next lint`
Expected: No errors or warnings

---

### Task 7: Final Verification

**Files:**
- Verify: `app/page.tsx` (entire file)

- [ ] **Step 1: Lint check**

Run: `npx next lint`
Expected: No errors or warnings

- [ ] **Step 2: TypeScript check**

Run: `npx tsc --noEmit`
Expected: No type errors

- [ ] **Step 3: Build check**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 4: Review all section content**

Verify all sections are present in order:
1. Navigation
2. Hero — gradient bg, dual role CTAs
3. Who We Serve — 2 cards (Patients, Physicians)
4. How It Works — 4-step process
5. AI Intelligence — 3 agent cards
6. Services — 3 service cards + 1 featured card
7. About — image + bullets + stats
8. Doctors — 3 doctor cards + modal
9. CTA — dual buttons (Appointment + Refer)
10. Footer

Expected: Complete, coherent landing page matching the spec
