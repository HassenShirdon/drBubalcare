import { NextResponse } from "next/server";
import { generateSummary } from "@/lib/ai/summary";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ opinionId: string }> }
) {
  const secret = request.headers.get("x-internal-secret");
  if (secret !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { opinionId } = await params;

  try {
    const response = await generateSummary(opinionId);
    return response;
  } catch (error) {
    console.error("Summary generation failed:", error);
    return NextResponse.json(
      { error: "Summary generation failed" },
      { status: 500 }
    );
  }
}
