### Task 12: Lab Result Creation + Trend Trigger

**Files:**
- Modify: `app/api/lab-results/route.ts` (add POST handler)
- Create: `app/api/ai/trends/[patientId]/analyze/route.ts` (trigger endpoint)
- Consumes: `lib/ai/trends.ts`

- [ ] **Step 1: Add POST handler to lab-results route**

Add to `app/api/lab-results/route.ts` (after the existing GET handler):

```typescript
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const body = await request.json();

  const { name, date, doctor, metrics } = body;

  if (!name || !date || !doctor || !metrics || !Array.isArray(metrics)) {
    return NextResponse.json(
      { error: "name, date, doctor, and metrics array are required" },
      { status: 400 }
    );
  }

  const labResult = await prisma.labResult.create({
    data: {
      patientId: userId,
      name,
      date: new Date(date),
      doctor,
      icon: "lab",
      metrics: {
        create: metrics.map((m: { name: string; value: number; unit: string; referenceRange: string; status?: string }) => ({
          name: m.name,
          value: m.value,
          unit: m.unit,
          referenceRange: m.referenceRange,
          status: (m.status || "NORMAL") as "NORMAL" | "HIGH" | "LOW",
        })),
      },
    },
    include: { metrics: true },
  });

  // Trigger trend analysis (fire and forget)
  fetch(`${process.env.NEXTAUTH_URL}/api/ai/trends/${userId}/analyze`, {
    method: "POST",
    headers: {
      "x-internal-secret": process.env.INTERNAL_API_SECRET || "",
    },
  }).catch((err) => console.error("Trend analysis trigger failed:", err));

  return NextResponse.json(labResult, { status: 201 });
}
```

- [ ] **Step 2: Create trend analysis trigger endpoint**

Create `app/api/ai/trends/[patientId]/analyze/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { generateTrendAnalysis } from "@/lib/ai/trends";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ patientId: string }> }
) {
  const secret = request.headers.get("x-internal-secret");
  if (secret !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { patientId } = await params;

  try {
    const analyses = await generateTrendAnalysis(patientId);
    return NextResponse.json({ analyzed: analyses.length });
  } catch (error) {
    console.error("Trend analysis failed:", error);
    return NextResponse.json(
      { error: "Trend analysis failed" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add app/api/lab-results/route.ts app/api/ai/trends/[patientId]/analyze/route.ts
git commit -m "feat: add lab result creation with trend analysis trigger"
```
