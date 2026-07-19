# Phase 3: AI Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement three AI features — intelligent case routing, AI pre-screening, and plain-language summary — using OpenAI via Vercel AI SDK.

**Architecture:** OpenAI calls go through a centralized `lib/ai/` service layer. PHI is stripped before every LLM call. All outputs are structured (Zod schemas), watermarked, and saved to existing Prisma models. API routes use internal secret auth. Streaming via SSE for pre-screening and summary; JSON for routing.

**Tech Stack:** `ai` (Vercel AI SDK), `@ai-sdk/openai`, `zod`, `prisma`, Next.js App Router, Vitest

## Global Constraints

- Provider: OpenAI via `@ai-sdk/openai`
- All AI outputs watermarked: `"AI-Generated Draft — requires specialist review"`
- PHI stripped before every LLM call (names, DOB, MRN, email, phone, addresses)
- No clinical diagnoses — all prompts include "You are NOT diagnosing"
- Internal API auth: `x-internal-secret` header matching `INTERNAL_API_SECRET` env var
- Database: No schema changes — all models already exist
- Testing: Vitest with `vi.mock()` pattern from existing E2E tests
- Code style: Follow existing patterns — Next.js 15 async params, `getServerSession(authOptions)`, `NextResponse.json()`, React Query hooks, Tailwind with design tokens

---

## File Structure

```
lib/ai/
├── client.ts          # Create OpenAI model instance
├── phi-stripper.ts    # Strip PII before LLM calls
├── prompts/
│   ├── prescreen.ts   # Pre-screening prompt + Zod schema
│   ├── summary.ts     # Summary prompt + Zod schema
│   └── routing.ts     # Routing prompt + Zod schema
├── prescreen.ts       # generatePrescreen(caseId) — streams result
├── summary.ts         # generateSummary(opinionId) — streams result
└── routing.ts         # matchSpecialist(caseId) — returns JSON

app/api/ai/
├── prescreen/[caseId]/route.ts   # POST — trigger pre-screening
├── summary/[opinionId]/route.ts  # POST — trigger summary
└── route/[caseId]/route.ts       # POST — trigger routing

__tests__/
├── unit/
│   ├── phi-stripper.test.ts
│   └── prompts.test.ts
└── integration/
    └── ai-routes.test.ts
```

---

### Task 0: Add Description Field to Case Model

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/..._add_case_description/migration.sql`
- Modify: `app/api/cases/route.ts`

**Interfaces:**
- Produces: `Case.description` field (String, optional)

- [ ] **Step 1: Add description field to Case model**

In `prisma/schema.prisma`, add `description` to the Case model:

```prisma
model Case {
  id           String             @id @default(cuid())
  patientId    String
  specialistId String?
  serviceType  ServiceType
  status       CaseStatus         @default(OPEN)
  description  String?            @db.Text
  createdAt    DateTime           @default(now())
  updatedAt    DateTime           @updatedAt

  patient      User               @relation("PatientCases", fields: [patientId], references: [id], onDelete: Cascade)
  specialist   User?              @relation("SpecialistCases", fields: [specialistId], references: [id], onDelete: SetNull)
  records      CaseRecord[]
  opinions     SpecialistOpinion[]
  aiPrescreens AIPrescreen[]
}
```

- [ ] **Step 2: Create and apply migration**

Run: `npx prisma migrate dev --name add_case_description`

Expected: Migration created and applied successfully.

- [ ] **Step 3: Update case creation route to store description**

In `app/api/cases/route.ts`, update the POST handler to include description:

```typescript
const caseRecord = await prisma.case.create({
  data: {
    patientId: userId,
    serviceType: parsed.data.serviceType,
    description: parsed.data.description,
    status: 'OPEN',
  },
});
```

- [ ] **Step 4: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add prisma/schema.prisma prisma/migrations/ app/api/cases/route.ts
git commit -m "feat(db): add description field to Case model for AI features"
```

---

### Task 1: Install Dependencies and Configure Environment

**Files:**
- Modify: `package.json` (via pnpm)
- Modify: `.env.example`
- Modify: `.env`

- [ ] **Step 1: Install AI SDK packages**

Run: `pnpm add ai @ai-sdk/openai`

Expected: Packages installed successfully, lockfile updated.

- [ ] **Step 2: Add environment variables to `.env.example`**

Add these lines to `.env.example`:

```bash
OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
INTERNAL_API_SECRET="YOUR_INTERNAL_API_SECRET"
```

- [ ] **Step 3: Add environment variables to `.env`**

Add these lines to `.env` (use placeholder values for now — real keys needed at runtime):

```bash
OPENAI_API_KEY="sk-placeholder-replace-with-real-key"
INTERNAL_API_SECRET="internal-secret-replace-with-real-value"
```

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml .env.example .env
git commit -m "chore: add ai sdk dependencies and env config for phase 3"
```

---

### Task 2: Build OpenAI Client

**Files:**
- Create: `lib/ai/client.ts`

**Interfaces:**
- Produces: `openaiModel` — OpenAI model instance used by all AI features

- [ ] **Step 1: Create the OpenAI client module**

Create `lib/ai/client.ts`:

```typescript
import { createOpenAI } from "@ai-sdk/openai";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const openaiModel = openai("gpt-4o");
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit lib/ai/client.ts`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add lib/ai/client.ts
git commit -m "feat(ai): add OpenAI client via vercel ai sdk"
```

---

### Task 3: Build PHI Stripper with Tests

**Files:**
- Create: `lib/ai/phi-stripper.ts`
- Create: `__tests__/unit/phi-stripper.test.ts`

**Interfaces:**
- Produces: `stripPHI(text: string, context?: { patientName?: string }) => string`

- [ ] **Step 1: Write the failing test**

Create `__tests__/unit/phi-stripper.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { stripPHI } from "@/lib/ai/phi-stripper";

describe("stripPHI", () => {
  it("strips patient names when provided in context", () => {
    const input = "Patient John Doe presents with chest pain.";
    const result = stripPHI(input, { patientName: "John Doe" });
    expect(result).toBe("Patient [PATIENT] presents with chest pain.");
    expect(result).not.toContain("John Doe");
  });

  it("strips email addresses", () => {
    const input = "Contact: patient@example.com for follow-up.";
    const result = stripPHI(input);
    expect(result).toContain("[EMAIL]");
    expect(result).not.toContain("patient@example.com");
  });

  it("strips phone numbers", () => {
    const input = "Call patient at +1-555-123-4567.";
    const result = stripPHI(input);
    expect(result).toContain("[PHONE]");
    expect(result).not.toContain("555-123-4567");
  });

  it("strips dates of birth patterns", () => {
    const input = "DOB: 01/15/1985 or born 1985-01-15.";
    const result = stripPHI(input);
    expect(result).toContain("[DOB]");
    expect(result).not.toContain("01/15/1985");
    expect(result).not.toContain("1985-01-15");
  });

  it("strips MRN patterns", () => {
    const input = "MRN: 12345678 or MRN# 87654321.";
    const result = stripPHI(input);
    expect(result).toContain("[MRN]");
    expect(result).not.toContain("12345678");
    expect(result).not.toContain("87654321");
  });

  it("strips US street addresses", () => {
    const input = "Patient lives at 123 Main Street, Apt 4.";
    const result = stripPHI(input);
    expect(result).toContain("[ADDRESS]");
    expect(result).not.toContain("123 Main Street");
  });

  it("preserves clinical content", () => {
    const input =
      "Diagnosis: Type 2 Diabetes Mellitus. HbA1c: 8.2%. Metformin 500mg BID.";
    const result = stripPHI(input);
    expect(result).toContain("Type 2 Diabetes Mellitus");
    expect(result).toContain("8.2%");
    expect(result).toContain("Metformin 500mg BID");
  });

  it("handles empty string", () => {
    expect(stripPHI("")).toBe("");
  });

  it("handles text with no PII", () => {
    const input = "Chest pain, acute onset, 3 hours duration.";
    expect(stripPHI(input)).toBe(input);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/unit/phi-stripper.test.ts`
Expected: FAIL — `Cannot find module '@/lib/ai/phi-stripper'`

- [ ] **Step 3: Write the implementation**

Create `lib/ai/phi-stripper.ts`:

```typescript
/**
 * Strips Protected Health Information (PHI) from text before sending to LLM.
 * Over-strip rather than under-strip — clinical content is preserved, PII is removed.
 */

const PHI_PATTERNS: Array<{ pattern: RegExp; replacement: string }> = [
  // Email addresses
  { pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, replacement: "[EMAIL]" },

  // Phone numbers (US/international formats)
  { pattern: /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g, replacement: "[PHONE]" },

  // Dates of birth (MM/DD/YYYY, YYYY-MM-DD, MM-DD-YYYY, DD.MM.YYYY)
  { pattern: /\b(0[1-9]|1[0-2])[\/\-](0[1-9]|[12]\d|3[01])[\/\-](\d{4})\b/g, replacement: "[DOB]" },
  { pattern: /\b(\d{4})[\/\-](0[1-9]|1[0-2])[\/\-](0[1-9]|[12]\d|3[01])\b/g, replacement: "[DOB]" },
  { pattern: /\b(0[1-9]|[12]\d|3[01])\.(0[1-9]|1[0-2])\.(\d{4})\b/g, replacement: "[DOB]" },

  // MRN patterns (MRN: 12345678, MRN# 12345678, MRN 12345678)
  { pattern: /\bMRN[#:\s]?\s*\d{6,12}\b/gi, replacement: "[MRN]" },

  // US street addresses (number + street name + optional street type)
  { pattern: /\b\d{1,5}\s+[\w\s]+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd|Court|Ct|Place|Pl|Way|Circle|Cir)\b\.?/gi, replacement: "[ADDRESS]" },
];

/**
 * Strip PII from clinical text before LLM processing.
 * @param text - The text to strip PII from
 * @param context - Optional context with patient info for name stripping
 * @returns Text with PII replaced by placeholders
 */
export function stripPHI(text: string, context?: { patientName?: string }): string {
  if (!text) return text;

  let stripped = text;

  // Strip patient name if provided in context
  if (context?.patientName) {
    const nameRegex = new RegExp(escapeRegex(context.patientName), "gi");
    stripped = stripped.replace(nameRegex, "[PATIENT]");
  }

  // Apply all PHI patterns
  for (const { pattern, replacement } of PHI_PATTERNS) {
    stripped = stripped.replace(pattern, replacement);
  }

  return stripped;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run __tests__/unit/phi-stripper.test.ts`
Expected: All 9 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/ai/phi-stripper.ts __tests__/unit/phi-stripper.test.ts
git commit -m "feat(ai): add PHI stripping utility with tests"
```

---

### Task 4: Build Prompt Templates and Zod Schemas

**Files:**
- Create: `lib/ai/prompts/prescreen.ts`
- Create: `lib/ai/prompts/summary.ts`
- Create: `lib/ai/prompts/routing.ts`
- Create: `__tests__/unit/prompts.test.ts`

**Interfaces:**
- Produces: `prescreenSchema`, `prescreenSystemPrompt` (from prescreen.ts)
- Produces: `summarySchema`, `summarySystemPrompt` (from summary.ts)
- Produces: `routingSchema`, `routingSystemPrompt` (from routing.ts)

- [ ] **Step 1: Write the failing test**

Create `__tests__/unit/prompts.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { prescreenSchema } from "@/lib/ai/prompts/prescreen";
import { summarySchema } from "@/lib/ai/prompts/summary";
import { routingSchema } from "@/lib/ai/prompts/routing";

describe("Prescreen Schema", () => {
  it("validates a correct prescreen output", () => {
    const result = prescreenSchema.safeParse({
      findings: ["Mild cardiomegaly", "No pleural effusion"],
      differentials: ["Hypertensive heart disease", "Volume overload"],
      urgentFlags: ["Possible aortic dissection"],
      confidence: "high",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing required fields", () => {
    const result = prescreenSchema.safeParse({
      findings: ["test"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid confidence level", () => {
    const result = prescreenSchema.safeParse({
      findings: ["test"],
      differentials: ["test"],
      urgentFlags: [],
      confidence: "very_high",
    });
    expect(result.success).toBe(false);
  });
});

describe("Summary Schema", () => {
  it("validates a correct summary output", () => {
    const result = summarySchema.safeParse({
      summary: "Your doctor found some changes in your heart size.",
      keyFindings: ["Heart is slightly larger than normal"],
      nextSteps: ["Follow up with your primary care doctor"],
      disclaimer: "This is an AI-generated summary.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty arrays", () => {
    const result = summarySchema.safeParse({
      summary: "test",
      keyFindings: [],
      nextSteps: [],
      disclaimer: "test",
    });
    expect(result.success).toBe(false);
  });
});

describe("Routing Schema", () => {
  it("validates a correct routing output", () => {
    const result = routingSchema.safeParse({
      matchedSpecialistId: "doctor-123",
      reasoning: "Cardiology case matched to cardiologist",
      confidence: "high",
      alternatives: ["doctor-456"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty matched specialist ID", () => {
    const result = routingSchema.safeParse({
      matchedSpecialistId: "",
      reasoning: "test",
      confidence: "medium",
      alternatives: [],
    });
    expect(result.success).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/unit/prompts.test.ts`
Expected: FAIL — modules not found.

- [ ] **Step 3: Create prescreen prompt and schema**

Create `lib/ai/prompts/prescreen.ts`:

```typescript
import { z } from "zod";

export const prescreenSchema = z.object({
  findings: z.array(z.string()).min(1).describe("Key clinical findings identified"),
  differentials: z.array(z.string()).min(1).describe("Differential diagnoses to consider"),
  urgentFlags: z.array(z.string()).describe("Urgency indicators (empty array if none)"),
  confidence: z.enum(["low", "medium", "high"]),
});

export type PrescreenResult = z.infer<typeof prescreenSchema>;

export const prescreenSystemPrompt = `You are a clinical pre-screening assistant for a diagnostic coordination platform. Your role is to help specialists prioritize their review.

ANALYZE the clinical information provided and produce a structured pre-screen.

RULES:
- You are NOT diagnosing. You are surfacing what matters most for the specialist to review first.
- Flag anything that appears urgent or time-sensitive.
- Be specific but concise — each finding should be a clear, actionable item.
- If the clinical information is limited, say so with low confidence.
- Always include at least one finding and one differential, even if uncertain.

OUTPUT FORMAT:
- findings: Key clinical findings the specialist should review first
- differentials: Possible conditions or diagnoses to consider (not definitive)
- urgentFlags: Any urgency indicators (empty array if nothing urgent)
- confidence: Your confidence in the pre-screen (low/medium/high)`;
```

- [ ] **Step 4: Create summary prompt and schema**

Create `lib/ai/prompts/summary.ts`:

```typescript
import { z } from "zod";

export const summarySchema = z.object({
  summary: z.string().min(50).describe("2-3 paragraph patient-friendly explanation of the specialist's findings"),
  keyFindings: z.array(z.string()).min(1).describe("Main findings translated to plain language"),
  nextSteps: z.array(z.string()).min(1).describe("Actionable next steps for the patient"),
  disclaimer: z.string().describe("Standard medical disclaimer"),
});

export type SummaryResult = z.infer<typeof summarySchema>;

export const summarySystemPrompt = `You are a trusted GP explaining a specialist's report to a patient. Your goal is to make the specialist's findings understandable to someone with no medical background.

TRANSLATE the specialist's report into patient-friendly language.

RULES:
- Use NO medical jargon. If a medical term is necessary, explain it in parentheses.
- Write as if you're speaking directly to the patient — warm, clear, honest.
- Be reassuring but never dismissive of concerns.
- Include a standard disclaimer that this is an AI-generated summary.
- Do NOT add medical opinions or recommendations beyond what the specialist stated.

OUTPUT FORMAT:
- summary: 2-3 paragraph explanation in plain language
- keyFindings: Bullet points of the main findings (plain language)
- nextSteps: Numbered list of what the patient should do next
- disclaimer: "This is an AI-generated summary of your specialist's report. It does not constitute medical advice. Please discuss any questions with your healthcare provider."`;
```

- [ ] **Step 5: Create routing prompt and schema**

Create `lib/ai/prompts/routing.ts`:

```typescript
import { z } from "zod";

export const routingSchema = z.object({
  matchedSpecialistId: z.string().min(1).describe("ID of the best-matching specialist"),
  reasoning: z.string().min(10).describe("Why this specialist was chosen"),
  confidence: z.enum(["low", "medium", "high"]),
  alternatives: z.array(z.string()).describe("Other considered specialist IDs"),
});

export type RoutingResult = z.infer<typeof routingSchema>;

export const routingSystemPrompt = `You are a case routing coordinator for a medical diagnostic platform. Your role is to match incoming cases to the most appropriate available specialist.

MATCH the case to the best specialist based on subspecialty, case description, and availability.

RULES:
- You are NOT diagnosing. You are routing based on specialization fit.
- Prioritize subspecialty match above all else.
- Consider urgency — urgent cases should go to the most experienced available specialist.
- If no specialist is a good match, indicate low confidence.
- The matched specialist MUST be from the provided list of available specialists.

OUTPUT FORMAT:
- matchedSpecialistId: The ID of the best-matching specialist from the list
- reasoning: Brief explanation of why this specialist was chosen
- confidence: How confident you are in this match (low/medium/high)
- alternatives: IDs of other specialists that were considered`;
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npx vitest run __tests__/unit/prompts.test.ts`
Expected: All 7 tests PASS.

- [ ] **Step 7: Commit**

```bash
git add lib/ai/prompts/ __tests__/unit/prompts.test.ts
git commit -m "feat(ai): add prompt templates and Zod schemas for all 3 features"
```

---

### Task 5: Build Pre-screening Logic

**Files:**
- Create: `lib/ai/prescreen.ts`

**Interfaces:**
- Consumes: `openaiModel` (from client.ts), `stripPHI` (from phi-stripper.ts), `prescreenSchema`, `prescreenSystemPrompt` (from prompts/prescreen.ts), `prisma` (from lib/db.ts)
- Produces: `generatePrescreen(caseId: string)` — returns `ReadableStream` (SSE)

- [ ] **Step 1: Create the pre-screening module**

Create `lib/ai/prescreen.ts`:

```typescript
import { streamObject } from "ai";
import { openaiModel } from "./client";
import { stripPHI } from "./phi-stripper";
import { prescreenSchema, prescreenSystemPrompt } from "./prompts/prescreen";
import { prisma } from "@/lib/db";

const WATERMARK = "AI-Generated Draft — requires specialist review";

/**
 * Generate an AI pre-screen for a case. Streams the result via SSE.
 * Saves the completed result to the AIPrescreen table.
 */
export async function generatePrescreen(caseId: string) {
  const caseRecord = await prisma.case.findUnique({
    where: { id: caseId },
    include: { records: true },
  });

  if (!caseRecord) {
    throw new Error(`Case not found: ${caseId}`);
  }

  // Build clinical context from case description + file metadata
  const clinicalContext = [
    `Service Type: ${caseRecord.serviceType}`,
    caseRecord.description ? `Case Description: ${caseRecord.description}` : "",
    caseRecord.records.length > 0
      ? `Uploaded Records: ${caseRecord.records.map((r) => `${r.fileName} (${r.fileType})`).join(", ")}`
      : "No records uploaded yet.",
  ]
    .filter(Boolean)
    .join("\n");

  // Strip PHI before sending to LLM
  const sanitizedContext = stripPHI(clinicalContext);

  const result = streamObject({
    model: openaiModel,
    schema: prescreenSchema,
    system: prescreenSystemPrompt,
    prompt: `Pre-screen the following case:\n\n${sanitizedContext}`,
    onFinish: async ({ object }) => {
      if (object) {
        await prisma.aIPrescreen.create({
          data: {
            caseId,
            findings: object.findings.join("\n"),
            differentials: object.differentials.join("\n"),
            urgentFlags: object.urgentFlags.length > 0 ? object.urgentFlags.join("\n") : null,
          },
        });

        // Update case status to AI_PRE_SCREENED
        await prisma.case.update({
          where: { id: caseId },
          data: { status: "AI_PRE_SCREENED" },
        });
      }
    },
  });

  return result.toDataStreamResponse();
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit lib/ai/prescreen.ts`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add lib/ai/prescreen.ts
git commit -m "feat(ai): add pre-screening logic with streaming and DB persistence"
```

---

### Task 6: Build Summary Logic

**Files:**
- Create: `lib/ai/summary.ts`

**Interfaces:**
- Consumes: `openaiModel`, `stripPHI`, `summarySchema`, `summarySystemPrompt`, `prisma`
- Produces: `generateSummary(opinionId: string)` — returns `ReadableStream` (SSE)

- [ ] **Step 1: Create the summary module**

Create `lib/ai/summary.ts`:

```typescript
import { streamObject } from "ai";
import { openaiModel } from "./client";
import { stripPHI } from "./phi-stripper";
import { summarySchema, summarySystemPrompt } from "./prompts/summary";
import { prisma } from "@/lib/db";

/**
 * Generate a plain-language summary for a signed specialist opinion.
 * Streams the result via SSE. Saves to PlainLanguageSummary table.
 */
export async function generateSummary(opinionId: string) {
  const opinion = await prisma.specialistOpinion.findUnique({
    where: { id: opinionId },
    include: { case: true },
  });

  if (!opinion) {
    throw new Error(`Opinion not found: ${opinionId}`);
  }

  if (opinion.status !== "SIGNED") {
    throw new Error(`Opinion must be signed before generating summary. Current status: ${opinion.status}`);
  }

  // Strip PHI from opinion content
  const sanitizedContent = stripPHI(opinion.content);

  const result = streamObject({
    model: openaiModel,
    schema: summarySchema,
    system: summarySystemPrompt,
    prompt: `Translate the following specialist report into patient-friendly language:\n\n${sanitizedContent}`,
    onFinish: async ({ object }) => {
      if (object) {
        await prisma.plainLanguageSummary.create({
          data: {
            opinionId,
            content: JSON.stringify(object),
          },
        });

        // Update case status to OPINION_READY
        await prisma.case.update({
          where: { id: opinion.caseId },
          data: { status: "OPINION_READY" },
        });
      }
    },
  });

  return result.toDataStreamResponse();
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit lib/ai/summary.ts`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add lib/ai/summary.ts
git commit -m "feat(ai): add plain-language summary logic with streaming"
```

---

### Task 7: Build Routing Logic

**Files:**
- Create: `lib/ai/routing.ts`

**Interfaces:**
- Consumes: `openaiModel`, `stripPHI`, `routingSchema`, `routingSystemPrompt`, `prisma`
- Produces: `matchSpecialist(caseId: string)` — returns `RoutingResult` (JSON, not streaming)

- [ ] **Step 1: Create the routing module**

Create `lib/ai/routing.ts`:

```typescript
import { generateObject } from "ai";
import { openaiModel } from "./client";
import { stripPHI } from "./phi-stripper";
import { routingSchema, routingSystemPrompt } from "./prompts/routing";
import { prisma } from "@/lib/db";

/**
 * Match a case to the best available specialist using AI.
 * Returns structured routing result (not streaming — fast operation).
 */
export async function matchSpecialist(caseId: string) {
  const caseRecord = await prisma.case.findUnique({
    where: { id: caseId },
  });

  if (!caseRecord) {
    throw new Error(`Case not found: ${caseId}`);
  }

  // Get available verified specialists
  const specialists = await prisma.doctor.findMany({
    where: { verified: true },
    include: {
      user: { select: { id: true, name: true } },
      _count: { select: { cases: { where: { status: { in: ["UNDER_REVIEW", "AI_PRE_SCREENED"] } } } },
    },
  });

  if (specialists.length === 0) {
    return {
      matchedSpecialistId: null,
      reasoning: "No verified specialists available",
      confidence: "low" as const,
      alternatives: [],
    };
  }

  // Build specialist list for LLM
  const specialistList = specialists.map((s) => ({
    id: s.user.id,
    name: s.user.name,
    specialty: s.specialty,
    experience: s.experience,
    currentCaseload: s._count.cases,
  }));

  // Strip PHI from case description
  const sanitizedDescription = stripPHI(caseRecord.description || "");

  const { object } = await generateObject({
    model: openaiModel,
    schema: routingSchema,
    system: routingSystemPrompt,
    prompt: `Match this case to a specialist:

Case Description: ${sanitizedDescription}
Service Type: ${caseRecord.serviceType}

Available Specialists:
${JSON.stringify(specialistList, null, 2)}`,
  });

  // Validate the matched specialist exists in our list
  const validSpecialist = specialists.find((s) => s.user.id === object.matchedSpecialistId);

  if (!validSpecialist || object.confidence === "low") {
    return {
      matchedSpecialistId: null,
      reasoning: object.reasoning,
      confidence: "low" as const,
      alternatives: object.alternatives,
    };
  }

  // Assign specialist to case
  await prisma.case.update({
    where: { id: caseId },
    data: {
      specialistId: object.matchedSpecialistId,
      status: "UNDER_REVIEW",
    },
  });

  return object;
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit lib/ai/routing.ts`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add lib/ai/routing.ts
git commit -m "feat(ai): add intelligent case routing logic"
```

---

### Task 8: Build API Routes

**Files:**
- Create: `app/api/ai/prescreen/[caseId]/route.ts`
- Create: `app/api/ai/summary/[opinionId]/route.ts`
- Create: `app/api/ai/route/[caseId]/route.ts`

**Interfaces:**
- Consumes: `generatePrescreen`, `generateSummary`, `matchSpecialist` from lib/ai/
- Produces: Three POST API routes with internal secret auth

- [ ] **Step 1: Create the prescreen API route**

Create `app/api/ai/prescreen/[caseId]/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { generatePrescreen } from "@/lib/ai/prescreen";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ caseId: string }> }
) {
  // Internal API auth
  const secret = request.headers.get("x-internal-secret");
  if (secret !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { caseId } = await params;

  try {
    const response = await generatePrescreen(caseId);
    return response;
  } catch (error) {
    console.error("Pre-screening failed:", error);
    return NextResponse.json(
      { error: "Pre-screening failed" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Create the summary API route**

Create `app/api/ai/summary/[opinionId]/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { generateSummary } from "@/lib/ai/summary";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ opinionId: string }> }
) {
  const secret = request.headers.get("x-internal-secret");
  if (secret !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { opinionId } = await params;

  try {
    const response = await generateSummary(opinionId);
    return response;
  } catch (error) {
    console.error("Summary generation failed:", error);
    return NextResponse.json(
      { error: "Summary generation failed" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 3: Create the routing API route**

Create `app/api/ai/route/[caseId]/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { matchSpecialist } from "@/lib/ai/routing";

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
    const result = await matchSpecialist(caseId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Routing failed:", error);
    return NextResponse.json(
      { error: "Routing failed" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 4: Verify all routes compile**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add app/api/ai/
git commit -m "feat(ai): add API routes for pre-screening, summary, and routing"
```

---

### Task 9: Wire Pre-screening Trigger into File Upload

**Files:**
- Modify: `app/api/cases/[id]/records/route.ts`

**Interfaces:**
- Consumes: fetch to `/api/ai/prescreen/[caseId]` with internal secret header

- [ ] **Step 1: Read the current file upload route**

Read `app/api/cases/[id]/records/route.ts` to understand the current POST handler.

- [ ] **Step 2: Add pre-screening trigger after file upload**

After the file is successfully saved and the `CaseRecord` is created, add a fire-and-forget call to trigger pre-screening:

```typescript
// After successful file upload, trigger AI pre-screening (fire and forget)
// Only trigger if this is the first record for the case
const recordCount = await prisma.caseRecord.count({ where: { caseId: id } });
if (recordCount === 1) {
  fetch(`${process.env.NEXTAUTH_URL}/api/ai/prescreen/${id}`, {
    method: "POST",
    headers: {
      "x-internal-secret": process.env.INTERNAL_API_SECRET || "",
    },
  }).catch((err) => console.error("Pre-screening trigger failed:", err));
}
```

Place this after the `return NextResponse.json(...)` — it's fire-and-forget, doesn't block the response.

- [ ] **Step 3: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add app/api/cases/[id]/records/route.ts
git commit -m "feat(ai): wire pre-screening trigger into file upload flow"
```

---

### Task 10: Wire Routing Trigger into Post-Pre-screening

**Files:**
- Modify: `lib/ai/prescreen.ts`

**Interfaces:**
- Consumes: fetch to `/api/ai/route/[caseId]` with internal secret header

- [ ] **Step 1: Add routing trigger after pre-screening completes**

In `lib/ai/prescreen.ts`, inside the `onFinish` callback, after the case status is updated to `AI_PRE_SCREENED`, add a fire-and-forget call to trigger routing:

```typescript
// After pre-screening completes, trigger intelligent routing (fire and forget)
fetch(`${process.env.NEXTAUTH_URL}/api/ai/route/${caseId}`, {
  method: "POST",
  headers: {
    "x-internal-secret": process.env.INTERNAL_API_SECRET || "",
  },
}).catch((err) => console.error("Routing trigger failed:", err));
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add lib/ai/prescreen.ts
git commit -m "feat(ai): wire routing trigger after pre-screening completes"
```

---

### Task 11: Wire Summary Trigger into Opinion Signing

**Files:**
- Modify: `app/api/doctor/cases/[id]/opinion/route.ts`

**Interfaces:**
- Consumes: fetch to `/api/ai/summary/[opinionId]` with internal secret header

- [ ] **Step 1: Add summary trigger after opinion is signed**

In `app/api/doctor/cases/[id]/opinion/route.ts`, after the opinion status is set to `SIGNED` and the case status is updated to `OPINION_READY`, add a fire-and-forget call:

```typescript
// After opinion is signed, trigger plain-language summary generation (fire and forget)
fetch(`${process.env.NEXTAUTH_URL}/api/ai/summary/${opinion.id}`, {
  method: "POST",
  headers: {
    "x-internal-secret": process.env.INTERNAL_API_SECRET || "",
  },
}).catch((err) => console.error("Summary trigger failed:", err));
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add app/api/doctor/cases/[id]/opinion/route.ts
git commit -m "feat(ai): wire summary generation trigger into opinion signing"
```

---

### Task 12: Update Doctor Case Detail UI for AI Pre-screening

**Files:**
- Modify: `app/doctor/cases/[id]/page.tsx`

**Interfaces:**
- Consumes: `caseData.aiPrescreens[0]` with `findings` (newline-separated string), `differentials`, `urgentFlags`

- [ ] **Step 1: Update the AI Pre-screen section to render structured data**

The current pre-screen section renders `findings` as a single text block. Update it to render the structured output properly:

Replace the existing AI Pre-screen section (around line 155-170) with:

```tsx
{/* AI Pre-screen */}
{caseData.aiPrescreens && caseData.aiPrescreens.length > 0 && (
  <motion.div
    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
    className="bg-gradient-to-br from-evidence-blue-light/30 to-surface border border-evidence-blue-light/60 rounded-xl shadow-sm p-5"
  >
    {/* Watermark Banner */}
    <div className="mb-3 px-3 py-1.5 bg-clinical-navy/5 border border-clinical-navy/10 rounded-lg">
      <p className="text-[11px] text-clinical-navy/70 font-medium">AI-Generated Draft — requires specialist review</p>
    </div>

    <h2 className="font-semibold text-text-medical-black mb-3 flex items-center gap-2 text-sm">
      <span className="size-2 bg-clinical-navy rounded-full" />
      AI Pre-screen
    </h2>

    {/* Key Findings */}
    {caseData.aiPrescreens[0].findings && (
      <div className="mb-3">
        <h3 className="text-xs font-semibold text-clinical-navy mb-1.5 uppercase tracking-wide">Key Findings</h3>
        <ul className="space-y-1">
          {caseData.aiPrescreens[0].findings.split("\n").filter(Boolean).map((finding: string, i: number) => (
            <li key={i} className="text-sm text-on-surface-variant leading-relaxed flex items-start gap-2">
              <span className="size-1.5 bg-clinical-navy rounded-full mt-1.5 shrink-0" />
              {finding}
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* Differentials */}
    {caseData.aiPrescreens[0].differentials && (
      <div className="mb-3">
        <h3 className="text-xs font-semibold text-clinical-navy mb-1.5 uppercase tracking-wide">Differentials to Consider</h3>
        <ul className="space-y-1">
          {caseData.aiPrescreens[0].differentials.split("\n").filter(Boolean).map((diff: string, i: number) => (
            <li key={i} className="text-sm text-on-surface-variant leading-relaxed flex items-start gap-2">
              <span className="size-1.5 bg-amber-400 rounded-full mt-1.5 shrink-0" />
              {diff}
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* Urgent Flags */}
    {caseData.aiPrescreens[0].urgentFlags && (
      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
        <p className="text-red-700 text-sm font-medium mb-1">Urgent Flags</p>
        <ul className="space-y-1">
          {caseData.aiPrescreens[0].urgentFlags.split("\n").filter(Boolean).map((flag: string, i: number) => (
            <li key={i} className="text-red-600 text-sm">{flag}</li>
          ))}
        </ul>
      </div>
    )}
  </motion.div>
)}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add app/doctor/cases/[id]/page.tsx
git commit -m "feat(ui): render structured AI pre-screen with watermark banner"
```

---

### Task 13: Update Patient Case Detail UI for Plain-Language Summary

**Files:**
- Modify: `app/patient/cases/[id]/page.tsx`
- Modify: `lib/hooks/use-cases.ts` (add `plainLanguageSummaries` to query includes)

**Interfaces:**
- Consumes: `caseData.opinions[0].plainLanguageSummary` with parsed JSON content

- [ ] **Step 1: Update the case query to include plain-language summaries**

In `lib/hooks/use-cases.ts`, update the `useCase` hook's `queryFn` to include `plainLanguageSummaries` in the opinion includes. Check the current query in `app/api/cases/[id]/route.ts` and add the relation.

In `app/api/cases/[id]/route.ts`, update the opinion include to:

```typescript
opinions: {
  where: { status: { in: ["SIGNED", "DELIVERED"] } },
  include: {
    specialist: { select: { name: true } },
    plainLanguageSummary: true,
  },
  orderBy: { createdAt: "desc" },
  take: 1,
},
```

- [ ] **Step 2: Add plain-language summary section to patient case detail page**

In `app/patient/cases/[id]/page.tsx`, after the Specialist Opinion section (around line 220), add:

```tsx
{/* Plain-Language Summary */}
{caseData.opinions?.[0]?.plainLanguageSummary && (() => {
  const summaryData = JSON.parse(caseData.opinions[0].plainLanguageSummary.content);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      className="bg-gradient-to-br from-healing-teal/5 to-surface border border-healing-teal/20 rounded-2xl shadow-sm p-6"
    >
      {/* Watermark Banner */}
      <div className="mb-3 px-3 py-1.5 bg-healing-teal/5 border border-healing-teal/10 rounded-lg">
        <p className="text-[11px] text-healing-teal/70 font-medium">AI-Generated Draft — for informational purposes only</p>
      </div>

      <h2 className="font-semibold text-text-medical-black mb-3 flex items-center gap-2">
        <span className="size-2 bg-healing-teal rounded-full" />
        Plain-Language Summary
      </h2>

      {/* Summary Paragraph */}
      <p className="text-sm text-on-surface leading-relaxed mb-4 whitespace-pre-wrap">
        {summaryData.summary}
      </p>

      {/* Key Findings */}
      {summaryData.keyFindings?.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-clinical-navy mb-2 uppercase tracking-wide">Key Findings</h3>
          <ul className="space-y-1.5">
            {summaryData.keyFindings.map((finding: string, i: number) => (
              <li key={i} className="text-sm text-on-surface-variant leading-relaxed flex items-start gap-2">
                <span className="size-1.5 bg-healing-teal rounded-full mt-1.5 shrink-0" />
                {finding}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Next Steps */}
      {summaryData.nextSteps?.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-clinical-navy mb-2 uppercase tracking-wide">What To Do Next</h3>
          <ol className="space-y-1.5">
            {summaryData.nextSteps.map((step: string, i: number) => (
              <li key={i} className="text-sm text-on-surface-variant leading-relaxed flex items-start gap-2">
                <span className="size-5 bg-healing-teal/10 text-healing-teal rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Disclaimer */}
      {summaryData.disclaimer && (
        <p className="text-xs text-on-surface-variant/70 italic border-t border-surface-gray/60 pt-3 mt-3">
          {summaryData.disclaimer}
        </p>
      )}
    </motion.div>
  );
})()}
```

- [ ] **Step 3: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add app/patient/cases/[id]/page.tsx app/api/cases/[id]/route.ts
git commit -m "feat(ui): render plain-language summary with watermark on patient case page"
```

---

### Task 14: Write Integration Tests for AI Routes

**Files:**
- Create: `__tests__/integration/ai-routes.test.ts`

**Interfaces:**
- Consumes: All API routes from Task 8
- Mocks: `@/lib/ai/prescreen`, `@/lib/ai/summary`, `@/lib/ai/routing`

- [ ] **Step 1: Write integration tests**

Create `__tests__/integration/ai-routes.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next/server", () => ({
  NextResponse: {
    json: (data: unknown, init?: { status?: number }) =>
      new Response(JSON.stringify(data), {
        status: init?.status ?? 200,
        headers: { "content-type": "application/json" },
      }),
  },
}));

vi.mock("@/lib/ai/prescreen", () => ({
  generatePrescreen: vi.fn(),
}));

vi.mock("@/lib/ai/summary", () => ({
  generateSummary: vi.fn(),
}));

vi.mock("@/lib/ai/routing", () => ({
  matchSpecialist: vi.fn(),
}));

import { POST as prescreenRoute } from "@/app/api/ai/prescreen/[caseId]/route";
import { POST as summaryRoute } from "@/app/api/ai/summary/[opinionId]/route";
import { POST as routingRoute } from "@/app/api/ai/route/[caseId]/route";
import { generatePrescreen } from "@/lib/ai/prescreen";
import { generateSummary } from "@/lib/ai/summary";
import { matchSpecialist } from "@/lib/ai/routing";

function createRequest(body?: unknown, headers?: Record<string, string>): Request {
  return {
    json: async () => body,
    headers: {
      get: (name: string) => headers?.[name] ?? null,
    },
  } as unknown as Request;
}

function params(id: string) {
  return { params: Promise.resolve({ id }) };
}

const VALID_SECRET = process.env.INTERNAL_API_SECRET || "test-secret";

describe("AI API Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.INTERNAL_API_SECRET = "test-secret";
  });

  describe("POST /api/ai/prescreen/[caseId]", () => {
    it("returns 401 without internal secret", async () => {
      const res = await prescreenRoute(
        createRequest({}, {}),
        params("case-1")
      );
      expect(res.status).toBe(401);
    });

    it("triggers pre-screening with valid secret", async () => {
      const mockResponse = new Response("stream");
      vi.mocked(generatePrescreen).mockResolvedValue(mockResponse as any);

      const res = await prescreenRoute(
        createRequest({}, { "x-internal-secret": "test-secret" }),
        params("case-1")
      );
      expect(generatePrescreen).toHaveBeenCalledWith("case-1");
    });

    it("returns 500 on pre-screening failure", async () => {
      vi.mocked(generatePrescreen).mockRejectedValue(new Error("LLM failed"));

      const res = await prescreenRoute(
        createRequest({}, { "x-internal-secret": "test-secret" }),
        params("case-1")
      );
      expect(res.status).toBe(500);
    });
  });

  describe("POST /api/ai/summary/[opinionId]", () => {
    it("returns 401 without internal secret", async () => {
      const res = await summaryRoute(
        createRequest({}, {}),
        params("opinion-1")
      );
      expect(res.status).toBe(401);
    });

    it("triggers summary with valid secret", async () => {
      const mockResponse = new Response("stream");
      vi.mocked(generateSummary).mockResolvedValue(mockResponse as any);

      await summaryRoute(
        createRequest({}, { "x-internal-secret": "test-secret" }),
        params("opinion-1")
      );
      expect(generateSummary).toHaveBeenCalledWith("opinion-1");
    });
  });

  describe("POST /api/ai/route/[caseId]", () => {
    it("returns 401 without internal secret", async () => {
      const res = await routingRoute(
        createRequest({}, {}),
        params("case-1")
      );
      expect(res.status).toBe(401);
    });

    it("returns routing result with valid secret", async () => {
      const mockResult = {
        matchedSpecialistId: "doctor-1",
        reasoning: "Cardiology match",
        confidence: "high",
        alternatives: [],
      };
      vi.mocked(matchSpecialist).mockResolvedValue(mockResult as any);

      const res = await routingRoute(
        createRequest({}, { "x-internal-secret": "test-secret" }),
        params("case-1")
      );
      expect(matchSpecialist).toHaveBeenCalledWith("case-1");
      expect(res.status).toBe(200);
    });

    it("returns 500 on routing failure", async () => {
      vi.mocked(matchSpecialist).mockRejectedValue(new Error("No specialists"));

      const res = await routingRoute(
        createRequest({}, { "x-internal-secret": "test-secret" }),
        params("case-1")
      );
      expect(res.status).toBe(500);
    });
  });
});
```

- [ ] **Step 2: Run all tests**

Run: `npx vitest run`
Expected: All tests pass (unit + integration).

- [ ] **Step 3: Commit**

```bash
git add __tests__/integration/ai-routes.test.ts
git commit -m "test(ai): add integration tests for AI API routes"
```

---

### Task 15: Update Existing E2E Test with AI Steps

**Files:**
- Modify: `__tests__/e2e/specialist-opinion-workflow.test.ts`

**Interfaces:**
- Extends existing test with pre-screening and summary generation steps

- [ ] **Step 1: Add AI steps to the existing E2E test**

Add the following steps to the existing test in `__tests__/e2e/specialist-opinion-workflow.test.ts`:

After Step 1 (case creation), add pre-screening step:

```typescript
// Step 1.5: AI Pre-screening runs
vi.mocked(prisma.case.findUnique).mockResolvedValue({
  id: CASE_ID, serviceType: "SPECIALIST_OPINION",
  description: "Chest pain review", records: [],
} as any);
vi.mocked(prisma.aIPrescreen.create).mockResolvedValue({
  id: "prescreen-1", caseId: CASE_ID,
  findings: "Mild cardiomegaly noted", differentials: "Hypertensive heart disease",
  urgentFlags: null, generatedAt: new Date(),
} as any);
vi.mocked(prisma.case.update).mockResolvedValue({
  id: CASE_ID, status: "AI_PRE_SCREENED",
} as any);

// Import and call generatePrescreen (mocked at module level)
import { generatePrescreen } from "@/lib/ai/prescreen";
vi.mocked(generatePrescreen).mockResolvedValue(new Response("{}") as any);
await generatePrescreen(CASE_ID);
expect(prisma.aIPrescreen.create).toHaveBeenCalled();
```

After Step 6 (opinion signed), add summary generation step:

```typescript
// Step 6.5: Plain-language summary generated
vi.mocked(prisma.plainLanguageSummary.create).mockResolvedValue({
  id: "summary-1", opinionId: OPINION_ID,
  content: JSON.stringify({
    summary: "Your doctor found your heart is slightly enlarged.",
    keyFindings: ["Heart is slightly larger than normal"],
    nextSteps: ["Follow up with primary care doctor"],
    disclaimer: "AI-generated summary.",
  }),
  generatedAt: new Date(),
} as any);

import { generateSummary } from "@/lib/ai/summary";
vi.mocked(generateSummary).mockResolvedValue(new Response("{}") as any);
await generateSummary(OPINION_ID);
expect(prisma.plainLanguageSummary.create).toHaveBeenCalled();
```

- [ ] **Step 2: Run the E2E test**

Run: `npx vitest run __tests__/e2e/specialist-opinion-workflow.test.ts`
Expected: All steps pass.

- [ ] **Step 3: Commit**

```bash
git add __tests__/e2e/specialist-opinion-workflow.test.ts
git commit -m "test(ai): extend E2E test with pre-screening and summary steps"
```

---

### Task 16: Final Verification

**Files:** None (verification only)

- [ ] **Step 1: Run full test suite**

Run: `npx vitest run`
Expected: All tests pass.

- [ ] **Step 2: Run type check**

Run: `npx tsc --noEmit`
Expected: No type errors.

- [ ] **Step 3: Manual smoke test**

1. Start dev server: `pnpm dev`
2. Create a patient account, create a case, upload a file
3. Check server logs — pre-screening should trigger automatically
4. Check DB — `AIPrescreen` record should exist
5. Log in as doctor — case should show pre-screen in case detail
6. Write and sign opinion — summary should generate
7. Log in as patient — case should show plain-language summary

- [ ] **Step 4: Final commit (if any fixes needed)**

```bash
git add -A
git commit -m "feat(ai): phase 3 complete — routing, pre-screening, and summary"
```
