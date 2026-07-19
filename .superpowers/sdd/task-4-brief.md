### Task 4: Synthesis API Route

**Files:**
- Create: `app/api/ai/synthesis/[caseId]/route.ts`
- Consumes: `lib/ai/synthesis.ts`

- [ ] **Step 1: Create synthesis API route**

Create `app/api/ai/synthesis/[caseId]/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { generateSynthesis } from "@/lib/ai/synthesis";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ caseId: string }> }
) {
  const secret = request.headers.get("x-internal-secret");
  if (secret !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { caseId } = await params;

  try {
    const response = await generateSynthesis(caseId);
    return response;
  } catch (error) {
    console.error("Synthesis generation failed:", error);
    return NextResponse.json(
      { error: "Synthesis generation failed" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add app/api/ai/synthesis/[caseId]/route.ts
git commit -m "feat: add synthesis API route"
```
