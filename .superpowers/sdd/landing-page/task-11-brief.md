# Task 11: Contact Section — Brief

**Files:** `components/landing-page/contact-section.tsx` (new)
**Depends on:** None

## Spec
- Extract from current `app/page.tsx` (lines 473-538)
- Section id: `contact`
- 2-column layout: contact info left, form right
  - Grid: `grid grid-cols-1 lg:grid-cols-2 gap-10`
- Section wrapper: `py-16 bg-white border-y border-surface-gray/50`
- Content container: `max-w-7xl mx-auto px-6 md:px-16`

### Left Column (Contact Info)
- Headline: "Get in Touch"
  - Styling: `font-headline-lg text-2xl md:text-3xl font-semibold text-text-medical-black text-balance`
- Description: "Have a question about our services, need help with a referral, or want to partner with us? We're here to help."
  - Styling: `font-body-lg text-sm text-on-surface-variant/80 max-w-md leading-relaxed`
- Contact items (3):
  - Email: care@drbubalcare.com (Mail icon)
  - Phone: +1 (800) 555-1234 (Phone icon)
  - Location: Ghent, Belgium — Telehealth & Remote Consultations (MapPin icon)
- Each contact item:
  - Icon container: `w-9 h-9 rounded-lg bg-evidence-blue-light flex items-center justify-center text-clinical-navy flex-shrink-0`
  - Label: `font-label-md text-[11px] text-on-surface-variant uppercase tracking-wider font-medium`
  - Value: `font-body-md text-sm text-clinical-navy hover:text-healing-teal transition-colors`

### Right Column (Form)
- Form container: `bg-surface rounded-2xl p-6 border border-surface-gray/60 shadow`
- Fields: Name, Email (2-col row), Subject, Message (textarea rows=4)
- Submit button: `bg-clinical-navy text-white text-sm font-medium px-6 py-2.5 rounded-xl hover:bg-primary-container transition-all shadow-sm w-full sm:w-auto`
- Form is client-side only (onSubmit preventDefault) — no server action needed
- Input styling: `w-full px-3 py-2 rounded-lg border border-surface-gray bg-white text-text-medical-black font-body-md text-sm placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-clinical-navy/20 focus:border-clinical-navy transition-all`
