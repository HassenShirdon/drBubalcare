"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { DISPUTE_STATUS_CONFIG } from "@/lib/constants"

export type DisputeEntry = {
  id: string
  status: string
  reason: string
  createdAt: string
  case: { id: string; serviceType: string }
  patient: { name: string | null; email: string }
  opinion: { specialist: { name: string | null } }
}

export const columns: ColumnDef<DisputeEntry>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Filed" />,
    cell: ({ row }) => (
      <span className="text-sm text-admin-text-faint">
        {new Date(row.original.createdAt).toLocaleDateString("en-US", {
          month: "short", day: "numeric", year: "numeric",
        })}
      </span>
    ),
  },
  {
    accessorKey: "patient",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Patient" />,
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-admin-text">{row.original.patient.name ?? "Unknown"}</p>
        <p className="text-xs text-admin-text-faint">{row.original.patient.email}</p>
      </div>
    ),
  },
  {
    accessorKey: "case",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Case" />,
    cell: ({ row }) => (
      <span className="text-sm text-admin-text">
        {row.original.case.id.slice(0, 8)}...
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const config = DISPUTE_STATUS_CONFIG[row.original.status] ?? { label: row.original.status, color: "" }
      return (
        <span className={`inline-flex items-center ${config.color}`}>
          {config.label}
        </span>
      )
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <Link
        href={`/admin/disputes/${row.original.id}`}
        className="inline-flex items-center gap-1 text-sm text-admin-success hover:underline font-medium"
      >
        View <ArrowRight className="size-3" />
      </Link>
    ),
    enableSorting: false,
  },
]
