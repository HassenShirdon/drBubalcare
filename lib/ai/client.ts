import { createOpencode } from "@opencode-ai/sdk";
import type { OpencodeClient } from "@opencode-ai/sdk/client";
import { createOpenAI } from "@ai-sdk/openai";

let _client: OpencodeClient | null = null;

export async function getOpencodeClient(): Promise<OpencodeClient> {
  if (_client) return _client;
  const opencode = await createOpencode({ timeout: 10000 });
  _client = opencode.client;
  return _client;
}

const deepseek = createOpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY ?? process.env.OPENAI_API_KEY,
});

export const aiModel = deepseek("deepseek-chat");
