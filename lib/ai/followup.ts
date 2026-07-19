import { streamObject } from "ai";
import { openaiModel } from "./client";
import { stripPHI } from "./phi-stripper";
import { followupSchema, followupSystemPrompt } from "./prompts/followup";
import { prisma } from "@/lib/db";

/**
 * Answer a patient's follow-up question about a specialist opinion.
 * Streams the result via SSE. Saves to FollowUpQuestion table.
 */
export async function answerFollowUp(opinionId: string, question: string) {
  const opinion = await prisma.specialistOpinion.findUnique({
    where: { id: opinionId },
    include: {
      case: true,
      plainSummary: true,
    },
  });

  if (!opinion) {
    throw new Error(`Opinion not found: ${opinionId}`);
  }

  if (opinion.status !== "SIGNED") {
    throw new Error(`Opinion must be signed before answering follow-ups. Current status: ${opinion.status}`);
  }

  // Strip PHI from opinion content
  const sanitizedContent = stripPHI(opinion.content);
  const sanitizedQuestion = stripPHI(question);

  const result = streamObject({
    model: openaiModel,
    schema: followupSchema,
    system: followupSystemPrompt,
    prompt: `Specialist's Opinion:\n${sanitizedContent}\n\nPatient's Question: ${sanitizedQuestion}`,
    onFinish: async ({ object }) => {
      if (object) {
        await prisma.followUpQuestion.create({
          data: {
            opinionId,
            question: sanitizedQuestion,
            answer: object.answer,
            scopeNote: object.scopeNote,
          },
        });
      }
    },
  });

  return result.toTextStreamResponse();
}
