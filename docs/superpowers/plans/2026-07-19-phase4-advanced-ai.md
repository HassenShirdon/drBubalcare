# Phase 4: Advanced AI Features — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add multi-opinion synthesis, follow-up Q&A, and result trend analysis AI features to the Dr. Bubal Care platform.

**Architecture:** Direct extension of existing Phase 3 patterns — each feature gets its own Zod schema + prompt file, AI module, and API route. Uses OpenAI via Vercel AI SDK (`ai` + `@ai-sdk/openai`), Prisma ORM, and Zod validation. All outputs watermarked as "AI-Generated Draft."

**Tech Stack:** Next.js 15, TypeScript, Prisma, OpenAI (gpt-4o via Vercel AI SDK), Zod, Vitest

## Global Constraints

- All AI outputs watermarked as "AI-Generated Draft — requires specialist review"
- PHI stripped before any LLM call via `lib/ai/phi-stripper.ts`
- All API routes use existing auth patterns (x-internal-secret for internal, session for patient-facing)
- Follow existing code conventions: `streamObject` for streaming, `generateObject` for non-streaming
- Tests use Vitest with vi.mock pattern

---

## File Structure

```
lib/ai/
  synthesis.ts          # Multi-opinion synthesis module (CREATE)
  followup.ts           # Follow-up Q&A module (CREATE)
  trends.ts             # Result trend analysis module (CREATE)
  prompts/
    synthesis.ts        # Synthesis Zod schema + prompt (CREATE)
    followup.ts         # Follow-up Zod schema + prompt (CREATE)
    trends.ts           # Trends Zod schema + prompt (CREATE)

app/api/ai/
  synthesis/[caseId]/route.ts   # Synthesis endpoint (CREATE)
  followup/route.ts             # Follow-up Q&A endpoint (CREATE)
  trends/[patientId]/route.ts   # Trend analysis GET endpoint (CREATE)
  trends/[patientId]/analyze/route.ts  # Trend analysis POST trigger (CREATE)

app/api/lab-results/
  route.ts                      # Add POST for lab result creation + trend trigger (MODIFY)

prisma/
  schema.prisma        # Add new models + relations (MODIFY)

app/api/doctor/cases/[id]/opinion/route.ts  # Add synthesis trigger (MODIFY)

__tests__/
  unit/prompts.test.ts          # Add schema tests (MODIFY)
  integration/ai-routes.test.ts # Add route tests (MODIFY)
  unit/trends.test.ts           # Trend detection tests (CREATE)
```

---

### Task 1: Database Schema — New Models

**Files:**
- Modify: `prisma/schema.prisma`
- Test: Run `npx prisma validate` and `npx prisma generate`

- [ ] **Step 1: Add SynthesisStatus enum to schema.prisma**

Add after the existing `ServiceType` enum:

```prisma
enum SynthesisStatus {
  PENDING
  GENERATED
  DELIVERED
}
```

- [ ] **Step 2: Add OpinionSynthesis model to schema.prisma**

Add after the `AIPrescreen` model:

```prisma
model OpinionSynthesis {
  id            String           @id @default(cuid())
  caseId        String           @unique
  content       String           @db.Text
  agreements    String[]
  disagreements String[]
  status        SynthesisStatus  @default(PENDING)
  generatedAt   DateTime         @default(now())

  case          Case             @relation(fields: [caseId], references: [id], onDelete: Cascade)
}
```

- [ ] **Step 3: Add TrendAnalysis model to schema.prisma**

Add after the `OpinionSynthesis` model:

```prisma
model TrendAnalysis {
  id          String   @id @default(cuid())
  patientId   String
  metricName  String
  dataPoints  Json
  trend       String
  significant Boolean  @default(false)
  summary     String
  generatedAt DateTime @default(now())

  patient     User     @relation(fields: [patientId], references: [id], onDelete: Cascade)

  @@unique([patientId, metricName])
}
```

- [ ] **Step 4: Add relations to existing Case model**

Add `synthesis` field to the Case model (after the `aiPrescreens` field):

```prisma
model Case {
  // ... existing fields ...
  synthesis OpinionSynthesis?
}
```

- [ ] **Step 5: Add relation to existing User model**

Add `trendAnalyses` field to the User model (after the `auditLogs` field):

```prisma
model User {
  // ... existing fields ...
  trendAnalyses TrendAnalysis[]
}
```

- [ ] **Step 6: Validate and generate Prisma client**

Run: `npx prisma validate && npx prisma generate`
Expected: No errors, client generated successfully

- [ ] **Step 7: Commit**

```bash
git add prisma/schema.prisma lib/generated
git commit -m "feat: add OpinionSynthesis and TrendAnalysis models to schema"
```

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

### Task 9: Trends Schema + Prompt

**Files:**
- Create: `lib/ai/prompts/trends.ts`
- Test: Add tests to `__tests__/unit/prompts.test.ts`

- [ ] **Step 1: Write failing test for trendAnalysisSchema**

Add to `__tests__/unit/prompts.test.ts`:

```typescript
import { trendAnalysisSchema } from "@/lib/ai/prompts/trends";

describe("Trend Analysis Schema", () => {
  it("validates a correct trend analysis output", () => {
    const result = trendAnalysisSchema.safeParse({
      metricName: "Glucose",
      trend: "rising",
      significant: true,
      summary: "Your glucose levels have been rising over the last 3 tests.",
      dataPoints: [
        { date: "2026-01-01", value: 95, unit: "mg/dL", referenceRange: "70-100", status: "NORMAL" },
        { date: "2026-03-01", value: 110, unit: "mg/dL", referenceRange: "70-100", status: "HIGH" },
        { date: "2026-06-01", value: 125, unit: "mg/dL", referenceRange: "70-100", status: "HIGH" },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("validates stable trend", () => {
    const result = trendAnalysisSchema.safeParse({
      metricName: "Creatinine",
      trend: "stable",
      significant: false,
      summary: "Your creatinine levels have remained stable.",
      dataPoints: [
        { date: "2026-01-01", value: 1.0, unit: "mg/dL", referenceRange: "0.7-1.3", status: "NORMAL" },
        { date: "2026-06-01", value: 1.1, unit: "mg/dL", referenceRange: "0.7-1.3", status: "NORMAL" },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid trend value", () => {
    const result = trendAnalysisSchema.safeParse({
      metricName: "Glucose",
      trend: "increasing",
      significant: true,
      summary: "test summary",
      dataPoints: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing metricName", () => {
    const result = trendAnalysisSchema.safeParse({
      trend: "stable",
      significant: false,
      summary: "test",
      dataPoints: [],
    });
    expect(result.success).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/unit/prompts.test.ts`
Expected: FAIL — `trendAnalysisSchema` not found

- [ ] **Step 3: Create trends schema and prompt**

Create `lib/ai/prompts/trends.ts`:

```typescript
import { z } from "zod";

export const trendAnalysisSchema = z.object({
  metricName: z.string(),
  trend: z.enum(["rising", "falling", "stable", "fluctuating"]),
  significant: z.boolean(),
  summary: z.string().describe("Plain-language explanation of the trend"),
  dataPoints: z.array(z.object({
    date: z.string(),
    value: z.number(),
    unit: z.string(),
    referenceRange: z.string(),
    status: z.enum(["NORMAL", "HIGH", "LOW"]),
  })),
});

export type TrendAnalysisResult = z.infer<typeof trendAnalysisSchema>;

export const trendAnalysisSystemPrompt = `You are a lab result trend analyst. You analyze longitudinal lab data and identify significant trends for patient monitoring.

ANALYZE the lab data points and produce a structured trend analysis.

RULES:
- You are NOT diagnosing. You are describing statistical trends in lab values.
- "Significant" means: trend direction changed, OR 2+ consecutive values outside reference range, OR consistent upward/downward trajectory over 3+ data points.
- Be specific about direction and magnitude.
- Use plain language — the patient will read this.
- If only 2 data points exist, note that the trend is preliminary.

TREND CLASSIFICATION:
- rising: Consistent upward trajectory (2+ consecutive increases)
- falling: Consistent downward trajectory (2+ consecutive decreases)
- stable: No significant change (values within similar range)
- fluctuating: Up and down movement without clear direction

OUTPUT FORMAT:
- metricName: Name of the lab metric (e.g., "Glucose", "Creatinine")
- trend: Trend direction (rising/falling/stable/fluctuating)
- significant: Whether this trend is clinically significant
- summary: Plain-language explanation of the trend
- dataPoints: Array of data points with date, value, unit, referenceRange, and status`;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run __tests__/unit/prompts.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/ai/prompts/trends.ts __tests__/unit/prompts.test.ts
git commit -m "feat: add trend analysis Zod schema and system prompt"
```

---

### Task 10: Trend Detection Logic (No LLM)

**Files:**
- Create: `lib/ai/trends.ts` (detection logic only)
- Create: `__tests__/unit/trends.test.ts`

- [ ] **Step 1: Write failing tests for trend detection**

Create `__tests__/unit/trends.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { analyzeTrend } from "@/lib/ai/trends";

describe("analyzeTrend", () => {
  it("returns stable for single data point", () => {
    const result = analyzeTrend([
      { value: 100, status: "NORMAL" },
    ]);
    expect(result.trend).toBe("stable");
    expect(result.significant).toBe(false);
  });

  it("detects rising trend", () => {
    const result = analyzeTrend([
      { value: 90, status: "NORMAL" },
      { value: 100, status: "NORMAL" },
      { value: 110, status: "HIGH" },
    ]);
    expect(result.trend).toBe("rising");
    expect(result.significant).toBe(true);
  });

  it("detects falling trend", () => {
    const result = analyzeTrend([
      { value: 150, status: "HIGH" },
      { value: 120, status: "HIGH" },
      { value: 90, status: "NORMAL" },
    ]);
    expect(result.trend).toBe("falling");
    expect(result.significant).toBe(true);
  });

  it("detects fluctuating trend", () => {
    const result = analyzeTrend([
      { value: 90, status: "NORMAL" },
      { value: 110, status: "HIGH" },
      { value: 95, status: "NORMAL" },
      { value: 105, status: "HIGH" },
    ]);
    expect(result.trend).toBe("fluctuating");
    expect(result.significant).toBe(true);
  });

  it("detects significant when 2+ out of range", () => {
    const result = analyzeTrend([
      { value: 100, status: "NORMAL" },
      { value: 150, status: "HIGH" },
      { value: 160, status: "HIGH" },
    ]);
    expect(result.significant).toBe(true);
  });

  it("returns stable when values are consistent", () => {
    const result = analyzeTrend([
      { value: 100, status: "NORMAL" },
      { value: 101, status: "NORMAL" },
      { value: 99, status: "NORMAL" },
    ]);
    expect(result.trend).toBe("stable");
    expect(result.significant).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/unit/trends.test.ts`
Expected: FAIL — `analyzeTrend` not found

- [ ] **Step 3: Create trends module with detection logic**

Create `lib/ai/trends.ts`:

```typescript
import { streamObject } from "ai";
import { openaiModel } from "./client";
import { trendAnalysisSchema, trendAnalysisSystemPrompt } from "./prompts/trends";
import { prisma } from "@/lib/db";

const WATERMARK = "AI-Generated Draft — requires specialist review";

interface DataPoint {
  value: number;
  status: string;
}

/**
 * Analyze trend direction and significance from lab data points.
 * Pure function — no LLM, no database calls.
 */
export function analyzeTrend(dataPoints: DataPoint[]): { trend: string; significant: boolean } {
  if (dataPoints.length < 2) {
    return { trend: "stable", significant: false };
  }

  const directions: string[] = [];
  for (let i = 1; i < dataPoints.length; i++) {
    const diff = dataPoints[i].value - dataPoints[i - 1].value;
    if (diff > 0) directions.push("up");
    else if (diff < 0) directions.push("down");
    else directions.push("stable");
  }

  const upCount = directions.filter((d) => d === "up").length;
  const downCount = directions.filter((d) => d === "down").length;
  const outOfRange = dataPoints.filter((d) => d.status !== "NORMAL").length;

  const significant = outOfRange >= 2 || upCount >= 2 || downCount >= 2;

  let trend = "stable";
  if (upCount >= 2) trend = "rising";
  else if (downCount >= 2) trend = "falling";
  else if (upCount > 0 && downCount > 0) trend = "fluctuating";

  return { trend, significant };
}

/**
 * Generate trend analysis for a patient's lab results.
 * Analyzes all metrics with 2+ data points.
 */
export async function generateTrendAnalysis(patientId: string) {
  // Fetch all lab results for the patient with metrics
  const labResults = await prisma.labResult.findMany({
    where: { patientId },
    include: { metrics: true },
    orderBy: { date: "asc" },
  });

  if (labResults.length < 2) {
    return []; // Need at least 2 results for trend analysis
  }

  // Group metrics by name across all lab results
  const metricGroups: Record<string, Array<{ date: string; value: number; unit: string; referenceRange: string; status: string }>> = {};

  for (const result of labResults) {
    for (const metric of result.metrics) {
      if (!metricGroups[metric.name]) {
        metricGroups[metric.name] = [];
      }
      metricGroups[metric.name].push({
        date: result.date.toISOString().split("T")[0],
        value: metric.value,
        unit: metric.unit,
        referenceRange: metric.referenceRange,
        status: metric.status,
      });
    }
  }

  const analyses = [];

  for (const [metricName, dataPoints] of Object.entries(metricGroups)) {
    if (dataPoints.length < 2) continue;

    const { trend, significant } = analyzeTrend(
      dataPoints.map((dp) => ({ value: dp.value, status: dp.status }))
    );

    // Generate plain-language summary via LLM for significant trends
    let summary = "";
    if (significant) {
      const result = streamObject({
        model: openaiModel,
        schema: trendAnalysisSchema,
        system: trendAnalysisSystemPrompt,
        prompt: `Analyze this trend for metric "${metricName}":\nTrend: ${trend}\nData points: ${JSON.stringify(dataPoints)}`,
        onFinish: async ({ object }) => {
          if (object) {
            summary = object.summary;
          }
        },
      });

      // Wait for LLM to complete
      await result.consumeStream();
    } else {
      summary = `Your ${metricName.toLowerCase()} levels have remained stable.`;
    }

    // Upsert trend analysis record
    const trendRecord = await prisma.trendAnalysis.upsert({
      where: {
        patientId_metricName: { patientId, metricName },
      },
      update: {
        dataPoints: dataPoints,
        trend,
        significant,
        summary: significant ? `${WATERMARK}\n\n${summary}` : summary,
      },
      create: {
        patientId,
        metricName,
        dataPoints: dataPoints,
        trend,
        significant,
        summary: significant ? `${WATERMARK}\n\n${summary}` : summary,
      },
    });

    analyses.push(trendRecord);
  }

  return analyses;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run __tests__/unit/trends.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/ai/trends.ts __tests__/unit/trends.test.ts
git commit -m "feat: add trend detection logic and analysis module"
```

---

### Task 11: Trends API Route

**Files:**
- Create: `app/api/ai/trends/[patientId]/route.ts`
- Consumes: `lib/ai/trends.ts`

- [ ] **Step 1: Create trends API route**

Create `app/api/ai/trends/[patientId]/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ patientId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const { patientId } = await params;

  // Patients can only access their own trends
  if (userId !== patientId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const trends = await prisma.trendAnalysis.findMany({
      where: { patientId },
      orderBy: { generatedAt: "desc" },
    });

    return NextResponse.json(trends, {
      headers: {
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Trend analysis fetch failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch trend analyses" },
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
git add app/api/ai/trends/[patientId]/route.ts
git commit -m "feat: add trends API route for patient dashboard"
```

---

### Task 12: Lab Result Creation + Trend Trigger

**Files:**
- Modify: `app/api/lab-results/route.ts` (add POST handler)
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

  // Create lab result with metrics
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

  // Trigger trend analysis for this patient (fire and forget)
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

---

### Task 13: Integration Tests — New AI Routes

**Files:**
- Modify: `__tests__/integration/ai-routes.test.ts`

- [ ] **Step 1: Add synthesis route tests**

Add to `__tests__/integration/ai-routes.test.ts`:

```typescript
import { POST as synthesisPost } from '@/app/api/ai/synthesis/[caseId]/route';
import { generateSynthesis } from '@/lib/ai/synthesis';

// Add mock at top of file (with other mocks):
vi.mock('@/lib/ai/synthesis', () => ({
  generateSynthesis: vi.fn(),
}));

// Add helper function:
function synthesisParams(caseId: string) {
  return { params: Promise.resolve({ caseId }) };
}

// Add describe block inside 'AI Routes - Auth':
describe('Synthesis route', () => {
  it('returns 401 without x-internal-secret header', async () => {
    const res = await synthesisPost(createRequestWithSecret(undefined), synthesisParams('case-1'));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe('Unauthorized');
  });

  it('returns 401 with wrong x-internal-secret', async () => {
    const res = await synthesisPost(createRequestWithSecret('wrong-secret'), synthesisParams('case-1'));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe('Unauthorized');
  });

  it('returns 500 when generateSynthesis throws', async () => {
    vi.mocked(generateSynthesis).mockRejectedValue(new Error('Case not found'));
    const res = await synthesisPost(createRequestWithSecret('test-secret'), synthesisParams('nonexistent-case'));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe('Synthesis generation failed');
  });
});
```

- [ ] **Step 2: Add follow-up route tests**

Add to `__tests__/integration/ai-routes.test.ts`:

```typescript
import { POST as followupPost } from '@/app/api/ai/followup/route';
import { answerFollowUp } from '@/lib/ai/followup';

// Add mock at top of file:
vi.mock('@/lib/ai/followup', () => ({
  answerFollowUp: vi.fn(),
}));

// Add describe block inside 'AI Routes - Auth':
describe('Follow-up route', () => {
  it('returns 401 without session', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);
    const res = await followupPost(createRequestWithBody({ opinionId: 'op-1', question: 'What does this mean?' }));
    expect(res.status).toBe(401);
  });

  it('returns 400 without required fields', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'patient-1'));
    const res = await followupPost(createRequestWithBody({}));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('opinionId and question are required');
  });

  it('returns 500 when answerFollowUp throws', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'patient-1'));
    vi.mocked(answerFollowUp).mockRejectedValue(new Error('Opinion not found'));
    const res = await followupPost(createRequestWithBody({ opinionId: 'nonexistent', question: 'What does this mean?' }));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe('Follow-up Q&A failed');
  });
});
```

- [ ] **Step 3: Add trends route tests**

Add to `__tests__/integration/ai-routes.test.ts`:

```typescript
import { GET as trendsGet } from '@/app/api/ai/trends/[patientId]/route';

// Add helper function:
function trendsParams(patientId: string) {
  return { params: Promise.resolve({ patientId }) };
}

// Add describe block inside 'AI Routes - Auth':
describe('Trends route', () => {
  it('returns 401 without session', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);
    const res = await trendsGet(createRequest(), trendsParams('patient-1'));
    expect(res.status).toBe(401);
  });

  it('returns 403 when accessing other patient trends', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'patient-1'));
    const res = await trendsGet(createRequest(), trendsParams('patient-2'));
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toBe('Forbidden');
  });

  it('returns 200 with trends for own data', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'patient-1'));
    vi.mocked(prisma.trendAnalysis.findMany).mockResolvedValue([]);
    const res = await trendsGet(createRequest(), trendsParams('patient-1'));
    expect(res.status).toBe(200);
  });
});
```

- [ ] **Step 4: Add helper function for request with body**

Add to `__tests__/integration/ai-routes.test.ts`:

```typescript
function createRequestWithBody(body: unknown): Request {
  return { json: async () => body } as unknown as Request;
}
```

- [ ] **Step 5: Run all tests**

Run: `npx vitest run`
Expected: All tests pass

- [ ] **Step 6: Commit**

```bash
git add __tests__/integration/ai-routes.test.ts
git commit -m "feat: add integration tests for Phase 4 AI routes"
```

---

### Task 14: Lint, Typecheck, and Final Verification

**Files:** None (verification only)

- [ ] **Step 1: Run linter**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Run full test suite**

Run: `npx vitest run`
Expected: All tests pass

- [ ] **Step 4: Commit any fixes**

If lint or typecheck found issues, fix and commit:

```bash
git add -A
git commit -m "fix: resolve lint and typecheck issues"
```
