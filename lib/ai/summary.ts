import { streamObject } from "ai";
import { aiModel } from "./client";
import { stripPHI } from "./phi-stripper";
import { summarySchema, summarySystemPrompt } from "./prompts/summary";
import { prisma } from "@/lib/db";

const WATERMARK = "AI-Generated Draft — requires specialist review";

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
    model: aiModel,
    schema: summarySchema,
    system: summarySystemPrompt,
    prompt: `Translate the following specialist report into patient-friendly language:\n\nReport:\n${sanitizedContent}`,
  });

  const object = await result.object;

  if (object) {
    await prisma.plainLanguageSummary.create({
      data: {
        opinionId,
        content: `${WATERMARK}\n\n${JSON.stringify(object)}`,
      },
    });
    await prisma.case.update({
      where: { id: opinion.caseId },
      data: { status: "OPINION_READY" },
    });
  }

  return result.toTextStreamResponse();
}
