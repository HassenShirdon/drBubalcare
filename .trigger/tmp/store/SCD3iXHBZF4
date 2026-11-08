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

// trigger/tasks/ai-summary.ts
init_esm();

// lib/ai/summary.ts
init_esm();

// lib/ai/prompts/summary.ts
init_esm();
var summarySchema = external_exports.object({
  summary: external_exports.string().min(50).describe("2-3 paragraph patient-friendly explanation"),
  keyFindings: external_exports.array(external_exports.string()).min(1).describe("Main findings in plain language"),
  nextSteps: external_exports.array(external_exports.string()).min(1).describe("Actionable next steps for the patient"),
  disclaimer: external_exports.string().describe("Standard medical disclaimer")
});
var summarySystemPrompt = `You are a trusted GP explaining a specialist's report to a patient. Your goal is to make the specialist's findings understandable to someone with no medical background.

TRANSLATE the specialist's report into patient-friendly language.

RULES:
- Use NO medical jargon. If a medical term is necessary, explain it in parentheses.
- Write as if you're speaking directly to the patient — warm, clear, honest.
- Be reassuring but never dismissive of concerns.
- Include a standard disclaimer that this is an AI-generated summary.
- Do NOT add medical opinions or recommendations beyond what the specialist stated.

OUTPUT FORMAT:
- summary: 2-3 paragraph explanation in plain language
- keyFindings: Bullet points of the main findings (plain language)
- nextSteps: Numbered list of what the patient should do next
- disclaimer: "This is an AI-generated summary of your specialist's report. It does not constitute medical advice. Please discuss any questions with your healthcare provider."`;

// lib/ai/summary.ts
var WATERMARK = "AI-Generated Draft — requires specialist review";
async function generateSummary(opinionId) {
  const opinion = await prisma.specialistOpinion.findUnique({
    where: { id: opinionId },
    include: { case: true }
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
    prompt: `Translate the following specialist report into patient-friendly language:

Report:
${sanitizedContent}`
  });
  const object = await result.object;
  if (object) {
    await prisma.plainLanguageSummary.create({
      data: {
        opinionId,
        content: `${WATERMARK}

${JSON.stringify(object)}`
      }
    });
    await prisma.case.update({
      where: { id: opinion.caseId },
      data: { status: "OPINION_READY" }
    });
  }
  return result.toTextStreamResponse();
}
__name(generateSummary, "generateSummary");

// trigger/tasks/ai-summary.ts
var aiSummaryTask = task({
  id: "ai-summary",
  run: /* @__PURE__ */ __name(async ({ opinionId }) => {
    const response = await generateSummary(opinionId);
    if (response.status >= 400) {
      throw new Error(`Summary generation failed for opinion ${opinionId} with status ${response.status}`);
    }
    return { opinionId, summarized: true };
  }, "run")
});
export {
  aiSummaryTask
};
//# sourceMappingURL=ai-summary.mjs.map
