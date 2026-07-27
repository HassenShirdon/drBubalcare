import { NextResponse } from "next/server";
import { answerFollowUp } from "@/lib/ai/followup";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

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

  const userId = (session.user as { id: string }).id;
  const role = (session.user as { role: string }).role;

  const opinion = await prisma.specialistOpinion.findUnique({
    where: { id: opinionId },
    include: { case: { select: { patientId: true } } },
  });

  if (!opinion) {
    return NextResponse.json({ error: "Opinion not found" }, { status: 404 });
  }

  if (role === "PATIENT" && opinion.case.patientId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (role === "DOCTOR" && opinion.specialistId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
