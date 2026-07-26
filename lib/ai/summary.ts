import { stripPHI } from "./phi-stripper";
import { summarySystemPrompt } from "./prompts/summary";
import { getOpencodeClient } from "./client";
import { prisma } from "@/lib/db";

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
  const client = await getOpencodeClient();
  const createResult = await client.session.create({ body: { title: `Summary for opinion ${opinionId}` } });

  if (!createResult.data) {
    throw new Error(`Failed to create session: ${createResult.error}`);
  }

  const session = createResult.data;

  try {
    const result = await client.session.prompt({
      path: { id: session.id },
      body: {
        parts: [
          { type: "text", text: summarySystemPrompt },
          { type: "text", text: `Translate the following specialist report into patient-friendly language. Return ONLY valid JSON with these fields: summary (2-3 paragraph explanation), keyFindings (array of strings), nextSteps (array of strings), disclaimer (string).\n\nReport:\n${sanitizedContent}` },
        ],
      },
    });

    if (!result.data) {
      throw new Error(`Failed to prompt session: ${result.error}`);
    }

    const textPart = result.data.parts.find((p) => p.type === "text") as { text: string } | undefined;
    if (!textPart) throw new Error("No text response from model");

    const parsed = JSON.parse(textPart.text);
    if (parsed) {
      await prisma.plainLanguageSummary.create({
        data: { opinionId, content: JSON.stringify(parsed) },
      });
      await prisma.case.update({
        where: { id: opinion.caseId },
        data: { status: "OPINION_READY" },
      });
    }
  } finally {
    await client.session.delete({ path: { id: session.id } });
  }
}
