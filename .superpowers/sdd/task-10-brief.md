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
  const labResults = await prisma.labResult.findMany({
    where: { patientId },
    include: { metrics: true },
    orderBy: { date: "asc" },
  });

  if (labResults.length < 2) {
    return [];
  }

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
      await result.consumeStream();
    } else {
      summary = `Your ${metricName.toLowerCase()} levels have remained stable.`;
    }

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
