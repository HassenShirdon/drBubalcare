### Task 6: Follow-up Q&A Schema + Prompt

**Files:**
- Create: `lib/ai/prompts/followup.ts`
- Test: Add tests to `__tests__/unit/prompts.test.ts`

- [ ] **Step 1: Write failing test for followupSchema**

Add to `__tests__/unit/prompts.test.ts`:

```typescript
import { followupSchema } from "@/lib/ai/prompts/followup";

describe("Follow-up Schema", () => {
  it("validates a correct follow-up output", () => {
    const result = followupSchema.safeParse({
      answer: "Based on the specialist's report, your heart size is slightly larger than normal.",
      scopeNote: null,
      confidence: "high",
      inScope: true,
    });
    expect(result.success).toBe(true);
  });

  it("validates out-of-scope response", () => {
    const result = followupSchema.safeParse({
      answer: "I cannot provide information about treatment options.",
      scopeNote: "This question requires clinical judgment beyond the documented findings.",
      confidence: "high",
      inScope: false,
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty answer", () => {
    const result = followupSchema.safeParse({
      answer: "",
      scopeNote: null,
      confidence: "medium",
      inScope: true,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid confidence level", () => {
    const result = followupSchema.safeParse({
      answer: "This is a valid answer with enough length.",
      scopeNote: null,
      confidence: "very_high",
      inScope: true,
    });
    expect(result.success).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/unit/prompts.test.ts`
Expected: FAIL — `followupSchema` not found

- [ ] **Step 3: Create follow-up schema and prompt**

Create `lib/ai/prompts/followup.ts`:

```typescript
import { z } from "zod";

export const followupSchema = z.object({
  answer: z.string().min(20).describe("Answer to the patient's question"),
  scopeNote: z.string().nullable().describe("Explanation if question was out of scope"),
  confidence: z.enum(["low", "medium", "high"]),
  inScope: z.boolean().describe("Whether the question was within the opinion's scope"),
});

export type FollowupResult = z.infer<typeof followupSchema>;

export const followupSystemPrompt = `You are a follow-up assistant for a medical diagnostic platform. A patient has received a specialist's written opinion and is asking a follow-up question.

ANSWER the patient's question based ONLY on the content of the specialist's written opinion.

RULES:
- Answer ONLY based on the content of the specialist's written opinion.
- If the question asks for diagnosis, treatment changes, or information not in the opinion, set inScope to false and explain the limitation.
- Never provide medical advice beyond what the specialist documented.
- If inScope is false, suggest the patient book a direct consultation.
- Be warm and clear — the patient may be anxious.
- Always include a disclaimer that this is an AI-generated response.

SCOPE BOUNDARIES (inScope = false):
- Questions about diagnosis or prognosis not addressed in the opinion
- Questions about treatment or medication changes
- Questions about symptoms not mentioned in the opinion
- Requests for second opinions or specialist referrals
- Any question requiring clinical judgment beyond the documented findings

OUTPUT FORMAT:
- answer: Your response to the patient's question
- scopeNote: If inScope is false, explain why and suggest booking a consultation. If inScope is true, set to null.
- confidence: Your confidence in the answer (low/medium/high)
- inScope: Whether the question was within the opinion's documented scope`;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run __tests__/unit/prompts.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/ai/prompts/followup.ts __tests__/unit/prompts.test.ts
git commit -m "feat: add follow-up Q&A Zod schema and system prompt"
```
