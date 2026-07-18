### Task 11: Navigation Updates

**Files:**
- Modify: `components/PatientLayout.tsx` (add Cases nav item)
- Modify: `app/admin/layout.tsx` (add Cases nav item — may already exist)

**Interfaces:**
- Consumes: existing layout navigation patterns
- Produces: updated navigation with all Phase 2 sections

- [ ] **Step 1: Check existing navigation**

Read `components/PatientLayout.tsx` — does it have a "My Cases" nav item?
Read `app/admin/layout.tsx` — does it have a "Cases" nav item?
Read `components/DoctorLayout.tsx` — does it have a "My Cases" nav item?

- [ ] **Step 2: Add "My Cases" to PatientLayout if missing**

```tsx
{
  href: "/patient/cases",
  label: "My Cases",
  icon: Briefcase,
}
```

Add `Briefcase` to the lucide-react imports.

- [ ] **Step 3: Verify admin and doctor navigation**

Verify admin has "Cases" nav item. Verify doctor has "My Cases" nav item.

- [ ] **Step 4: Test navigation**

Run: `npx next dev --turbopack`
Test: Patient, Doctor, and Admin layouts all show correct nav items
Test: Active state styling works correctly

- [ ] **Step 5: Commit**

```bash
git add components/PatientLayout.tsx
git commit -m "feat: add My Cases navigation to patient layout"
```
