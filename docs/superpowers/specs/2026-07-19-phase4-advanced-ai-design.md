# Phase 4: Advanced AI Features — Design Spec

**Date:** 2026-07-19
**Status:** Approved
**Scope:** Multi-opinion synthesis, Follow-up Q&A, Result trend analysis

---

## 1. Overview

Phase 4 adds three AI features that build on the Phase 3 foundation (routing, pre-screening, summary). All features follow the established pattern: Zod schema → OpenAI via Vercel AI SDK → Prisma persistence → API route. All outputs watermarked as "AI-Generated Draft" and never constitute clinical diagnosis.

**Key decisions from brainstorming:**
- Multi-opinion synthesis auto-triggers on 2nd signed opinion
- Follow-up Q&A is single-turn, strict scope (opinion content only)
- Result trend analysis is a free auto-feature with basic trend detection
- Architecture: Direct extension of existing Phase 3 patterns

---

## 2. Database Schema Changes

### New Enum

```prisma
enum SynthesisStatus {
  PENDING
  GENERATED
  DELIVERED
}
```

### New Models

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

model TrendAnalysis {
  id          String   @id @default(cuid())
  patientId   String
  metricName  String
  dataPoints  Json     // Array of {date, value, unit, referenceRange, status}
  trend       String   // "rising", "falling", "stable", "fluctuating"
  significant Boolean  @default(false)
  summary     String
  generatedAt DateTime @default(now())

  patient     User     @relation(fields: [patientId], references: [id], onDelete: Cascade)

  @@unique([patientId, metricName])
}
```

### Existing Model Updates

The `FollowUpQuestion` model already exists and will be used as-is. Add relations to existing models:

```prisma
// Add to Case model:
model Case {
  // ... existing fields ...
  synthesis OpinionSynthesis?   // One-to-one with OpinionSynthesis
}

// Add to User model:
model User {
  // ... existing fields ...
  trendAnalyses TrendAnalysis[]  // One-to-many with TrendAnalysis
}
```

---

## 3. Multi-opinion Synthesis

### Purpose

When a case receives opinions from 2+ specialists, synthesize areas of agreement and disagreement into a consensus summary. Saves the patient from manually reconciling conflicting reports.

### Architecture

| Component | File | Description |
|-----------|------|-------------|
| Schema + Prompt | `lib/ai/prompts/synthesis.ts` | Zod schema and system prompt |
| Module | `lib/ai/synthesis.ts` | Core synthesis logic |
| API Route | `app/api/ai/synthesis/[caseId]/route.ts` | HTTP endpoint |

### Zod Schema

```typescript
synthesisSchema = z.object({
  summary: z.string().min(50).describe("Consensus summary of all opinions"),
  agreements: z.array(z.string()).min(1).describe("Areas where specialists agree"),
  disagreements: z.array(z.string()).describe("Areas where specialists disagree"),
  confidence: z.enum(["low", "medium", "high"]),
})
```

### System Prompt

```
You are a medical synthesis assistant. Your role is to identify areas of agreement
and disagreement across multiple specialist opinions for the same case.

RULES:
- You are NOT diagnosing. You are synthesizing what specialists have stated.
- Highlight areas of consensus first, then areas of divergence.
- If opinions conflict, present both perspectives neutrally.
- Be concise but thorough — every significant disagreement should be noted.
- If all opinions agree, state that clearly with an empty disagreements array.
```

### Trigger Flow

1. Specialist signs opinion → `SpecialistOpinion.status = "SIGNED"`
2. After save, count signed opinions for the case
3. If count >= 2 and no existing `OpinionSynthesis` for this case → trigger synthesis
4. Fire-and-forget POST to `/api/ai/synthesis/[caseId]` (same pattern as routing)
5. Synthesis fetches all signed opinions, strips PHI, sends to LLM
6. Saves `OpinionSynthesis` record with `status = "GENERATED"`

### Data Flow

```
Opinion signed → Check signed opinion count ≥ 2
  → Fetch all signed opinions for case
  → Strip PHI from each opinion content
  → Combine into single prompt with all opinions
  → LLM generates synthesis
  → Save OpinionSynthesis (status: GENERATED)
  → Update case metadata (optional: add synthesis flag)
```

---

## 4. Follow-up Q&A

### Purpose

After report delivery, patients can ask questions about the specialist's findings. AI answers strictly within the documented scope of the written opinion.

### Architecture

| Component | File | Description |
|-----------|------|-------------|
| Schema + Prompt | `lib/ai/prompts/followup.ts` | Zod schema and system prompt |
| Module | `lib/ai/followup.ts` | Core Q&A logic |
| API Route | `app/api/ai/followup/route.ts` | HTTP endpoint (POST) |

### Zod Schema

```typescript
followupSchema = z.object({
  answer: z.string().min(20).describe("Answer to the patient's question"),
  scopeNote: z.string().nullable().describe("Explanation if question was out of scope"),
  confidence: z.enum(["low", "medium", "high"]),
  inScope: z.boolean().describe("Whether the question was within the opinion's scope"),
})
```

### System Prompt

```
You are a follow-up assistant for a medical diagnostic platform. A patient has
received a specialist's written opinion and is asking a follow-up question.

RULES:
- Answer ONLY based on the content of the specialist's written opinion.
- If the question asks for diagnosis, treatment changes, or information not in
  the opinion, set inScope to false and explain the limitation.
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
```

### Data Flow

```
Patient submits question + opinionId
  → Fetch signed opinion + plain language summary
  → Strip PHI from opinion content
  → Build prompt: opinion content + patient question
  → LLM generates answer with scope check
  → Save FollowUpQuestion record
  → Return answer to patient
```

---

## 5. Result Trend Analysis

### Purpose

For patients with repeat lab tests, track longitudinal trends and flag statistically significant changes. Free auto-feature — runs whenever a new lab result is created.

### Architecture

| Component | File | Description |
|-----------|------|-------------|
| Schema + Prompt | `lib/ai/prompts/trends.ts` | Zod schema and system prompt |
| Module | `lib/ai/trends.ts` | Core trend analysis logic |
| API Route | `app/api/ai/trends/[patientId]/route.ts` | HTTP endpoint (GET) |

### Zod Schema

```typescript
trendAnalysisSchema = z.object({
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
})
```

### System Prompt

```
You are a lab result trend analyst. You analyze longitudinal lab data and identify
significant trends for patient monitoring.

RULES:
- You are NOT diagnosing. You are describing statistical trends in lab values.
- "Significant" means: trend direction changed, OR 2+ consecutive values outside
  reference range, OR consistent upward/downward trajectory over 3+ data points.
- Be specific about direction and magnitude.
- Use plain language — the patient will read this.
- If only 2 data points exist, note that the trend is preliminary.

TREND CLASSIFICATION:
- rising: Consistent upward trajectory (2+ consecutive increases)
- falling: Consistent downward trajectory (2+ consecutive decreases)
- stable: No significant change (values within similar range)
- fluctuating: Up and down movement without clear direction
```

### Trigger Flow

1. New `LabResult` created for a patient
2. After save, fetch all `LabResult` + `LabMetric` for the patient
3. Group metrics by name (e.g., "Glucose", "Creatinine")
4. For each metric with 2+ data points → analyze trend
5. Basic detection logic (no LLM needed for statistical analysis):
   - Compare each value to reference range
   - Track direction between consecutive values
   - Flag if direction changed or 2+ consecutive out-of-range
6. If significant → LLM generates plain-language summary
7. Save `TrendAnalysis` record (upsert on patientId + metricName)
8. GET endpoint returns all pre-computed trend analyses for patient dashboard

### Detection Logic (No LLM)

```typescript
function analyzeTrend(dataPoints: Array<{value: number, status: string}>) {
  if (dataPoints.length < 2) return { trend: "stable", significant: false };

  const directions = [];
  for (let i = 1; i < dataPoints.length; i++) {
    const diff = dataPoints[i].value - dataPoints[i-1].value;
    if (diff > 0) directions.push("up");
    else if (diff < 0) directions.push("down");
    else directions.push("stable");
  }

  const upCount = directions.filter(d => d === "up").length;
  const downCount = directions.filter(d => d === "down").length;
  const outOfRange = dataPoints.filter(d => d.status !== "NORMAL").length;

  const significant = outOfRange >= 2 || upCount >= 2 || downCount >= 2;

  let trend = "stable";
  if (upCount >= 2) trend = "rising";
  else if (downCount >= 2) trend = "falling";
  else if (upCount > 0 && downCount > 0) trend = "fluctuating";

  return { trend, significant };
}
```

### Summary Generation (LLM)

The statistical analysis (rising/falling/stable/fluctuating + significance) runs without LLM. The plain-language summary is generated via LLM **at analysis time** (after lab result creation), not at GET time:

1. Statistical analysis determines trend direction and significance
2. If significant, LLM generates plain-language summary explaining the trend
3. Both statistical result + summary saved to `TrendAnalysis` record
4. GET endpoint returns pre-computed records (no LLM call)

Example summary: "Your glucose levels have been rising over the last 3 tests. This may warrant discussion with your doctor."

---

## 6. API Routes

### POST /api/ai/synthesis/[caseId]

- **Auth:** x-internal-secret header
- **Input:** caseId (path param)
- **Output:** SSE stream of synthesis object
- **Errors:** 401 (unauthorized), 500 (synthesis failed)

### POST /api/ai/followup

- **Auth:** Session-based (patient must be logged in)
- **Input:** `{ opinionId, question }` (body)
- **Output:** SSE stream of followup answer object
- **Errors:** 401 (unauthenticated), 404 (opinion not found), 500 (Q&A failed)

### GET /api/ai/trends/[patientId]

- **Auth:** Session-based (patient must be logged in, can only access own data)
- **Input:** patientId (path param)
- **Output:** Array of TrendAnalysis records
- **Errors:** 401 (unauthenticated), 403 (forbidden), 500 (analysis failed)

---

## 7. Testing Strategy

### Unit Tests (`__tests__/unit/prompts.test.ts`)

Add tests for:
- `synthesisSchema` validation (valid output, missing fields, empty arrays)
- `followupSchema` validation (valid output, scope boundaries)
- `trendAnalysisSchema` validation (valid output, invalid trend values)

### Integration Tests (`__tests__/integration/ai-routes.test.ts`)

Add tests for:
- Synthesis route auth (401 without/with wrong secret)
- Follow-up route auth (401 unauthenticated)
- Trends route auth (401 unauthenticated, 403 wrong patient)
- Error handling for missing case/opinion/patient

### Edge Cases

| Scenario | Handling |
|----------|----------|
| Case with 3+ opinions | All opinions included in synthesis prompt |
| Q&A on unsigned opinion | Error: opinion must be signed first |
| Patient with 1 lab result | No trend analysis generated |
| Same metric with different units | Normalize before comparison |
| All opinions agree | Empty disagreements array, synthesis notes consensus |
| Question out of scope | inScope: false, scopeNote explains limitation |

---

## 8. Implementation Order

1. **Database schema** — Add new enums and models, run migration
2. **Multi-opinion synthesis** — Schema, module, API route, trigger logic
3. **Follow-up Q&A** — Schema, module, API route
4. **Result trend analysis** — Schema, detection logic, summary generation, API route
5. **Unit tests** — Schema validation for all new features
6. **Integration tests** — Route auth and error handling for all new features
7. **Trigger integration** — Wire synthesis trigger into opinion signing flow, trend trigger into lab result creation

---

## 9. File Structure

```
lib/ai/
  synthesis.ts          # Multi-opinion synthesis module
  followup.ts           # Follow-up Q&A module
  trends.ts             # Result trend analysis module
  prompts/
    synthesis.ts        # Synthesis Zod schema + prompt
    followup.ts         # Follow-up Zod schema + prompt
    trends.ts           # Trends Zod schema + prompt

app/api/ai/
  synthesis/[caseId]/route.ts   # Synthesis endpoint
  followup/route.ts             # Follow-up Q&A endpoint
  trends/[patientId]/route.ts   # Trend analysis endpoint

__tests__/
  unit/prompts.test.ts          # Add schema tests
  integration/ai-routes.test.ts # Add route tests
```
