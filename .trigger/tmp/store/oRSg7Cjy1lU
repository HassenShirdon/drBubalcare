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
  task,
  tasks
} from "../../chunk-UTPLH5KB.mjs";
import "../../chunk-N2VJDWOE.mjs";
import "../../chunk-UT4CBAZP.mjs";
import {
  __name,
  init_esm
} from "../../chunk-JUPALWCH.mjs";

// trigger/tasks/ai-prescreen.ts
init_esm();

// lib/ai/prescreen.ts
init_esm();

// lib/ai/prompts/prescreen.ts
init_esm();
var prescreenSchema = external_exports.object({
  findings: external_exports.array(external_exports.string()).min(1).describe("Key clinical findings identified"),
  differentials: external_exports.array(external_exports.string()).min(1).describe("Differential diagnoses to consider"),
  urgentFlags: external_exports.array(external_exports.string()).describe("Urgency indicators (empty array if none)"),
  confidence: external_exports.enum(["low", "medium", "high"])
});
var prescreenSystemPrompt = `You are a clinical pre-screening assistant for a diagnostic coordination platform. Your role is to help specialists prioritize their review.

ANALYZE the clinical information provided and produce a structured pre-screen.

RULES:
- You are NOT diagnosing. You are surfacing what matters most for the specialist to review first.
- Flag anything that appears urgent or time-sensitive.
- Be specific but concise — each finding should be a clear, actionable item.
- If the clinical information is limited, say so with low confidence.
- Always include at least one finding and one differential, even if uncertain.

OUTPUT FORMAT:
- findings: Key clinical findings the specialist should review first
- differentials: Possible conditions or diagnoses to consider (not definitive)
- urgentFlags: Any urgency indicators (empty array if nothing urgent)
- confidence: Your confidence in the pre-screen (low/medium/high)`;

// lib/app-url.ts
init_esm();
var DEV_DEFAULT = "http://localhost:3000";
function getBaseUrl() {
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
  if (process.env.APP_URL) return process.env.APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return DEV_DEFAULT;
}
__name(getBaseUrl, "getBaseUrl");

// lib/ai/prescreen.ts
var WATERMARK = "AI-Generated Draft — requires specialist review";
async function generatePrescreen(caseId) {
  const caseRecord = await prisma.case.findUnique({
    where: { id: caseId },
    include: { records: true }
  });
  if (!caseRecord) {
    throw new Error(`Case not found: ${caseId}`);
  }
  const clinicalContext = [
    `Service Type: ${caseRecord.serviceType}`,
    caseRecord.description ? `Case Description: ${caseRecord.description}` : "",
    caseRecord.records.length > 0 ? `Uploaded Records: ${caseRecord.records.map((r) => `${r.fileName} (${r.fileType})`).join(", ")}` : "No records uploaded yet."
  ].filter(Boolean).join("\n");
  const sanitizedContext = stripPHI(clinicalContext);
  const result = streamObject({
    model: aiModel,
    schema: prescreenSchema,
    system: prescreenSystemPrompt,
    prompt: `Pre-screen the following case:

${sanitizedContext}`,
    onFinish: /* @__PURE__ */ __name(async ({ object }) => {
      if (object) {
        await prisma.aIPrescreen.create({
          data: {
            caseId,
            findings: `${WATERMARK}

${object.findings.join("\n")}`,
            differentials: `${WATERMARK}

${object.differentials.join("\n")}`,
            urgentFlags: object.urgentFlags.length > 0 ? `${WATERMARK}

${object.urgentFlags.join("\n")}` : null
          }
        });
        await prisma.case.update({
          where: { id: caseId },
          data: { status: "AI_PRE_SCREENED" }
        });
        fetch(`${getBaseUrl()}/api/ai/route/${caseId}`, {
          method: "POST",
          headers: {
            "x-internal-secret": process.env.INTERNAL_API_SECRET || ""
          }
        }).catch((err) => console.error("Routing trigger failed:", err));
      }
    }, "onFinish")
  });
  return result.toTextStreamResponse();
}
__name(generatePrescreen, "generatePrescreen");

// trigger/tasks/ai-prescreen.ts
var aiPrescreenTask = task({
  id: "ai-prescreen",
  run: /* @__PURE__ */ __name(async ({ caseId }) => {
    const response = await generatePrescreen(caseId);
    if (response.status >= 400) {
      throw new Error(`Prescreen failed for case ${caseId} with status ${response.status}`);
    }
    await tasks.trigger("ai-routing", { caseId });
    return { caseId, prescreened: true };
  }, "run")
});
export {
  aiPrescreenTask
};
//# sourceMappingURL=ai-prescreen.mjs.map
