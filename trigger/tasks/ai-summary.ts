import { task } from "@trigger.dev/sdk";
import { generateSummary } from "@/lib/ai/summary";

export const aiSummaryTask = task({
  id: "ai-summary",
  run: async ({ opinionId }: { opinionId: string }) => {
    const response = await generateSummary(opinionId);

    if (response.status >= 400) {
      throw new Error(`Summary generation failed for opinion ${opinionId} with status ${response.status}`);
    }

    return { opinionId, summarized: true };
  },
});
