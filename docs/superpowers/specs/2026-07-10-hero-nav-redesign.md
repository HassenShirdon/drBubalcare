# Hero & Navigation Redesign — Clinical Authority

**Date:** 2026-07-10
**Status:** Approved
**Scope:** `app/page.tsx` only

## Problem

The current hero and navigation feel generic — oversized headline (`text-6xl`), excessive vertical spacing (`pt-40 pb-28`, `min-h-[85vh]`), gradient blobs/blur effects, and a tab-based nav with anchor links. The patient/physician entry cards in the hero add visual weight without clarity.

## Direction

**Premium medical / Clinical Authority** — clean, authoritative, clinical. Like Mayo Clinic or Cleveland Clinic. Smaller type, tighter spacing, more whitespace breathing room.

## Changes

### Navigation (`app/page.tsx:81-127`)

| Before | After |
|---|---|
| `py-4` with `backdrop-blur-md` | `h-16` solid white, no blur |
| Tab-state anchor links (`#services`, `#about`) | Simple `<Link>` center nav |
| Two CTA buttons (Patient + Physician) | Single "Patient Portal" CTA |
| `text-xl` logo | `text-lg` logo |
| `useState` for `activeTab` | Remove state entirely |

**Final nav structure:**
```
[Logo: "Dr Bubal Care"]     [Services · About · Doctors · News]     [Patient Portal]
```

- Logo: `font-headline-md text-lg font-semibold text-clinical-navy`
- Links: `font-label-md text-sm text-on-surface-variant hover:text-clinical-navy transition-colors`
- CTA: `bg-clinical-navy text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-primary-container transition-all`
- Border: `border-b border-surface-gray/50`

### Hero (`app/page.tsx:132-168`)

| Before | After |
|---|---|
| `text-3xl md:text-5xl lg:text-6xl` headline | `text-4xl md:text-5xl` headline |
| `pt-40 pb-28` | `pt-32 pb-20` |
| `min-h-[85vh]` | `min-h-[70vh]` |
| Gradient blobs + `blur-3xl` | Minimal — subtle `from-evidence-blue-light/20` or plain white |
| Two service cards in hero | Remove entirely |

**Final hero structure:**
```
     [Badge pill]

Global Medical Coordination,
    Precision Delivered.

Connecting diaspora patients and referring
physicians to world-class specialists.

            [Get Started →]
```

- Badge: `bg-evidence-blue-light text-clinical-navy text-xs font-medium px-3 py-1 rounded-full`
- Headline: `text-4xl md:text-5xl font-semibold text-text-medical-black tracking-tight leading-tight`
- Subtitle: `text-base md:text-lg text-on-surface-variant/80 max-w-xl mx-auto`
- CTA: `bg-clinical-navy text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-primary-container transition-all` with ArrowRight icon

### Removed Elements

- Patient/Physician service cards from hero (the "Who We Serve" section at line 171 already covers this)
- `activeTab` state variable
- Anchor `<a>` links in nav
- Second CTA button ("Physician Portal")
- `bg-gradient-to-b from-evidence-blue-light/40 via-white to-white` background
- `bg-gradient-to-b from-white to-white` overlay
- `blur-3xl` decorative circle
- `animate-in fade-in zoom-in` classes (if present)

## Files Modified

- `app/page.tsx` — single file, all changes

## Verification

- Dev server starts without errors
- Nav renders with logo, 4 links, 1 CTA
- Hero renders headline + subtitle + single CTA
- Patient/Physician cards no longer appear in hero
- "Who We Serve" section still renders correctly below
- All existing page functionality preserved
