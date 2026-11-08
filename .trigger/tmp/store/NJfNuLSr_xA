import {
  stripPHI
} from "../../chunk-RCYOSZSD.mjs";
import {
  aiModel,
  generateObject
} from "../../chunk-RV4KBN5L.mjs";
import "../../chunk-KOYVPRES.mjs";
import {
  prisma
} from "../../chunk-M366MOAD.mjs";
import {
  external_exports2 as external_exports,
  task
} from "../../chunk-UTPLH5KB.mjs";
import "../../chunk-N2VJDWOE.mjs";
import "../../chunk-UT4CBAZP.mjs";
import {
  __name,
  init_esm
} from "../../chunk-JUPALWCH.mjs";

// trigger/tasks/ai-routing.ts
init_esm();

// lib/ai/routing.ts
init_esm();

// lib/ai/prompts/routing.ts
init_esm();
var routingSchema = external_exports.object({
  matchedSpecialistId: external_exports.string().min(1).describe("ID of the best-matching specialist"),
  reasoning: external_exports.string().min(10).describe("Why this specialist was chosen"),
  confidence: external_exports.enum(["low", "medium", "high"]),
  alternatives: external_exports.array(external_exports.string()).describe("Other considered specialist IDs")
});
var routingSystemPrompt = `You are a case routing coordinator for a medical diagnostic platform. Your role is to match incoming cases to the most appropriate available specialist.

MATCH the case to the best specialist based on subspecialty, case description, and availability.

RULES:
- You are NOT diagnosing. You are routing based on specialization fit.
- Prioritize subspecialty match above all else.
- Consider urgency — urgent cases should go to the most experienced available specialist.
- If no specialist is a good match, indicate low confidence.
- The matched specialist MUST be from the provided list of available specialists.

OUTPUT FORMAT:
- matchedSpecialistId: The ID of the best-matching specialist from the list
- reasoning: Brief explanation of why this specialist was chosen
- confidence: How confident you are in this match (low/medium/high)
- alternatives: IDs of other specialists that were considered`;

// lib/ai/routing.ts
async function matchSpecialist(caseId) {
  const caseRecord = await prisma.case.findUnique({
    where: { id: caseId }
  });
  if (!caseRecord) {
    throw new Error(`Case not found: ${caseId}`);
  }
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
      }
    }
  });
  if (specialists.length === 0) {
    return {
      matchedSpecialistId: null,
      reasoning: "No verified specialists available",
      confidence: "low",
      alternatives: []
    };
  }
  const specialistList = specialists.map((s) => ({
    id: s.user.id,
    name: s.user.name,
    specialty: s.specialty,
    experience: s.experience,
    currentCaseload: s.user.specialistCases.length
  }));
  const sanitizedDescription = stripPHI(caseRecord.description || "");
  const { object } = await generateObject({
    model: aiModel,
    schema: routingSchema,
    system: routingSystemPrompt,
    prompt: `Match this case to a specialist:

Case Description: ${sanitizedDescription}
Service Type: ${caseRecord.serviceType}

Available Specialists:
${JSON.stringify(specialistList, null, 2)}`
  });
  const validSpecialist = specialists.find((s) => s.user.id === object.matchedSpecialistId);
  if (!validSpecialist || object.confidence === "low") {
    return {
      matchedSpecialistId: null,
      reasoning: object.reasoning,
      confidence: "low",
      alternatives: object.alternatives
    };
  }
  await prisma.case.update({
    where: { id: caseId },
    data: {
      specialistId: object.matchedSpecialistId,
      status: "UNDER_REVIEW"
    }
  });
  return object;
}
__name(matchSpecialist, "matchSpecialist");

// trigger/tasks/ai-routing.ts
var aiRoutingTask = task({
  id: "ai-routing",
  run: /* @__PURE__ */ __name(async ({ caseId }) => {
    const result = await matchSpecialist(caseId);
    if (!result.matchedSpecialistId) {
      console.warn(`No specialist matched for case ${caseId}: ${result.reasoning}`);
      return { caseId, routed: false, reasoning: result.reasoning };
    }
    return { caseId, routed: true, specialistId: result.matchedSpecialistId };
  }, "run")
});
export {
  aiRoutingTask
};
//# sourceMappingURL=ai-routing.mjs.map
