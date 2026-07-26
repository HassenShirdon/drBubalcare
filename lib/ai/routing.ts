import { generateObject } from "ai";
import { aiModel } from "./client";
import { stripPHI } from "./phi-stripper";
import { routingSchema, routingSystemPrompt } from "./prompts/routing";
import { prisma } from "@/lib/db";

/**
 * Match a case to the best available specialist using AI.
 * Returns structured routing result (not streaming — fast operation).
 */
export async function matchSpecialist(caseId: string) {
  const caseRecord = await prisma.case.findUnique({
    where: { id: caseId },
  });

  if (!caseRecord) {
    throw new Error(`Case not found: ${caseId}`);
  }

  // Get available verified specialists
  const specialists = await prisma.doctor.findMany({
    where: { verified: true },
    include: {
      user: { 
        select: { 
          id: true, 
          name: true,
          specialistCases: { 
            where: { status: { in: ["UNDER_REVIEW", "AI_PRE_SCREENED"] } },
            select: { id: true }
          }
        } 
      },
    },
  });

  if (specialists.length === 0) {
    return {
      matchedSpecialistId: null,
      reasoning: "No verified specialists available",
      confidence: "low" as const,
      alternatives: [],
    };
  }

  // Build specialist list for LLM
  const specialistList = specialists.map((s) => ({
    id: s.user.id,
    name: s.user.name,
    specialty: s.specialty,
    experience: s.experience,
    currentCaseload: s.user.specialistCases.length,
  }));

  // Strip PHI from case description
  const sanitizedDescription = stripPHI(caseRecord.description || "");

  const { object } = await generateObject({
    model: aiModel,
    schema: routingSchema,
    system: routingSystemPrompt,
    prompt: `Match this case to a specialist:

Case Description: ${sanitizedDescription}
Service Type: ${caseRecord.serviceType}

Available Specialists:
${JSON.stringify(specialistList, null, 2)}`,
  });

  // Validate the matched specialist exists in our list
  const validSpecialist = specialists.find((s) => s.user.id === object.matchedSpecialistId);

  if (!validSpecialist || object.confidence === "low") {
    return {
      matchedSpecialistId: null,
      reasoning: object.reasoning,
      confidence: "low" as const,
      alternatives: object.alternatives,
    };
  }

  // Assign specialist to case
  await prisma.case.update({
    where: { id: caseId },
    data: {
      specialistId: object.matchedSpecialistId,
      status: "UNDER_REVIEW",
    },
  });

  return object;
}