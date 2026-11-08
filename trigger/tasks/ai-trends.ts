import { task } from "@trigger.dev/sdk";
import { generateTrendAnalysis } from "@/lib/ai/trends";

export const aiTrendsTask = task({
  id: "ai-trends",
  run: async ({ patientId }: { patientId: string }) => {
    const analyses = await generateTrendAnalysis(patientId);

    return { patientId, analyzed: true, metrics: analyses.length };
  },
});
