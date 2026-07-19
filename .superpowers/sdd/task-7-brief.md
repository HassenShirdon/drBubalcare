### Task 7: Follow-up Q&A Module

**Files:**
- Create: `lib/ai/followup.ts`
- Consumes: `lib/ai/prompts/followup.ts`, `lib/ai/phi-stripper.ts`, `lib/ai/client.ts`

- [ ] **Step 1: Create follow-up Q&A module**

Create `lib/ai/followup.ts`:

```typescript
import { streamObject } from "ai";
import { openaiModel } from "./client";
import { stripPHI } from "./phi-stripper";
import { followupSchema, followupSystemPrompt } from "./prompts/followup";
import { prisma } from "@/lib/db";

/**
 * Answer a patient's follow-up question about a specialist opinion.
 * Streams the result via SSE. Saves to FollowUpQuestion table.
 */
export async function answerFollowUp(opinionId: string, question: string) {
  const opinion = await prisma.specialistOpinion.findUnique({
    where: { id: opinionId },
    include: {
      case: true,
      plainSummary: true,
    },
  });

  if (!opinion) {
    throw new Error(`Opinion not found: ${opinionId}`);
  }

  if (opinion.status !== "SIGNED") {
    throw new Error(`Opinion must be signed before answering follow-ups. Current status: ${opinion.status}`);
  }

  // Strip PHI from opinion content
  const sanitizedContent = stripPHI(opinion.content);
  const sanitizedQuestion = stripPHI(question);

  const result = streamObject({
    model: openaiModel,
    schema: followupSchema,
    system: followupSystemPrompt,
    prompt: `Specialist's Opinion:\n${sanitizedContent}\n\nPatient's Question: ${sanitizedQuestion}`,
    onFinish: async ({ object }) => {
      if (object) {
        await prisma.followUpQuestion.create({
          data: {
            opinionId,
            question: sanitizedQuestion,
            answer: object.answer,
            scopeNote: object.scopeNote,
          },
        });
      }
    },
  });

  return result.toTextStreamResponse();
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit lib/ai/followup.ts`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add lib/ai/followup.ts
git commit -m "feat: add follow-up Q&A module"
```
