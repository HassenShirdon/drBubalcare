import { NextResponse } from "next/server";
import { matchSpecialist } from "@/lib/ai/routing";

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
    const result = await matchSpecialist(caseId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Routing failed:", error);
    return NextResponse.json({ error: "Routing failed" }, { status: 500 });
  }
}
