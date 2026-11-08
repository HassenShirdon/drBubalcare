import { task } from "@trigger.dev/sdk";
import { generateSynthesis } from "@/lib/ai/synthesis";

export const aiSynthesisTask = task({
  id: "ai-synthesis",
  run: async ({ caseId }: { caseId: string }) => {
    const response = await generateSynthesis(caseId);

    if (response.status >= 400) {
      throw new Error(`Synthesis generation failed for case ${caseId} with status ${response.status}`);
    }

    return { caseId, synthesized: true };
  },
});
