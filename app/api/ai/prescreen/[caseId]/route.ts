import { NextResponse } from "next/server";
import { generatePrescreen } from "@/lib/ai/prescreen";

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
    const response = await generatePrescreen(caseId);
    return response;
  } catch (error) {
    console.error("Pre-screening failed:", error);
    return NextResponse.json({ error: "Pre-screening failed" }, { status: 500 });
  }
}
