import { describe, it, expect, vi, beforeEach } from "vitest";

const mockStreamObject = vi.fn();
const mockCaseFindUnique = vi.fn();
const mockSynthesisFindUnique = vi.fn();
const mockSynthesisCreate = vi.fn();

vi.mock("ai", () => ({
  streamObject: (...args: unknown[]) => mockStreamObject(...args),
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    case: {
      findUnique: (...args: unknown[]) => mockCaseFindUnique(...args),
    },
    opinionSynthesis: {
      findUnique: (...args: unknown[]) => mockSynthesisFindUnique(...args),
      create: (...args: unknown[]) => mockSynthesisCreate(...args),
    },
  },
}));

describe("generateSynthesis", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws if case is not found", async () => {
    mockCaseFindUnique.mockResolvedValue(null);

    const { generateSynthesis } = await import("@/lib/ai/synthesis");
    await expect(generateSynthesis("case-1")).rejects.toThrow("Case not found: case-1");
  });

  it("throws if fewer than 2 signed opinions exist", async () => {
    mockCaseFindUnique.mockResolvedValue({
      id: "case-1",
      description: "Cardiology case",
      opinions: [
        { id: "opinion-1", content: "Finding A", status: "SIGNED", createdAt: new Date() },
      ],
    });

    const { generateSynthesis } = await import("@/lib/ai/synthesis");
    await expect(generateSynthesis("case-1")).rejects.toThrow(
      "Case needs at least 2 signed opinions for synthesis",
    );
  });

  it("throws if synthesis already exists for the case", async () => {
    mockCaseFindUnique.mockResolvedValue({
      id: "case-1",
      description: "Cardiology case",
      opinions: [
        { id: "opinion-1", content: "Finding A", status: "SIGNED", createdAt: new Date() },
        { id: "opinion-2", content: "Finding B", status: "SIGNED", createdAt: new Date() },
      ],
    });

    mockSynthesisFindUnique.mockResolvedValue({ id: "existing-synthesis" });

    const { generateSynthesis } = await import("@/lib/ai/synthesis");
    await expect(generateSynthesis("case-1")).rejects.toThrow(
      "Synthesis already exists for case: case-1",
    );
  });

  it("generates synthesis from multiple signed opinions", async () => {
    mockCaseFindUnique.mockResolvedValue({
      id: "case-1",
      description: "Cardiology case with chest pain",
      opinions: [
        { id: "opinion-1", content: "Mild cardiomegaly present", status: "SIGNED", createdAt: new Date() },
        { id: "opinion-2", content: "No cardiomegaly detected", status: "SIGNED", createdAt: new Date() },
      ],
    });

    mockSynthesisFindUnique.mockResolvedValue(null);

    mockStreamObject.mockImplementation(({ onFinish }) => {
      onFinish({
        object: {
          summary: "Specialists have differing views on cardiomegaly.",
          agreements: ["Both agree patient has no pleural effusion"],
          disagreements: ["Specialist 1 reports mild cardiomegaly, Specialist 2 does not"],
          confidence: "medium",
        },
      });
      return { toTextStreamResponse: () => new Response("stream") };
    });

    mockSynthesisCreate.mockResolvedValue({ id: "synthesis-1" });

    const { generateSynthesis } = await import("@/lib/ai/synthesis");
    const response = await generateSynthesis("case-1");

    expect(response).toBeInstanceOf(Response);
    expect(mockSynthesisCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        caseId: "case-1",
        agreements: expect.arrayContaining(["Both agree patient has no pleural effusion"]),
        disagreements: expect.arrayContaining([
          "Specialist 1 reports mild cardiomegaly, Specialist 2 does not",
        ]),
        status: "GENERATED",
      }),
    });
  });
});
