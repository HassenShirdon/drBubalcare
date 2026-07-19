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
