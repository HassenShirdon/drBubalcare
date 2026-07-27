import { createOpenAI } from "@ai-sdk/openai";

const go = createOpenAI({
  baseURL: "https://opencode.ai/zen/go/v1",
  apiKey: process.env.OPENCODE_GO_API_KEY ?? "",
});

export const aiModel = go("deepseek-v4-pro");
