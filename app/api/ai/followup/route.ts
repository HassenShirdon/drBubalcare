import { NextResponse } from "next/server";
import { answerFollowUp } from "@/lib/ai/followup";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { opinionId, question } = body;

  if (!opinionId || !question) {
    return NextResponse.json(
      { error: "opinionId and question are required" },
      { status: 400 }
    );
  }

  try {
    const response = await answerFollowUp(opinionId, question);
    return response;
  } catch (error) {
    console.error("Follow-up Q&A failed:", error);
    return NextResponse.json(
      { error: "Follow-up Q&A failed" },
      { status: 500 }
    );
  }
}
