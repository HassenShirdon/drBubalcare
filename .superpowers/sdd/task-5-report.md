# Task 5: Update Problem Section — Report

**Status:** Complete

**Commit:** `2fcedd7` — `feat: rewrite problem section with emotional copy and bridge line`

**Changes made to `components/landing-page/problem-section.tsx`:**
1. Replaced headline: "The specialist care gap is real"
2. Replaced subheadline: "Patients in underserved regions face impossible choices..."
3. Replaced three cards with emotional copy ("The Access Gap", "The Travel Burden", "The Wait")
4. Changed card accent from top teal bar (`h-1 w-10 rounded-full bg-healing-teal`) to left-border accent (`border-l-4 border-healing-teal`)
5. Added bridge line below cards: "There's a better way." with animated `ChevronDown` icon
6. Imported `ChevronDown` from `lucide-react`

**Verification:**
- TypeScript: No compilation errors from the component (pre-existing test errors unrelated)
- Visual: Cards render with left border, bridge line with bouncing chevron appears below
