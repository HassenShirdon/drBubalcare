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
