### Task 3: Update Navigation Component

**Files:**
- Modify: `components/landing-page/navigation.tsx`

**Interfaces:**
- Consumes: `<TrustBar />` from Task 2

- [ ] **Step 1: Read current navigation.tsx**

Read `components/landing-page/navigation.tsx` to understand current structure.

- [ ] **Step 2: Update CTA button text**

Change the CTA button text from "Start a Case" to "Start Your Case â†’". Find the button element and update the text content.

- [ ] **Step 3: Add pulse animation on CTA hover**

Add a hover state to the CTA button that triggers a subtle scale animation. Add to the button className: `active:scale-95 transition-transform duration-150`.

- [ ] **Step 4: Import and render TrustBar above navigation**

Import `TrustBar` from `./trust-bar`. Wrap the component return in a fragment, placing `<TrustBar />` before the `<nav>` element:

```tsx
import { TrustBar } from "./trust-bar";

// In the return:
return (
  <>
    <TrustBar />
    <nav className="fixed top-0 md:top-[32px] w-full z-50 h-16 md:h-16 ...">
      {/* existing nav content */}
    </nav>
  </>
);
```

Note: When TrustBar is visible (md+), the nav needs `top-[32px]` (the trust bar height) instead of `top-0`. Use `md:top-[32px] top-0` on the nav.

- [ ] **Step 5: Verify visually**

Run: `npm run dev` and check that:
- Trust bar appears above nav on desktop
- Nav is positioned below trust bar
- On mobile, trust bar is hidden and nav is at top
- CTA shows "Start Your Case â†’"

- [ ] **Step 6: Commit**

```bash
git add components/landing-page/navigation.tsx
git commit -m "feat: integrate trust bar and update nav CTA"
```

---


