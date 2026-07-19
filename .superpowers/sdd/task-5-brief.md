### Task 5: Synthesis Trigger in Opinion Signing

**Files:**
- Modify: `app/api/doctor/cases/[id]/opinion/route.ts:80-93`

- [ ] **Step 1: Add synthesis trigger after opinion signing**

In `app/api/doctor/cases/[id]/opinion/route.ts`, after the existing summary trigger (line 92), add the synthesis trigger. The full `if (body.sign)` block should become:

```typescript
  if (body.sign) {
    await prisma.case.update({
      where: { id },
      data: { status: 'OPINION_READY' },
    });

    // Trigger plain-language summary generation after opinion signing (fire and forget)
    fetch(`${process.env.NEXTAUTH_URL}/api/ai/summary/${opinion.id}`, {
      method: "POST",
      headers: {
        "x-internal-secret": process.env.INTERNAL_API_SECRET || "",
      },
    }).catch((err) => console.error("Summary generation trigger failed:", err));

    // Check if case now has 2+ signed opinions — trigger synthesis (fire and forget)
    const signedOpinionCount = await prisma.specialistOpinion.count({
      where: { caseId: id, status: "SIGNED" },
    });

    if (signedOpinionCount >= 2) {
      // Check if synthesis already exists
      const existingSynthesis = await prisma.opinionSynthesis.findUnique({
        where: { caseId: id },
      });

      if (!existingSynthesis) {
        fetch(`${process.env.NEXTAUTH_URL}/api/ai/synthesis/${id}`, {
          method: "POST",
          headers: {
            "x-internal-secret": process.env.INTERNAL_API_SECRET || "",
          },
        }).catch((err) => console.error("Synthesis trigger failed:", err));
      }
    }
  }
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add app/api/doctor/cases/[id]/opinion/route.ts
git commit -m "feat: trigger synthesis when case has 2+ signed opinions"
```
