import { streamObject } from "ai";
import { aiModel } from "./client";
import { stripPHI } from "./phi-stripper";
import { synthesisSchema, synthesisSystemPrompt } from "./prompts/synthesis";
import { prisma } from "@/lib/db";

const WATERMARK = "AI-Generated Draft — requires specialist review";

/**
 * Generate a multi-opinion synthesis for a case with 2+ signed opinions.
 * Streams the result via SSE. Saves to OpinionSynthesis table.
 */
export async function generateSynthesis(caseId: string) {
  const caseRecord = await prisma.case.findUnique({
    where: { id: caseId },
    include: {
      opinions: {
        where: { status: "SIGNED" },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!caseRecord) {
    throw new Error(`Case not found: ${caseId}`);
  }

  if (caseRecord.opinions.length < 2) {
    throw new Error(
      `Case needs at least 2 signed opinions for synthesis. Found: ${caseRecord.opinions.length}`
    );
  }

  const existingSynthesis = await prisma.opinionSynthesis.findUnique({
    where: { caseId },
  });

  if (existingSynthesis) {
    throw new Error(`Synthesis already exists for case: ${caseId}`);
  }

  const opinionContext = caseRecord.opinions
    .map((opinion, index) => {
      const strippedContent = stripPHI(opinion.content);
      return `--- Specialist Opinion ${index + 1} (ID: ${opinion.id}) ---\n${strippedContent}`;
    })
    .join("\n\n");

  const caseDescription = stripPHI(
    caseRecord.description || "No case description provided."
  );

  const result = streamObject({
    model: aiModel,
    schema: synthesisSchema,
    system: synthesisSystemPrompt,
    prompt: `Case Description: ${caseDescription}\n\nSpecialist Opinions:\n${opinionContext}`,
    onFinish: async ({ object }) => {
      if (object) {
        await prisma.opinionSynthesis.create({
          data: {
            caseId,
            content: `${WATERMARK}\n\n${object.summary}`,
            agreements: object.agreements,
            disagreements: object.disagreements,
            status: "GENERATED",
          },
        });
      }
    },
  });

  return result.toTextStreamResponse();
}
