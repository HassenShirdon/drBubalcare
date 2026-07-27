import { describe, it, expect, vi, beforeEach } from "vitest";

const mockStreamObject = vi.fn();
const mockToTextStreamResponse = vi.fn(() => new Response("stream"));
const mockCaseFindUnique = vi.fn();
const mockAIPrescreenCreate = vi.fn();
const mockCaseUpdate = vi.fn();

vi.mock("ai", () => ({
  streamObject: (...args: unknown[]) => mockStreamObject(...args),
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    case: {
      findUnique: (...args: unknown[]) => mockCaseFindUnique(...args),
      update: (...args: unknown[]) => mockCaseUpdate(...args),
    },
    aIPrescreen: {
      create: (...args: unknown[]) => mockAIPrescreenCreate(...args),
    },
  },
}));

describe("generatePrescreen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws if case is not found", async () => {
    mockCaseFindUnique.mockResolvedValue(null);

    const { generatePrescreen } = await import("@/lib/ai/prescreen");
    await expect(generatePrescreen("case-1")).rejects.toThrow("Case not found: case-1");
  });

  it("streams prescreen result on success", async () => {
    const mockOnFinish = vi.fn();
    mockStreamObject.mockImplementation(({ onFinish }) => {
      mockOnFinish.mockImplementation(onFinish);
      return { toTextStreamResponse: mockToTextStreamResponse };
    });

    mockCaseFindUnique.mockResolvedValue({
      id: "case-1",
      serviceType: "SPECIALIST_OPINION",
      description: "Patient with chest pain and shortness of breath",
      records: [
        { fileName: "chest-xray.dcm", fileType: "DICOM" },
      ],
    });

    mockAIPrescreenCreate.mockResolvedValue({ id: "prescreen-1" });
    mockCaseUpdate.mockResolvedValue({ id: "case-1", status: "AI_PRE_SCREENED" });

    const { generatePrescreen } = await import("@/lib/ai/prescreen");
    const response = await generatePrescreen("case-1");

    expect(response).toBeInstanceOf(Response);
    expect(mockStreamObject).toHaveBeenCalledTimes(1);

    const callArgs = mockStreamObject.mock.calls[0][0];
    expect(callArgs.model).toBeDefined();
    expect(callArgs.prompt).toContain("chest pain");

    vi.spyOn(globalThis, "fetch").mockResolvedValue({} as Response);

    await callArgs.onFinish({
      object: {
        findings: ["Mild cardiomegaly"],
        differentials: ["Hypertensive heart disease"],
        urgentFlags: [],
        confidence: "high" as const,
      },
    });

    expect(mockAIPrescreenCreate).toHaveBeenCalledWith({
      data: {
        caseId: "case-1",
        findings: `AI-Generated Draft — requires specialist review\n\nMild cardiomegaly`,
        differentials: `AI-Generated Draft — requires specialist review\n\nHypertensive heart disease`,
        urgentFlags: null,
      },
    });
    expect(mockCaseUpdate).toHaveBeenCalledWith({
      where: { id: "case-1" },
      data: { status: "AI_PRE_SCREENED" },
    });
  });

  it("handles case with no description or records", async () => {
    let capturedOnFinish: Function | undefined;
    mockStreamObject.mockImplementation(({ onFinish }) => {
      capturedOnFinish = onFinish;
      return { toTextStreamResponse: mockToTextStreamResponse };
    });

    mockCaseFindUnique.mockResolvedValue({
      id: "case-2",
      serviceType: "RESULT_INTERPRETATION",
      description: null,
      records: [],
    });

    const { generatePrescreen } = await import("@/lib/ai/prescreen");
    const response = await generatePrescreen("case-2");

    expect(response).toBeInstanceOf(Response);

    const callArgs = mockStreamObject.mock.calls[0][0];
    expect(callArgs.prompt).toContain("No records uploaded yet");
  });
});
