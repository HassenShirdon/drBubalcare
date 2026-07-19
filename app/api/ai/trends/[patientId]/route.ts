import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ patientId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const { patientId } = await params;

  if (userId !== patientId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const trends = await prisma.trendAnalysis.findMany({
      where: { patientId },
      orderBy: { generatedAt: "desc" },
    });

    return NextResponse.json(trends, {
      headers: {
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Trend analysis fetch failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch trend analyses" },
      { status: 500 }
    );
  }
}
