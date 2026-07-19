### Task 2: Synthesis Schema + Prompt

**Files:**
- Create: `lib/ai/prompts/synthesis.ts`
- Test: Add tests to `__tests__/unit/prompts.test.ts`

- [ ] **Step 1: Write failing test for synthesisSchema**

Add to `__tests__/unit/prompts.test.ts`:

```typescript
import { synthesisSchema } from "@/lib/ai/prompts/synthesis";

describe("Synthesis Schema", () => {
  it("validates a correct synthesis output", () => {
    const result = synthesisSchema.safeParse({
      summary: "Both specialists agree on the primary findings of mild cardiomegaly.",
      agreements: ["Mild cardiomegaly present", "No pleural effusion"],
      disagreements: ["Specialist A noted hypertension, Specialist B did not mention it"],
      confidence: "high",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty agreements array", () => {
    const result = synthesisSchema.safeParse({
      summary: "test summary here for minimum length requirement",
      agreements: [],
      disagreements: [],
      confidence: "medium",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid confidence level", () => {
    const result = synthesisSchema.safeParse({
      summary: "test summary here for minimum length requirement",
      agreements: ["test"],
      disagreements: [],
      confidence: "very_high",
    });
    expect(result.success).toBe(false);
  });

  it("allows empty disagreements array", () => {
    const result = synthesisSchema.safeParse({
      summary: "All specialists agree on the findings and recommendations.",
      agreements: ["Finding 1", "Finding 2"],
      disagreements: [],
      confidence: "high",
    });
    expect(result.success).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/unit/prompts.test.ts`
Expected: FAIL — `synthesisSchema` not found

- [ ] **Step 3: Create synthesis schema and prompt**

Create `lib/ai/prompts/synthesis.ts`:

```typescript
import { z } from "zod";

export const synthesisSchema = z.object({
  summary: z.string().min(50).describe("Consensus summary of all opinions"),
  agreements: z.array(z.string()).min(1).describe("Areas where specialists agree"),
  disagreements: z.array(z.string()).describe("Areas where specialists disagree"),
  confidence: z.enum(["low", "medium", "high"]),
});

export type SynthesisResult = z.infer<typeof synthesisSchema>;

export const synthesisSystemPrompt = `You are a medical synthesis assistant. Your role is to identify areas of agreement and disagreement across multiple specialist opinions for the same case.

ANALYZE the specialist opinions and produce a structured synthesis.

RULES:
- You are NOT diagnosing. You are synthesizing what specialists have stated.
- Highlight areas of consensus first, then areas of divergence.
- If opinions conflict, present both perspectives neutrally.
- Be concise but thorough — every significant disagreement should be noted.
- If all opinions agree, state that clearly with an empty disagreements array.

OUTPUT FORMAT:
- summary: Consensus summary of all opinions (2-3 paragraphs)
- agreements: Areas where specialists agree (bullet points)
- disagreements: Areas where specialists disagree (bullet points, empty if all agree)
- confidence: Your confidence in the synthesis (low/medium/high)`;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run __tests__/unit/prompts.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/ai/prompts/synthesis.ts __tests__/unit/prompts.test.ts
git commit -m "feat: add synthesis Zod schema and system prompt"
```
