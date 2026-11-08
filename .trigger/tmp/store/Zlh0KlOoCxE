import {
  aiModel,
  streamObject
} from "../../chunk-RV4KBN5L.mjs";
import "../../chunk-KOYVPRES.mjs";
import {
  prisma
} from "../../chunk-M366MOAD.mjs";
import {
  external_exports2 as external_exports,
  task
} from "../../chunk-UTPLH5KB.mjs";
import "../../chunk-N2VJDWOE.mjs";
import "../../chunk-UT4CBAZP.mjs";
import {
  __name,
  init_esm
} from "../../chunk-JUPALWCH.mjs";

// trigger/tasks/ai-trends.ts
init_esm();

// lib/ai/trends.ts
init_esm();

// lib/ai/prompts/trends.ts
init_esm();
var trendAnalysisSchema = external_exports.object({
  metricName: external_exports.string(),
  trend: external_exports.enum(["rising", "falling", "stable", "fluctuating"]),
  significant: external_exports.boolean(),
  summary: external_exports.string().describe("Plain-language explanation of the trend"),
  dataPoints: external_exports.array(external_exports.object({
    date: external_exports.string(),
    value: external_exports.number(),
    unit: external_exports.string(),
    referenceRange: external_exports.string(),
    status: external_exports.enum(["NORMAL", "HIGH", "LOW"])
  }))
});
var trendAnalysisSystemPrompt = `You are a lab result trend analyst. You analyze longitudinal lab data and identify significant trends for patient monitoring.

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

// lib/ai/trends.ts
var WATERMARK = "AI-Generated Draft — requires specialist review";
function analyzeTrend(dataPoints) {
  if (dataPoints.length < 2) {
    return { trend: "stable", significant: false };
  }
  const directions = [];
  for (let i = 1; i < dataPoints.length; i++) {
    const diff = dataPoints[i].value - dataPoints[i - 1].value;
    if (diff > 0) directions.push("up");
    else if (diff < 0) directions.push("down");
    else directions.push("stable");
  }
  const upCount = directions.filter((d) => d === "up").length;
  const downCount = directions.filter((d) => d === "down").length;
  const outOfRange = dataPoints.filter((d) => d.status !== "NORMAL").length;
  const hasMixedDirections = upCount > 0 && downCount > 0;
  let trend = "stable";
  if (hasMixedDirections) {
    const values = dataPoints.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const relativeRange = (max - min) / mean;
    trend = relativeRange > 0.05 ? "fluctuating" : "stable";
  } else if (upCount >= 2) {
    trend = "rising";
  } else if (downCount >= 2) {
    trend = "falling";
  }
  const significant = outOfRange >= 2 || upCount >= 2 || downCount >= 2;
  return { trend, significant };
}
__name(analyzeTrend, "analyzeTrend");
async function generateTrendAnalysis(patientId) {
  const labResults = await prisma.labResult.findMany({
    where: { patientId },
    include: { metrics: true },
    orderBy: { date: "asc" }
  });
  if (labResults.length < 2) {
    return [];
  }
  const metricGroups = {};
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
        status: metric.status
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
        model: aiModel,
        schema: trendAnalysisSchema,
        system: trendAnalysisSystemPrompt,
        prompt: `Analyze this trend for metric "${metricName}":
Trend: ${trend}
Data points: ${JSON.stringify(dataPoints)}`
      });
      const object = await result.object;
      if (object) {
        summary = object.summary;
      }
    } else {
      summary = `Your ${metricName.toLowerCase()} levels have remained stable.`;
    }
    const trendRecord = await prisma.trendAnalysis.upsert({
      where: {
        patientId_metricName: { patientId, metricName }
      },
      update: {
        dataPoints,
        trend,
        significant,
        summary: significant ? `${WATERMARK}

${summary}` : summary
      },
      create: {
        patientId,
        metricName,
        dataPoints,
        trend,
        significant,
        summary: significant ? `${WATERMARK}

${summary}` : summary
      }
    });
    analyses.push(trendRecord);
  }
  return analyses;
}
__name(generateTrendAnalysis, "generateTrendAnalysis");

// trigger/tasks/ai-trends.ts
var aiTrendsTask = task({
  id: "ai-trends",
  run: /* @__PURE__ */ __name(async ({ patientId }) => {
    const analyses = await generateTrendAnalysis(patientId);
    return { patientId, analyzed: true, metrics: analyses.length };
  }, "run")
});
export {
  aiTrendsTask
};
//# sourceMappingURL=ai-trends.mjs.map
