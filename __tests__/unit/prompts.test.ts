import { describe, it, expect } from "vitest";
import { prescreenSchema } from "@/lib/ai/prompts/prescreen";
import { summarySchema } from "@/lib/ai/prompts/summary";
import { routingSchema } from "@/lib/ai/prompts/routing";
import { synthesisSchema } from "@/lib/ai/prompts/synthesis";

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
