import { streamObject } from "ai";
import { aiModel } from "./client";
import { stripPHI } from "./phi-stripper";
import { prescreenSchema, prescreenSystemPrompt } from "./prompts/prescreen";
import { prisma } from "@/lib/db";
import { getBaseUrl } from "@/lib/app-url";

const WATERMARK = "AI-Generated Draft — requires specialist review";

/**
 * Generate an AI pre-screen for a case. Streams the result via SSE.
 * Saves the completed result to the AIPrescreen table.
 */
export async function generatePrescreen(caseId: string) {
  const caseRecord = await prisma.case.findUnique({
    where: { id: caseId },
    include: { records: true },
  });

  if (!caseRecord) {
    throw new Error(`Case not found: ${caseId}`);
  }

  // Build clinical context from case description + file metadata
  const clinicalContext = [
    `Service Type: ${caseRecord.serviceType}`,
    caseRecord.description ? `Case Description: ${caseRecord.description}` : "",
    caseRecord.records.length > 0
      ? `Uploaded Records: ${caseRecord.records.map((r) => `${r.fileName} (${r.fileType})`).join(", ")}`
      : "No records uploaded yet.",
  ]
    .filter(Boolean)
    .join("\n");

  // Strip PHI before sending to LLM
  const sanitizedContext = stripPHI(clinicalContext);

  const result = streamObject({
    model: aiModel,
    schema: prescreenSchema,
    system: prescreenSystemPrompt,
    prompt: `Pre-screen the following case:\n\n${sanitizedContext}`,
    onFinish: async ({ object }) => {
      if (object) {
        await prisma.aIPrescreen.create({
          data: {
            caseId,
            findings: `${WATERMARK}\n\n${object.findings.join("\n")}`,
            differentials: `${WATERMARK}\n\n${object.differentials.join("\n")}`,
            urgentFlags: object.urgentFlags.length > 0 ? `${WATERMARK}\n\n${object.urgentFlags.join("\n")}` : null,
          },
        });

        // Update case status to AI_PRE_SCREENED
        await prisma.case.update({
          where: { id: caseId },
          data: { status: "AI_PRE_SCREENED" },
        });

        // Trigger intelligent routing after pre-screening completes (fire and forget)
        fetch(`${getBaseUrl()}/api/ai/route/${caseId}`, {
          method: "POST",
          headers: {
            "x-internal-secret": process.env.INTERNAL_API_SECRET || "",
          },
        }).catch((err) => console.error("Routing trigger failed:", err));
      }
    },
  });

  return result.toTextStreamResponse();
}
