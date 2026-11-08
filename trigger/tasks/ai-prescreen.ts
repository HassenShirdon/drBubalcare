import { task, tasks } from "@trigger.dev/sdk";
import { generatePrescreen } from "@/lib/ai/prescreen";

export const aiPrescreenTask = task({
  id: "ai-prescreen",
  run: async ({ caseId }: { caseId: string }) => {
    const response = await generatePrescreen(caseId);

    if (response.status >= 400) {
      throw new Error(`Prescreen failed for case ${caseId} with status ${response.status}`);
    }

    await tasks.trigger("ai-routing", { caseId });

    return { caseId, prescreened: true };
  },
});
