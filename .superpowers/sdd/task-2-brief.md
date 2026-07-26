### Task 2: Create Trust Bar Component

**Files:**
- Create: `components/landing-page/trust-bar.tsx`
- Test: `__tests__/components/landing-trust-bar.test.tsx`

**Interfaces:**
- Produces: `<TrustBar />` component (server component, no props)

- [ ] **Step 1: Create trust-bar.tsx**

```tsx
import { Shield, Award, Clock } from "lucide-react";

export function TrustBar() {
  return (
    <div className="bg-clinical-navy text-white text-xs py-1.5 hidden md:block">
      <div className="max-w-7xl mx-auto px-6 md:px-16 flex items-center justify-center gap-6">
        <span className="flex items-center gap-1.5">
          <Shield className="w-3 h-3" />
          HIPAA Compliant
        </span>
        <span className="flex items-center gap-1.5">
          <Award className="w-3 h-3" />
          Board-Certified Specialists
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          24-48h Turnaround
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write test for TrustBar**

```tsx
import { render, screen } from "@testing-library/react";
import { TrustBar } from "@/components/landing-page/trust-bar";

describe("TrustBar", () => {
  it("renders all three trust points", () => {
    render(<TrustBar />);
    expect(screen.getByText("HIPAA Compliant")).toBeInTheDocument();
    expect(screen.getByText("Board-Certified Specialists")).toBeInTheDocument();
    expect(screen.getByText("24-48h Turnaround")).toBeInTheDocument();
  });

  it("is hidden on mobile", () => {
    render(<TrustBar />);
    const bar = screen.getByText("HIPAA Compliant").closest("div")!;
    expect(bar.className).toContain("hidden");
    expect(bar.className).toContain("md:block");
  });
});
```

- [ ] **Step 3: Run test**

Run: `npx vitest run __tests__/components/landing-trust-bar.test.tsx`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add components/landing-page/trust-bar.tsx __tests__/components/landing-trust-bar.test.tsx
git commit -m "feat: add trust bar component above navigation"
```

---


