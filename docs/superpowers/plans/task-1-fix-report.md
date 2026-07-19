# Fix Report: DoctorSidebar Component

**Date:** 2026-07-19  
**Component:** `components/DoctorLayout.tsx`

## Issues Fixed

### 1. Double Logo on Mobile Sidebar
**Root Cause:** The `SidebarContent` component included the logo block, and the mobile overlay also rendered its own logo header, causing the logo to appear twice when the mobile sidebar was open.

**Fix:**  
- Added a `showLogo` prop to `SidebarContent` (default `true`).  
- Desktop sidebar passes `showLogo={true}` (logo rendered).  
- Mobile overlay passes `showLogo={false}` (logo omitted; mobile header already shows logo with close button).  
- Adjusted `SidebarContent` width from fixed `w-64` to `w-full` to fill parent container.

### 2. Dead `isActive` Variable
**Root Cause:** The `isActive` variable was computed on every render inside the `navItems.map()` callback but never used in the returned JSX.

**Fix:**  
- Imported `usePathname` from `next/navigation`.  
- Computed `isActive` using the current pathname: exact match for dashboard (`/doctor`), prefix match for other routes.  
- Applied conditional className to links: active links receive `bg-surface-container-low text-clinical-navy`, inactive links retain default hover styles.

## Verification
- TypeScript compilation (`npx tsc --noEmit`) passed with no errors.
- Manual review of component structure confirms no visual regressions.

## Commit
- **Hash:** `2820364`
- **Message:** `fix: resolve double logo on mobile and wire up active state detection`