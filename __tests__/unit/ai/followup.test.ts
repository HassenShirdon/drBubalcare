import { describe, it, expect, vi, beforeEach } from "vitest";

const mockStreamObject = vi.fn();
const mockOpinionFindUnique = vi.fn();
const mockFollowUpCreate = vi.fn();

vi.mock("ai", () => ({
  streamObject: (...args: unknown[]) => mockStreamObject(...args),
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    specialistOpinion: {
      findUnique: (...args: unknown[]) => mockOpinionFindUnique(...args),
    },
    followUpQuestion: {
      create: (...args: unknown[]) => mockFollowUpCreate(...args),
    },
  },
}));

describe("answerFollowUp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws if opinion is not found", async () => {
    mockOpinionFindUnique.mockResolvedValue(null);

    const { answerFollowUp } = await import("@/lib/ai/followup");
    await expect(answerFollowUp("opinion-1", "What does this mean?")).rejects.toThrow(
      "Opinion not found: opinion-1",
    );
  });

  it("throws if opinion is not signed", async () => {
    mockOpinionFindUnique.mockResolvedValue({
      id: "opinion-1",
      status: "DRAFT",
      content: "Findings...",
      case: {},
      plainSummary: null,
    });

    const { answerFollowUp } = await import("@/lib/ai/followup");
    await expect(answerFollowUp("opinion-1", "What does this mean?")).rejects.toThrow(
      "Opinion must be signed before answering follow-ups",
    );
  });

  it("answers an in-scope question", async () => {
    mockOpinionFindUnique.mockResolvedValue({
      id: "opinion-1",
      status: "SIGNED",
      content: "Clinical Findings: Mild cardiomegaly. Impression: Hypertensive heart disease.",
      case: { id: "case-1" },
      plainSummary: null,
    });

    mockStreamObject.mockImplementation(({ onFinish }) => {
      onFinish({
        object: {
          answer: "The specialist found that your heart is slightly larger than normal.",
          scopeNote: null,
          confidence: "high",
          inScope: true,
        },
      });
      return { toTextStreamResponse: () => new Response("stream") };
    });

    mockFollowUpCreate.mockResolvedValue({ id: "followup-1" });

    const { answerFollowUp } = await import("@/lib/ai/followup");
    const response = await answerFollowUp("opinion-1", "What did the specialist find?");

    expect(response).toBeInstanceOf(Response);
    expect(mockFollowUpCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        opinionId: "opinion-1",
        answer: "The specialist found that your heart is slightly larger than normal.",
        scopeNote: null,
      }),
    });
  });

  it("marks out-of-scope questions", async () => {
    mockOpinionFindUnique.mockResolvedValue({
      id: "opinion-1",
      status: "SIGNED",
      content: "Clinical Findings: Mild cardiomegaly.",
      case: { id: "case-1" },
      plainSummary: null,
    });

    mockStreamObject.mockImplementation(({ onFinish }) => {
      onFinish({
        object: {
          answer: "I cannot provide information about treatment options.",
          scopeNote: "This question requires clinical judgment beyond the documented findings.",
          confidence: "high",
          inScope: false,
        },
      });
      return { toTextStreamResponse: () => new Response("stream") };
    });

    mockFollowUpCreate.mockResolvedValue({ id: "followup-2" });

    const { answerFollowUp } = await import("@/lib/ai/followup");
    const response = await answerFollowUp("opinion-1", "What medication should I take?");

    expect(response).toBeInstanceOf(Response);
    expect(mockFollowUpCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        opinionId: "opinion-1",
        scopeNote: "This question requires clinical judgment beyond the documented findings.",
      }),
    });
  });
});
