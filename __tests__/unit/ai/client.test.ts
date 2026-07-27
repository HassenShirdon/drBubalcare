import { describe, it, expect, vi } from "vitest";

const mockGoClient = vi.fn((model: string) => ({ model, provider: "openai" }));
vi.mock("@ai-sdk/openai", () => ({
  createOpenAI: vi.fn(() => mockGoClient),
}));

describe("AI Client", () => {
  it("exports aiModel configured with deepseek-v4-pro via OpenCode Go", async () => {
    const { aiModel } = await import("@/lib/ai/client");
    expect(aiModel).toEqual({ model: "deepseek-v4-pro", provider: "openai" });
  });
});
