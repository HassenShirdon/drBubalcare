# Phase 3: AI Features — Design Spec

**Date:** 2026-07-19
**Status:** Approved
**Scope:** Three AI features — intelligent case routing, AI pre-screening, plain-language summary

---

## Overview

Phase 3 adds the AI feature layer to Dr. Bubal Care. All three features assist specialists — not replace them. Every AI output is logged, watermarked as "AI-Generated Draft," and requires human sign-off. The core principle holds: **AI surfaces; specialists decide.**

**Provider:** OpenAI via Vercel AI SDK (`ai` + `@ai-sdk/openai`)
**Trigger model:** Automatic on state change (no manual buttons)
**Response model:** Streaming to client via SSE

---

## Dependencies

```bash
pnpm add ai @ai-sdk/openai
```

- `ai` — Vercel AI SDK core (streaming, structured output, tool use)
- `@ai-sdk/openai` — OpenAI provider for the AI SDK

Environment variable: `OPENAI_API_KEY` added to `.env.example` and `.env`.

---

## File Structure

```
lib/ai/
├── client.ts          # OpenAI model instance via @ai-sdk/openai
├── phi-stripper.ts    # Strip PII before any LLM call
├── prompts/
│   ├── prescreen.ts   # Pre-screening system prompt + Zod output schema
│   ├── summary.ts     # Plain-language summary prompt + schema
│   └── routing.ts     # Case routing prompt + schema
├── prescreen.ts       # generatePrescreen(caseId) — streams AI pre-screen
├── summary.ts         # generateSummary(opinionId) — streams plain-language summary
└── routing.ts         # matchSpecialist(caseId) — returns structured match
```

---

## AI Safety Principles

### PHI Stripping (`phi-stripper.ts`)

Before any text reaches the LLM, the following are stripped:

| Pattern | Replacement |
|---------|-------------|
| Patient names | `[PATIENT]` |
| Dates of birth | `[DOB]` |
| Medical record numbers | `[MRN]` |
| Email addresses | `[EMAIL]` |
| Phone numbers | `[PHONE]` |
| Addresses | `[ADDRESS]` |

Implementation: regex-based stripping function. Clinical content (diagnoses, lab values, tissue descriptions, medications) passes through untouched.

### Safety Watermark

Every AI output stores a `watermark` field: `"AI-Generated Draft — requires specialist review"`. This is:

1. Stored in the database alongside the content
2. Displayed as a visible banner in the UI above the AI-generated content
3. Never removed — persists for audit trail

### No Clinical Diagnosis

AI is strictly forbidden from offering definitive clinical diagnoses. All prompts include explicit instructions: "You are NOT diagnosing. You are surfacing information for a specialist to review."

---

## Feature 1: Intelligent Case Routing

### Trigger

When a case has `status = AI_PRE_SCREENED` (after pre-screening completes) and `specialistId` is null.

### Flow

1. Case pre-screening completes → `Case.status = AI_PRE_SCREENED`, `specialistId = null`
2. API route calls `matchSpecialist(caseId)`
3. PHI stripped from case description
4. OpenAI analyzes: case description, service type, urgency flags (derived from case description — keywords like "urgent", "acute", "critical", "stat", "emergency")
5. Query available specialists from DB (verified, matching subspecialty)
6. LLM ranks top candidates by fit
7. Best match assigned → `Case.specialistId = matchedDoctorId`, `Case.status = UNDER_REVIEW`
8. If no match found → case stays `AI_PRE_SCREENED`, admin alerted

### Structured Output Schema

```typescript
import { z } from "zod";

const routingResultSchema = z.object({
  matchedSpecialistId: z.string().describe("ID of the best-matching specialist"),
  reasoning: z.string().describe("Why this specialist was chosen"),
  confidence: z.enum(["low", "medium", "high"]),
  alternatives: z.array(z.string()).describe("Other considered specialist IDs"),
});
```

### Prompt

**System:** "You are a case routing coordinator for a medical diagnostic platform. Match this case to the most appropriate specialist based on subspecialty, case description, and current availability. Consider urgency and specialization fit. You are not diagnosing — you are routing."

**Input:** Case description, service type, list of available specialists (id, specialty, years of experience, current case load)

**Output:** Structured JSON matching `routingResultSchema`

### Fallback

- If `confidence = "low"` or no specialists available → case remains `AI_PRE_SCREENED`
- Admin gets dashboard alert: "Case #{id} needs manual specialist assignment"
- Admin can manually assign via existing `/api/admin/cases/[id]/assign` endpoint
- Manual assignment overrides AI routing

---

## Feature 2: AI Pre-screening

### Trigger

When a case has at least one `CaseRecord` uploaded, `status = AI_PRE_SCREENED` (after routing assigns a specialist), and no `AIPrescreen` record exists yet.

### Flow

1. Case created + files uploaded
2. API route calls `generatePrescreen(caseId)`
3. PHI stripped from case description + file metadata
4. OpenAI receives structured prompt with clinical content
5. Response streams back, saves to `AIPrescreen` table
6. `Case.status` transitions to `AI_PRE_SCREENED`
7. Specialist sees pre-screen when they open the case

### Structured Output Schema

```typescript
const prescreenResultSchema = z.object({
  findings: z.array(z.string()).describe("Key clinical findings identified"),
  differentials: z.array(z.string()).describe("Differential diagnoses to consider"),
  urgentFlags: z.array(z.string()).describe("Urgency indicators (empty array if none)"),
  confidence: z.enum(["low", "medium", "high"]),
});
```

### Prompt

**System:** "You are a clinical pre-screening assistant for a diagnostic coordination platform. Analyze the following clinical information and identify key findings that a specialist should review first. You are NOT diagnosing — you are surfacing what matters most. Flag anything urgent. Be specific but concise."

**Input:** Case description, file types uploaded, any parseable text from uploaded documents

**Output:** Structured JSON matching `prescreenResultSchema`

### UI Rendering

On the doctor's case detail page (`/doctor/cases/[id]`):

- `findings` → bulleted list under "Key Findings"
- `differentials` → list under "Differentials to Consider"
- `urgentFlags` → red highlighted alert box (only if non-empty)
- `confidence` → small badge indicator
- Watermark banner: "AI-Generated Draft — requires specialist review"

---

## Feature 3: Plain-Language Summary

### Trigger

When a specialist signs their opinion (`SpecialistOpinion.status` transitions from `DRAFT` to `SIGNED`).

### Flow

1. Specialist writes opinion (findings, impression, next steps)
2. Specialist clicks "Sign & Submit" → `OpinionStatus = SIGNED`
3. API route calls `generateSummary(opinionId)`
4. PHI stripped from opinion content
5. OpenAI translates clinical language → patient-friendly text
6. Response streams, saves to `PlainLanguageSummary` table
7. `Case.status` transitions to `OPINION_READY`
8. Patient sees original report + plain-language summary

### Structured Output Schema

```typescript
const summaryResultSchema = z.object({
  summary: z.string().describe("2-3 paragraph patient-friendly explanation"),
  keyFindings: z.array(z.string()).describe("Main findings in plain language"),
  nextSteps: z.array(z.string()).describe("What the patient should do next"),
  disclaimer: z.string().describe("Standard medical disclaimer"),
});
```

### Prompt

**System:** "You are a trusted GP explaining a specialist's report to a patient. Use no medical jargon. Write as if speaking to someone with no medical background. Be clear, reassuring, and honest. If medical terms are necessary, explain them in parentheses. Include a standard disclaimer that this is an AI-generated summary and does not replace professional medical advice."

**Input:** Specialist's signed opinion (findings, clinical impression, recommended next steps)

**Output:** Structured JSON matching `summaryResultSchema`

### UI Rendering

On the patient's case detail page (`/patient/cases/[id]`):

- Specialist's original report displayed first (structured: findings, impression, next steps)
- Below it, distinct card: "Plain-Language Summary"
  - `summary` → paragraph text
  - `keyFindings` → bulleted list
  - `nextSteps` → numbered action list
  - `disclaimer` → italicized footer text
- Watermark banner: "AI-Generated Draft — for informational purposes only"

---

## API Routes

### POST `/api/ai/prescreen/[caseId]`

- Triggers pre-screening for a case
- Returns streaming response (SSE)
- Saves result to `AIPrescreen` table
- Updates `Case.status` to `AI_PRE_SCREENED`
- Auth: Internal API — uses `x-internal-secret` header (set in env) to prevent external abuse. Called by server-side triggers, not client-side.

### POST `/api/ai/summary/[opinionId]`

- Triggers plain-language summary for a signed opinion
- Returns streaming response (SSE)
- Saves result to `PlainLanguageSummary` table
- Updates `Case.status` to `OPINION_READY`
- Auth: Internal API — uses `x-internal-secret` header

### POST `/api/ai/route/[caseId]`

- Triggers intelligent routing for a new case
- Returns JSON (not streaming — routing is fast)
- Updates `Case.specialistId` and `Case.status`
- Auth: Internal API — uses `x-internal-secret` header

---

## State Transitions (Updated)

```
Case.status: OPEN → AI_PRE_SCREENED → UNDER_REVIEW → OPINION_READY → CLOSED
              │              │                            ↑
              │              └── (routing fails) ─────────┘
              │                  stays AI_PRE_SCREENED, admin alerted
              │                  admin manual assign → UNDER_REVIEW
              └── (pre-screen fails) → stays OPEN, admin alerted
```

---

## Database Changes

**None.** All models (`AIPrescreen`, `PlainLanguageSummary`, `Case`, etc.) already exist in the Prisma schema from Phase 1. The `AIPrescreen` model already has `findings`, `differentials`, `urgentFlags` fields. `PlainLanguageSummary` has `content` and `generatedAt`. No schema migration needed.

---

## Error Handling

| Scenario | Handling |
|----------|----------|
| OpenAI API failure | Log error, case stays in current status, retry once after 30s, then alert admin |
| PHI stripping failure | Log warning, strip all text as fallback (over-strip rather than under-strip) |
| No specialists available for routing | Case stays `AI_PRE_SCREENED`, admin alerted |
| Malformed AI response | Log raw response, alert admin, case stays in current status |
| Rate limiting | Queue requests, process sequentially, alert if queue > 10 |

---

## Testing Strategy

1. **Unit tests** for `phi-stripper.ts` — verify all PII patterns are stripped
2. **Unit tests** for prompt templates — verify schema validation
3. **Integration tests** for API routes — mock OpenAI responses, verify DB writes
4. **E2E test** extending existing `specialist-opinion-workflow.test.ts` — add pre-screening + summary steps

---

## Implementation Order

1. Install dependencies (`ai`, `@ai-sdk/openai`)
2. Add `OPENAI_API_KEY` and `INTERNAL_API_SECRET` to `.env.example`
3. Build `lib/ai/client.ts` — OpenAI model instance
4. Build `lib/ai/phi-stripper.ts` — PHI stripping utility
5. Build `lib/ai/prompts/` — all three prompt templates + Zod schemas
6. Build `lib/ai/prescreen.ts` — pre-screening logic
7. Build `lib/ai/summary.ts` — summary generation logic
8. Build `lib/ai/routing.ts` — case routing logic
9. Build API routes (`/api/ai/prescreen`, `/api/ai/summary`, `/api/ai/route`)
10. Wire pre-screening trigger into case creation/file upload workflow
11. Wire routing trigger into post-pre-screening workflow
12. Wire summary trigger into opinion signing workflow
13. Update UI components to render AI outputs with watermarks
14. Write tests
15. Manual end-to-end verification
