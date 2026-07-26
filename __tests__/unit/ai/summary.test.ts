import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSessionCreate = vi.fn();
const mockSessionPrompt = vi.fn();
const mockSessionDelete = vi.fn();
const mockOpinionFindUnique = vi.fn();
const mockPlainSummaryCreate = vi.fn();
const mockCaseUpdate = vi.fn();

vi.mock("@/lib/ai/client", () => ({
  getOpencodeClient: vi.fn(() => ({
    session: {
      create: mockSessionCreate,
      prompt: mockSessionPrompt,
      delete: mockSessionDelete,
    },
  })),
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

describe("generateSummary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws if opinion is not found", async () => {
    mockOpinionFindUnique.mockResolvedValue(null);
    mockSessionCreate.mockResolvedValue({ data: { id: "session-1" }, error: undefined });

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
    mockSessionCreate.mockResolvedValue({ data: { id: "session-1" }, error: undefined });

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

    mockSessionCreate.mockResolvedValue({ data: { id: "session-1" }, error: undefined });
    mockSessionPrompt.mockResolvedValue({
      data: {
        info: {},
        parts: [{ type: "text", text: JSON.stringify(structuredOutput) }],
      },
    });
    mockSessionDelete.mockResolvedValue(true);
    mockPlainSummaryCreate.mockResolvedValue({ id: "summary-1" });
    mockCaseUpdate.mockResolvedValue({ id: "case-1", status: "OPINION_READY" });

    const { generateSummary } = await import("@/lib/ai/summary");
    await generateSummary("opinion-1");

    expect(mockPlainSummaryCreate).toHaveBeenCalledWith({
      data: { opinionId: "opinion-1", content: JSON.stringify(structuredOutput) },
    });
    expect(mockCaseUpdate).toHaveBeenCalledWith({
      where: { id: "case-1" },
      data: { status: "OPINION_READY" },
    });
    expect(mockSessionDelete).toHaveBeenCalledWith({ path: { id: "session-1" } });
  });
});
