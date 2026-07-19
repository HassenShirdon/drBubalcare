### Task 8: Follow-up Q&A API Route

**Files:**
- Create: `app/api/ai/followup/route.ts`
- Consumes: `lib/ai/followup.ts`

- [ ] **Step 1: Create follow-up API route**

Create `app/api/ai/followup/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { answerFollowUp } from "@/lib/ai/followup";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { opinionId, question } = body;

  if (!opinionId || !question) {
    return NextResponse.json(
      { error: "opinionId and question are required" },
      { status: 400 }
    );
  }

  try {
    const response = await answerFollowUp(opinionId, question);
    return response;
  } catch (error) {
    console.error("Follow-up Q&A failed:", error);
    return NextResponse.json(
      { error: "Follow-up Q&A failed" },
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
git add app/api/ai/followup/route.ts
git commit -m "feat: add follow-up Q&A API route"
```
