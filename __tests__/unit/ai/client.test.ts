import { describe, it, expect, vi } from "vitest";

vi.mock("@ai-sdk/openai", () => ({
  createOpenAI: vi.fn(() => vi.fn((model: string) => ({ model, provider: "openai" }))),
}));

describe("AI Client", () => {
  it("exports openaiModel configured with gpt-4o", async () => {
    const { openaiModel } = await import("@/lib/ai/client");
    expect(openaiModel).toEqual({ model: "gpt-4o", provider: "openai" });
  });

  it("passes the API key from environment to createOpenAI", async () => {
    const { createOpenAI } = await import("@ai-sdk/openai");
    expect(createOpenAI).toHaveBeenCalledWith(
      expect.objectContaining({ apiKey: process.env.OPENAI_API_KEY }),
    );
  });
});
