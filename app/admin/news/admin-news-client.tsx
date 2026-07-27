"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { columns, type AdminPost } from "./columns"

interface AdminNewsClientProps {
  posts: AdminPost[]
}

export function AdminNewsClient({ posts }: AdminNewsClientProps) {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <p className="text-[#64748B] text-sm mb-1">Admin Portal</p>
          <h1 className="text-[#1E3A5F] font-bold text-2xl md:text-3xl">News Management</h1>
        </div>
        <Link href="/admin/news/new">
          <Button className="bg-[#1E3A5F] hover:bg-[#1E3A5F]/90 text-white">
            <Plus className="size-4 mr-1" /> New Post
          </Button>
        </Link>
      </motion.div>

      <DataTable
        columns={columns}
        data={posts}
        searchKey="title"
        searchPlaceholder="Search by title..."
      />
    </div>
  )
}
