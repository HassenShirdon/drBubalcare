import { schedules } from "@trigger.dev/sdk";
import { checkUnmatchedCases } from "@/lib/edge-cases/service";
import { executePendingDeletions } from "@/lib/gdpr/service";

export const checkNoSpecialistTask = schedules.task({
  id: "check-no-specialist",
  cron: "*/15 * * * *",
  run: async () => {
    await checkUnmatchedCases();
    return { checked: true };
  },
});

export const executeDeletionTask = schedules.task({
  id: "execute-deletion",
  cron: "0 3 * * *",
  run: async () => {
    const count = await executePendingDeletions();
    return { executedDeletions: count };
  },
});
