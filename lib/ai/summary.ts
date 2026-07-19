import { streamObject } from "ai";
import { openaiModel } from "./client";
import { stripPHI } from "./phi-stripper";
import { summarySchema, summarySystemPrompt } from "./prompts/summary";
import { prisma } from "@/lib/db";

/**
 * Generate a plain-language summary for a signed specialist opinion.
 * Streams the result via SSE. Saves to PlainLanguageSummary table.
 */
export async function generateSummary(opinionId: string) {
  const opinion = await prisma.specialistOpinion.findUnique({
    where: { id: opinionId },
    include: { case: true },
  });

  if (!opinion) {
    throw new Error(`Opinion not found: ${opinionId}`);
  }

  if (opinion.status !== "SIGNED") {
    throw new Error(`Opinion must be signed before generating summary. Current status: ${opinion.status}`);
  }

  const sanitizedContent = stripPHI(opinion.content);

  const result = streamObject({
    model: openaiModel,
    schema: summarySchema,
    system: summarySystemPrompt,
    prompt: `Translate the following specialist report into patient-friendly language:\n\n${sanitizedContent}`,
    onFinish: async ({ object }) => {
      if (object) {
        await prisma.plainLanguageSummary.create({
          data: {
            opinionId,
            content: JSON.stringify(object),
          },
        });

        await prisma.case.update({
          where: { id: opinion.caseId },
          data: { status: "OPINION_READY" },
        });
      }
    },
  });

  return result.toTextStreamResponse();
}
