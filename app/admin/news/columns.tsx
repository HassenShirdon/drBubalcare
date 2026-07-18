"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"

export type AdminPost = {
  id: string
  title: string
  category: string | null
  published: boolean
  publishedAt: string | null
  createdAt: string
  author: { name: string | null }
}

export const columns: ColumnDef<AdminPost>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
  },
  {
    accessorKey: "author",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Author" />,
    cell: ({ row }) => (
      <span className="text-sm text-on-surface-variant">{row.original.author.name ?? "Unknown"}</span>
    ),
    filterFn: (row, id, value) => {
      return (row.original.author.name?.toLowerCase().includes((value as string).toLowerCase()) ?? false)
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
    cell: ({ row }) => (
      <span className="text-sm text-on-surface-variant">{row.original.category ?? "—"}</span>
    ),
  },
  {
    accessorKey: "published",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
        row.original.published ? "bg-healing-teal/10 text-healing-teal" : "bg-amber-50 text-amber-600"
      }`}>
        {row.original.published ? "Published" : "Draft"}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => (
      <span className="text-sm text-on-surface-variant">
        {new Date(row.original.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Link href={`/admin/news/${row.original.id}/edit`}>
        <Button variant="ghost" size="sm">
          <Pencil className="size-4" />
        </Button>
      </Link>
    ),
    enableSorting: false,
    enableHiding: false,
  },
]
