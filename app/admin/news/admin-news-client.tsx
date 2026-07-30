"use client"

import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { columns, type AdminPost } from "./columns"

interface AdminNewsClientProps {
  posts: AdminPost[]
}

export function AdminNewsClient({ posts }: AdminNewsClientProps) {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-admin-text tracking-tight">News Management</h1>
          <p className="text-sm text-admin-text-muted mt-1">Create and manage platform news posts</p>
        </div>
        <Link href="/admin/news/new">
          <Button>
            <Plus className="size-4" />
            New Post
          </Button>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={posts}
        searchKey="title"
        searchPlaceholder="Search by title..."
      />
    </div>
  )
}
