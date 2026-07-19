# Doctor Dashboard Design Refinement

**Date:** 2026-07-19
**Status:** Approved
**Scope:** Refine existing doctor dashboard — sidebar, layout, typography, and all pages

---

## 1. Design Direction

**Approach:** Refine current design (not radical redesign). Keep the existing clinical navy + healing teal palette, but improve spacing, typography, sidebar design, and overall polish.

**Core principles:**
- Consistent spacing across all pages
- Clear typography hierarchy
- Professional grouped sidebar
- Polished card and table treatments

---

## 2. Sidebar Design

### Structure
```
┌─────────────────────────────┐
│  [Logo] Dr Bubal Care       │
│          Clinical Portal    │
│                             │
│  ─── MAIN ────────────────  │
│  ◻ Dashboard                │
│  ◻ My Cases                 │
│  ◻ Patients                 │
│  ◻ Schedule                 │
│                             │
│  ─── CLINICAL ────────────  │
│  ◻ Lab Reviews              │
│                             │
│  ┌───────────────────────┐  │
│  │  + New Consultation   │  │
│  └───────────────────────┘  │
│                             │
│  ─── SUPPORT ─────────────  │
│  ◻ Help Center              │
│  ◻ Logout                   │
└─────────────────────────────┘
```

### Styling
- **Width:** `w-60` (240px)
- **Background:** White
- **Border:** `border-r border-surface-gray`
- **Padding:** `py-4 px-3`

### Navigation Items
- **Icon size:** `size-[18px]` (consistent across all)
- **Font:** 13px medium weight (Inter)
- **Padding:** `py-2 px-3`
- **Border radius:** `rounded-lg`
- **Spacing between items:** `space-y-1`

### Active State
- Left accent bar: 3px solid `clinical-navy`
- Background: `bg-evidence-blue-light/50`
- Text: `text-clinical-navy font-semibold`
- Border radius: `rounded-l-lg` (no right radius for accent bar alignment)

### Hover State
- Background: `bg-surface-container-low`
- Text: `text-clinical-navy`
- Transition: `transition-colors duration-150`

### Section Labels
- Font: 11px uppercase, letter-spacing 0.08em
- Color: `text-on-surface-variant`
- Margin: `mb-2 mt-4` (first section: `mt-0`)
- Border: Subtle bottom line `border-b border-surface-gray/60 mb-3 pb-2`

### "New Consultation" Button
- Full width
- Background: `bg-clinical-navy text-white`
- Font: 13px medium
- Padding: `py-2.5 px-3`
- Border radius: `rounded-lg`
- Hover: `hover:bg-primary-container`
- Icon: Plus icon, 14px
- Shadow: `shadow-sm`

---

## 3. Top Bar & Layout

### Top Bar
- **Height:** `h-14` (56px)
- **Background:** White
- **Border:** `border-b border-surface-gray`
- **Position:** `sticky top-0 z-40`
- **Padding:** `px-6`

**Left side:**
- Mobile menu toggle (md:hidden): Opens a slide-out overlay sidebar with backdrop
- Dynamic page title: `text-base font-semibold text-clinical-navy` (16px, Manrope)

**Right side:**
- Notification bell: `size-5 text-on-surface-variant` with red dot badge
- User avatar: 28px circle, navy background, white initial
- User name: `text-sm text-on-surface` (hidden on mobile, shown lg:block)

### Overall Layout
- **Sidebar:** `w-60` (240px), fixed left
- **Main content:** `ml-60` on desktop, full-width on mobile
- **Content padding:** `p-6` consistently on all pages
- **Max content width:** `max-w-6xl` (1152px)

---

## 4. Typography Scale

| Element | Size | Weight | Font | Color |
|---------|------|--------|------|-------|
| Page title | 20px | 600 (semibold) | Manrope | `text-clinical-navy` |
| Page subtitle | 14px | 400 (regular) | Inter | `text-on-surface-variant` |
| Section header (in cards) | 14px | 600 (semibold) | Manrope | `text-text-medical-black` |
| Body text | 14px | 400 (regular) | Inter | `text-on-surface` |
| Labels/captions | 12px | 400 (regular) | Inter | `text-on-surface-variant` |
| Badge text | 12px | 500 (medium) | Inter | Per status color |
| Table header | 12px | 600 (semibold) | Inter | `text-on-surface-variant` uppercase |
| Nav items | 13px | 500 (medium) | Inter | Per state |
| Section labels (sidebar) | 11px | 500 (medium) | Inter | `text-on-surface-variant` uppercase |

---

## 5. Card Styling

All cards use consistent treatment:
- **Background:** White
- **Border:** `border border-surface-gray/60`
- **Border radius:** `rounded-xl` (12px)
- **Padding:** `p-5` (standard), `p-6` (detail views)
- **Shadow:** `shadow-sm`
- **Hover:** `hover:shadow-md transition-shadow` (for interactive cards)

---

## 6. Page Designs

### 6.1 Dashboard Page

**Header:**
```
Welcome back, Dr. {name}
Specialty · {experience} years
```
- Greeting: `text-lg font-semibold` (18px, Manrope)
- Subtitle: `text-sm text-on-surface-variant`

**Stats row (3 cards):**
- Icon: 40x40px rounded-lg with themed background
  - Appointments: `bg-evidence-blue-light text-clinical-navy`
  - Patients: `bg-healing-teal/10 text-healing-teal`
  - Pending: `bg-amber-50 text-amber-600`
- Value: `text-2xl font-bold` (24px, Manrope)
- Label: `text-xs text-on-surface-variant` (12px)
- Cards: Interactive with `hover:shadow-md`

**Today's Schedule (left column):**
- Card header: Calendar icon + "Today's Schedule" + date
- Each appointment: Avatar (36px) + name (14px semibold) + time (12px) + status badge
- Status badges: Rounded-full, colored backgrounds
- Empty state: Calendar icon (48px, 30% opacity) + message

**Pending Lab Reviews (right column):**
- Card header: FlaskConical icon + "Pending Lab Reviews" + "View all" link
- Each lab: Alert icon (36px circle) + lab name (14px) + patient + date (12px) + abnormal count
- Empty state: CheckCircle icon (48px, teal) + message

### 6.2 Cases Page

**Header:**
```
My Cases
View and manage your assigned diagnostic cases
```

**Tab filters:**
- Styled as pill buttons with count badges
- Active: `bg-clinical-navy text-white shadow-sm`
- Inactive: `bg-surface-container text-on-surface-variant hover:bg-surface-container-low`
- Each tab: "All (12)", "Pending (5)", "Opinion Written (7)"
- Padding: `px-4 py-2 rounded-lg text-sm font-medium`

**Data table:**
- Container: `rounded-xl border border-surface-gray/60 shadow-sm`
- Header row: `bg-surface-container-low` with `text-xs font-semibold uppercase tracking-wide`
- Rows: Clean borders, `hover:bg-surface-container-low`
- Patient column: Avatar + name (14px semibold) + email (12px muted)
- Status badges: Rounded-full, colored background, 12px font

### 6.3 Patients Page

**Header:**
```
My Patients
Patients you've consulted with
```

**Data table:**
- Patient column: Avatar (40px) + name (14px semibold) + email (12px)
- If no avatar: Initials in colored circle
- Appointments: Rounded-full badge, `bg-clinical-navy/10 text-clinical-navy`
- Last Visit: Formatted date, `text-sm text-on-surface-variant`

### 6.4 Lab Reviews Page

**Header:**
```
Pending Lab Reviews
Review and interpret patient lab results
```

**Data table:**
- Patient column: Avatar + name + email
- Lab Test: `text-sm font-medium text-text-medical-black`
- Date: `text-sm text-on-surface-variant`
- Abnormal: Badge `bg-error/10 text-error` if > 0, dash if 0
- Status: REVIEW_NEEDED → `bg-error/10 text-error`, Reviewed → `bg-healing-teal/10 text-healing-teal`

### 6.5 Schedule Page

**Header:**
```
Schedule
{count} upcoming appointment(s)
```

**Date groups:**
- Date header: `text-sm font-semibold text-text-medical-black` with subtle bottom border
- Appointments: Left-aligned timeline feel

**Appointment cards:**
- Avatar (40px) + name (14px semibold) + time (12px)
- Status badge: Same style as other pages
- Subtle left border accent matching status color
- Hover: Slight background shift

### 6.6 Case Detail Page

**Header:**
```
← Back to cases

Specialist Opinion                    [Status Badge]
Patient: {name} · Created {date}
```
- Back link: `text-sm text-on-surface-variant` with ArrowLeft icon, hover to teal
- Title: `text-xl font-semibold` (20px, Manrope)
- Status badge: Top-right aligned, rounded-full

**Uploaded Records section:**
- Card with `rounded-xl border border-surface-gray/60 shadow-sm p-5`
- Header: FileText icon + "Uploaded Records ({count})"
- Each record: File icon + filename (14px) + type + date (12px) + "View" link

**AI Pre-screen section:**
- Gradient: `bg-gradient-to-br from-evidence-blue-light/30 to-surface`
- Border: `border border-evidence-blue-light/60`
- Header: Blue dot + "AI Pre-screen"
- Content: `text-sm text-on-surface-variant leading-relaxed`
- Urgent flags: Amber box with warning icon

**Opinion form:**
- Card with `rounded-xl border border-surface-gray/60 shadow-sm p-6`
- Labels: `text-sm font-medium text-text-medical-black`
- Required: Red asterisk
- Textareas: `w-full px-3 py-2.5 text-sm border border-surface-gray rounded-xl`
- Focus: `focus:ring-2 focus:ring-clinical-navy/20 focus:border-clinical-navy`

**Action buttons:**
- "Save as Draft": `bg-surface hover:bg-surface-container-low text-on-surface-variant`
- "Sign & Submit": `bg-healing-teal text-white hover:bg-healing-teal/90`
- Sign confirmation: Inline with cancel option

**Signed opinion:**
- Card with CheckCircle icon + "Signed Opinion"
- Signed date: Calendar icon + date (12px)
- Sections: Title in `text-sm font-semibold text-clinical-navy`, body in `text-sm text-on-surface leading-relaxed`

---

## 7. Status Badges

Consistent across all pages:

| Status | Background | Text Color |
|--------|-----------|------------|
| OPEN | `bg-blue-50` | `text-blue-600` |
| AI_PRE_SCREENED | `bg-purple-50` | `text-purple-600` |
| UNDER_REVIEW | `bg-amber-50` | `text-amber-600` |
| OPINION_READY | `bg-healing-teal/10` | `text-healing-teal` |
| CLOSED | `bg-gray-100` | `text-gray-500` |
| DISPUTED | `bg-red-50` | `text-red-600` |
| SCHEDULED | `bg-clinical-navy/10` | `text-clinical-navy` |
| CONFIRMED | `bg-healing-teal/10` | `text-healing-teal` |
| REVIEW_NEEDED | `bg-error/10` | `text-error` |

Badge styling: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`

---

## 8. Empty States

Consistent pattern across all pages:
- Icon: 48px, 30% opacity (or 50% for success states)
- Title: `text-base font-semibold text-text-medical-black`
- Subtitle: `text-sm text-on-surface-variant`
- Centered layout with `py-12`

---

## 9. Files to Modify

| File | Changes |
|------|---------|
| `components/DoctorLayout.tsx` | Sidebar redesign, top bar updates, layout width |
| `app/doctor/page.tsx` | Dashboard stats, schedule, lab reviews sections |
| `app/doctor/cases/page.tsx` | Tab filters with counts, header styling |
| `app/doctor/cases/columns.tsx` | Table column styling refinements |
| `app/doctor/cases/[id]/page.tsx` | Case detail page redesign |
| `app/doctor/patients/page.tsx` | Header styling |
| `app/doctor/patients/columns.tsx` | Avatar initials, badge styling |
| `app/doctor/labs/review/page.tsx` | Header styling |
| `app/doctor/labs/review/columns.tsx` | Badge styling refinements |
| `app/doctor/schedule/page.tsx` | Consistent padding, date group styling |

---

## 10. Design Tokens Reference

From `app/globals.css`:
- `clinical-navy`: #1D4ED8
- `healing-teal`: #00A3AD
- `text-medical-black`: #0F172A
- `surface-gray`: #F1F5F9
- `evidence-blue-light`: #DBEAFE
- `surface-container-low`: #f8fafc
- `surface-container`: #eceef0
- `on-surface-variant`: #42474f
- `error`: #ba1a1a
