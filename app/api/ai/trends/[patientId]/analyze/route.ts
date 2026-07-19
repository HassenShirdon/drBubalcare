import { NextResponse } from "next/server";
import { generateTrendAnalysis } from "@/lib/ai/trends";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ patientId: string }> }
) {
  const secret = request.headers.get("x-internal-secret");
  if (secret !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { patientId } = await params;

  try {
    const analyses = await generateTrendAnalysis(patientId);
    return NextResponse.json({ analyzed: analyses.length });
  } catch (error) {
    console.error("Trend analysis failed:", error);
    return NextResponse.json(
      { error: "Trend analysis failed" },
      { status: 500 }
    );
  }
}
