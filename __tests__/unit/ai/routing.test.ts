import { describe, it, expect, vi, beforeEach } from "vitest";

const mockGenerateObject = vi.fn();
const mockCaseFindUnique = vi.fn();
const mockDoctorFindMany = vi.fn();
const mockCaseUpdate = vi.fn();

vi.mock("ai", () => ({
  generateObject: (...args: unknown[]) => mockGenerateObject(...args),
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    case: {
      findUnique: (...args: unknown[]) => mockCaseFindUnique(...args),
      update: (...args: unknown[]) => mockCaseUpdate(...args),
    },
    doctor: {
      findMany: (...args: unknown[]) => mockDoctorFindMany(...args),
    },
  },
}));

describe("matchSpecialist", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws if case is not found", async () => {
    mockCaseFindUnique.mockResolvedValue(null);

    const { matchSpecialist } = await import("@/lib/ai/routing");
    await expect(matchSpecialist("case-1")).rejects.toThrow("Case not found: case-1");
  });

  it("returns no-match object when no verified specialists exist", async () => {
    mockCaseFindUnique.mockResolvedValue({
      id: "case-1",
      serviceType: "SPECIALIST_OPINION",
      description: "Cardiology consult needed",
    });
    mockDoctorFindMany.mockResolvedValue([]);

    const { matchSpecialist } = await import("@/lib/ai/routing");
    const result = await matchSpecialist("case-1");

    expect(result).toEqual({
      matchedSpecialistId: null,
      reasoning: "No verified specialists available",
      confidence: "low",
      alternatives: [],
    });
  });

  it("returns low confidence when AI matched specialist is not valid", async () => {
    mockCaseFindUnique.mockResolvedValue({
      id: "case-1",
      serviceType: "SPECIALIST_OPINION",
      description: "Cardiology consult for chest pain",
    });

    mockDoctorFindMany.mockResolvedValue([
      {
        id: "doc-1",
        specialty: "Cardiology",
        experience: 10,
        verified: true,
        user: {
          id: "user-1",
          name: "Dr. Smith",
          specialistCases: [],
        },
      },
    ]);

    mockGenerateObject.mockResolvedValue({
      object: {
        matchedSpecialistId: "nonexistent-id",
        reasoning: "Matched to cardiologist",
        confidence: "medium",
        alternatives: ["user-1"],
      },
    });

    const { matchSpecialist } = await import("@/lib/ai/routing");
    const result = await matchSpecialist("case-1");

    expect(result.confidence).toBe("low");
    expect(result.matchedSpecialistId).toBeNull();
    expect(mockCaseUpdate).not.toHaveBeenCalled();
  });

  it("successfully matches and assigns a specialist", async () => {
    mockCaseFindUnique.mockResolvedValue({
      id: "case-1",
      serviceType: "SPECIALIST_OPINION",
      description: "Cardiology consult for chest pain",
    });

    mockDoctorFindMany.mockResolvedValue([
      {
        id: "doc-1",
        specialty: "Cardiology",
        experience: 10,
        verified: true,
        user: {
          id: "user-1",
          name: "Dr. Smith",
          specialistCases: [],
        },
      },
    ]);

    mockGenerateObject.mockResolvedValue({
      object: {
        matchedSpecialistId: "user-1",
        reasoning: "Cardiology case matched to experienced cardiologist",
        confidence: "high",
        alternatives: [],
      },
    });

    mockCaseUpdate.mockResolvedValue({
      id: "case-1",
      specialistId: "user-1",
      status: "UNDER_REVIEW",
    });

    const { matchSpecialist } = await import("@/lib/ai/routing");
    const result = await matchSpecialist("case-1");

    expect(result.matchedSpecialistId).toBe("user-1");
    expect(result.confidence).toBe("high");
    expect(mockCaseUpdate).toHaveBeenCalledWith({
      where: { id: "case-1" },
      data: { specialistId: "user-1", status: "UNDER_REVIEW" },
    });
  });
});
