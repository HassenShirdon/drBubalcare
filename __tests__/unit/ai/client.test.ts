import { describe, it, expect, vi } from "vitest";

vi.mock("@ai-sdk/openai", () => ({
  createOpenAI: vi.fn(() => vi.fn((model: string) => ({ model, provider: "openai-compatible" }))),
}));

vi.mock("@opencode-ai/sdk", () => ({
  createOpencode: vi.fn(() => Promise.resolve({ client: { mock: true } })),
}));

describe("AI Client", () => {
  it("exports aiModel configured with deepseek-chat", async () => {
    const { aiModel } = await import("@/lib/ai/client");
    expect(aiModel).toEqual({ model: "deepseek-chat", provider: "openai-compatible" });
  });

  it("exports getOpencodeClient that returns a client", async () => {
    const { getOpencodeClient } = await import("@/lib/ai/client");
    const client = await getOpencodeClient();
    expect(client).toEqual({ mock: true });
  });
});