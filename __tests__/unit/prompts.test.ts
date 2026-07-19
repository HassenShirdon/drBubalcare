import { describe, it, expect } from "vitest";
import { prescreenSchema } from "@/lib/ai/prompts/prescreen";
import { summarySchema } from "@/lib/ai/prompts/summary";
import { routingSchema } from "@/lib/ai/prompts/routing";
import { synthesisSchema } from "@/lib/ai/prompts/synthesis";
import { followupSchema } from "@/lib/ai/prompts/followup";
import { trendAnalysisSchema } from "@/lib/ai/prompts/trends";

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
    const result = prescreenSchema.safeParse({ findings: ["test"] });
    expect(result.success).toBe(false);
  });

  it("rejects invalid confidence level", () => {
    const result = prescreenSchema.safeParse({
      findings: ["test"], differentials: ["test"], urgentFlags: [], confidence: "very_high",
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
      summary: "test", keyFindings: [], nextSteps: [], disclaimer: "test",
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
      matchedSpecialistId: "", reasoning: "test", confidence: "medium", alternatives: [],
    });
    expect(result.success).toBe(false);
  });
});

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
