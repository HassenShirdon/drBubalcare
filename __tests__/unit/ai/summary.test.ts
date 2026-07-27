import { describe, it, expect, vi, beforeEach } from "vitest";

const mockStreamObject = vi.fn();
const mockToTextStreamResponse = vi.fn(() => new Response("stream"));
const mockOpinionFindUnique = vi.fn();
const mockPlainSummaryCreate = vi.fn();
const mockCaseUpdate = vi.fn();

vi.mock("ai", () => ({
  streamObject: (...args: unknown[]) => mockStreamObject(...args),
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    specialistOpinion: {
      findUnique: (...args: unknown[]) => mockOpinionFindUnique(...args),
    },
    plainLanguageSummary: {
      create: (...args: unknown[]) => mockPlainSummaryCreate(...args),
    },
    case: {
      update: (...args: unknown[]) => mockCaseUpdate(...args),
    },
  },
}));

const WATERMARK = "AI-Generated Draft — requires specialist review";

describe("generateSummary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws if opinion is not found", async () => {
    mockOpinionFindUnique.mockResolvedValue(null);
    mockStreamObject.mockReturnValue({
      object: Promise.resolve(null),
      toTextStreamResponse: mockToTextStreamResponse,
    });

    const { generateSummary } = await import("@/lib/ai/summary");
    await expect(generateSummary("opinion-1")).rejects.toThrow("Opinion not found: opinion-1");
  });

  it("throws if opinion is not signed", async () => {
    mockOpinionFindUnique.mockResolvedValue({
      id: "opinion-1",
      status: "DRAFT",
      content: "Findings...",
      case: { id: "case-1" },
    });
    mockStreamObject.mockReturnValue({
      object: Promise.resolve(null),
      toTextStreamResponse: mockToTextStreamResponse,
    });

    const { generateSummary } = await import("@/lib/ai/summary");
    await expect(generateSummary("opinion-1")).rejects.toThrow(
      "Opinion must be signed before generating summary",
    );
  });

  it("generates plain-language summary for a signed opinion", async () => {
    mockOpinionFindUnique.mockResolvedValue({
      id: "opinion-1",
      caseId: "case-1",
      status: "SIGNED",
      content: "Clinical Findings: Mild cardiomegaly noted on chest X-ray.",
      case: { id: "case-1" },
    });

    const structuredOutput = {
      summary: "Your heart is slightly larger than normal.",
      keyFindings: ["Heart is slightly larger than expected"],
      nextSteps: ["Follow up with your primary care doctor"],
      disclaimer: "This is an AI-generated summary.",
    };

    mockStreamObject.mockReturnValue({
      object: Promise.resolve(structuredOutput),
      toTextStreamResponse: mockToTextStreamResponse,
    });
    mockPlainSummaryCreate.mockResolvedValue({ id: "summary-1" });
    mockCaseUpdate.mockResolvedValue({ id: "case-1", status: "OPINION_READY" });

    const { generateSummary } = await import("@/lib/ai/summary");
    await generateSummary("opinion-1");

    expect(mockPlainSummaryCreate).toHaveBeenCalledWith({
      data: {
        opinionId: "opinion-1",
        content: `${WATERMARK}\n\n${JSON.stringify(structuredOutput)}`,
      },
    });
    expect(mockCaseUpdate).toHaveBeenCalledWith({
      where: { id: "case-1" },
      data: { status: "OPINION_READY" },
    });
  });
});
