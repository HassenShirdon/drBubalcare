import { task } from "@trigger.dev/sdk";
import { matchSpecialist } from "@/lib/ai/routing";

export const aiRoutingTask = task({
  id: "ai-routing",
  run: async ({ caseId }: { caseId: string }) => {
    const result = await matchSpecialist(caseId);

    if (!result.matchedSpecialistId) {
      console.warn(`No specialist matched for case ${caseId}: ${result.reasoning}`);
      return { caseId, routed: false, reasoning: result.reasoning };
    }

    return { caseId, routed: true, specialistId: result.matchedSpecialistId };
  },
});
