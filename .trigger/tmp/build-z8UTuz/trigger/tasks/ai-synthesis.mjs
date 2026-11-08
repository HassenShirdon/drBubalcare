import {
  stripPHI
} from "../../chunk-RCYOSZSD.mjs";
import {
  aiModel,
  streamObject
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

// trigger/tasks/ai-synthesis.ts
init_esm();

// lib/ai/synthesis.ts
init_esm();

// lib/ai/prompts/synthesis.ts
init_esm();
var synthesisSchema = external_exports.object({
  summary: external_exports.string().min(50).describe("Consensus summary of all opinions"),
  agreements: external_exports.array(external_exports.string()).min(1).describe("Areas where specialists agree"),
  disagreements: external_exports.array(external_exports.string()).describe("Areas where specialists disagree"),
  confidence: external_exports.enum(["low", "medium", "high"])
});
var synthesisSystemPrompt = `You are a medical synthesis assistant. Your role is to identify areas of agreement and disagreement across multiple specialist opinions for the same case.

ANALYZE the specialist opinions and produce a structured synthesis.

RULES:
- You are NOT diagnosing. You are synthesizing what specialists have stated.
- Highlight areas of consensus first, then areas of divergence.
- If opinions conflict, present both perspectives neutrally.
- Be concise but thorough — every significant disagreement should be noted.
- If all opinions agree, state that clearly with an empty disagreements array.

OUTPUT FORMAT:
- summary: Consensus summary of all opinions (2-3 paragraphs)
- agreements: Areas where specialists agree (bullet points)
- disagreements: Areas where specialists disagree (bullet points, empty if all agree)
- confidence: Your confidence in the synthesis (low/medium/high)`;

// lib/ai/synthesis.ts
var WATERMARK = "AI-Generated Draft — requires specialist review";
async function generateSynthesis(caseId) {
  const caseRecord = await prisma.case.findUnique({
    where: { id: caseId },
    include: {
      opinions: {
        where: { status: "SIGNED" },
        orderBy: { createdAt: "asc" }
      }
    }
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
    where: { caseId }
  });
  if (existingSynthesis) {
    throw new Error(`Synthesis already exists for case: ${caseId}`);
  }
  const opinionContext = caseRecord.opinions.map((opinion, index) => {
    const strippedContent = stripPHI(opinion.content);
    return `--- Specialist Opinion ${index + 1} (ID: ${opinion.id}) ---
${strippedContent}`;
  }).join("\n\n");
  const caseDescription = stripPHI(
    caseRecord.description || "No case description provided."
  );
  const result = streamObject({
    model: aiModel,
    schema: synthesisSchema,
    system: synthesisSystemPrompt,
    prompt: `Case Description: ${caseDescription}

Specialist Opinions:
${opinionContext}`,
    onFinish: /* @__PURE__ */ __name(async ({ object }) => {
      if (object) {
        await prisma.opinionSynthesis.create({
          data: {
            caseId,
            content: `${WATERMARK}

${object.summary}`,
            agreements: object.agreements,
            disagreements: object.disagreements,
            status: "GENERATED"
          }
        });
      }
    }, "onFinish")
  });
  return result.toTextStreamResponse();
}
__name(generateSynthesis, "generateSynthesis");

// trigger/tasks/ai-synthesis.ts
var aiSynthesisTask = task({
  id: "ai-synthesis",
  run: /* @__PURE__ */ __name(async ({ caseId }) => {
    const response = await generateSynthesis(caseId);
    if (response.status >= 400) {
      throw new Error(`Synthesis generation failed for case ${caseId} with status ${response.status}`);
    }
    return { caseId, synthesized: true };
  }, "run")
});
export {
  aiSynthesisTask
};
//# sourceMappingURL=ai-synthesis.mjs.map
