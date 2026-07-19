"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"

export type DisputeEntry = {
  id: string
  status: string
  reason: string
  createdAt: string
  case: { id: string; serviceType: string }
  patient: { name: string | null; email: string }
  opinion: { specialist: { name: string | null } }
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pending', color: 'bg-amber-50 text-amber-600' },
  UNDER_REVIEW: { label: 'Under Review', color: 'bg-blue-50 text-blue-600' },
  PEER_REVIEW_ASSIGNED: { label: 'Peer Review', color: 'bg-purple-50 text-purple-600' },
  RESOLVED: { label: 'Resolved', color: 'bg-healing-teal/10 text-healing-teal' },
  DISMISSED: { label: 'Dismissed', color: 'bg-gray-100 text-gray-500' },
}

export const columns: ColumnDef<DisputeEntry>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Filed" />,
    cell: ({ row }) => (
      <span className="text-sm text-on-surface-variant">
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
        <p className="font-medium text-text-medical-black">{row.original.patient.name ?? "Unknown"}</p>
        <p className="text-xs text-on-surface-variant">{row.original.patient.email}</p>
      </div>
    ),
  },
  {
    accessorKey: "case",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Case" />,
    cell: ({ row }) => (
      <span className="text-sm text-text-medical-black">
        {row.original.case.id.slice(0, 8)}...
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const config = STATUS_CONFIG[row.original.status] ?? { label: row.original.status, color: "" }
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${config.color}`}>
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
        className="inline-flex items-center gap-1 text-sm text-healing-teal hover:underline"
      >
        View <ArrowRight className="size-3" />
      </Link>
    ),
    enableSorting: false,
  },
]
