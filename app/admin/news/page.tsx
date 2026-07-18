import { prisma } from "@/lib/db"
import { AdminNewsClient } from "./admin-news-client"

export default async function AdminNewsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  })

  const serialized = posts.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    publishedAt: p.publishedAt?.toISOString() ?? null,
  }))

  return <AdminNewsClient posts={serialized} />
}
