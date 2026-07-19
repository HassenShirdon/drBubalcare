import { NextResponse } from "next/server";
import { generateSynthesis } from "@/lib/ai/synthesis";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ caseId: string }> }
) {
  const secret = request.headers.get("x-internal-secret");
  if (secret !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { caseId } = await params;

  try {
    const response = await generateSynthesis(caseId);
    return response;
  } catch (error) {
    console.error("Synthesis generation failed:", error);
    return NextResponse.json(
      { error: "Synthesis generation failed" },
      { status: 500 }
    );
  }
}
