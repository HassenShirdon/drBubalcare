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
