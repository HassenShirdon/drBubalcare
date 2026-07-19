### Task 3: Synthesis Module

**Files:**
- Create: `lib/ai/synthesis.ts`
- Consumes: `lib/ai/prompts/synthesis.ts`, `lib/ai/phi-stripper.ts`, `lib/ai/client.ts`

- [ ] **Step 1: Create synthesis module**

Create `lib/ai/synthesis.ts`:

```typescript
import { streamObject } from "ai";
import { openaiModel } from "./client";
import { stripPHI } from "./phi-stripper";
import { synthesisSchema, synthesisSystemPrompt } from "./prompts/synthesis";
import { prisma } from "@/lib/db";

const WATERMARK = "AI-Generated Draft — requires specialist review";

/**
 * Generate a multi-opinion synthesis for a case with 2+ signed opinions.
 * Streams the result via SSE. Saves to OpinionSynthesis table.
 */
export async function generateSynthesis(caseId: string) {
  const caseRecord = await prisma.case.findUnique({
    where: { id: caseId },
    include: {
      opinions: {
        where: { status: "SIGNED" },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!caseRecord) {
    throw new Error(`Case not found: ${caseId}`);
  }

  if (caseRecord.opinions.length < 2) {
    throw new Error(`Case needs at least 2 signed opinions for synthesis. Found: ${caseRecord.opinions.length}`);
  }

  // Check if synthesis already exists
  const existingSynthesis = await prisma.opinionSynthesis.findUnique({
    where: { caseId },
  });

  if (existingSynthesis) {
    throw new Error(`Synthesis already exists for case: ${caseId}`);
  }

  // Build combined opinion context (PHI-stripped)
  const opinionContext = caseRecord.opinions
    .map((opinion, index) => {
      const strippedContent = stripPHI(opinion.content);
      return `--- Specialist Opinion ${index + 1} (ID: ${opinion.id}) ---\n${strippedContent}`;
    })
    .join("\n\n");

  const caseDescription = stripPHI(caseRecord.description || "No case description provided.");

  const result = streamObject({
    model: openaiModel,
    schema: synthesisSchema,
    system: synthesisSystemPrompt,
    prompt: `Case Description: ${caseDescription}\n\nSpecialist Opinions:\n${opinionContext}`,
    onFinish: async ({ object }) => {
      if (object) {
        await prisma.opinionSynthesis.create({
          data: {
            caseId,
            content: `${WATERMARK}\n\n${object.summary}`,
            agreements: object.agreements,
            disagreements: object.disagreements,
            status: "GENERATED",
          },
        });
      }
    },
  });

  return result.toTextStreamResponse();
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit lib/ai/synthesis.ts`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add lib/ai/synthesis.ts
git commit -m "feat: add multi-opinion synthesis module"
```
