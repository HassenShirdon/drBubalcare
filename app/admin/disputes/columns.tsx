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
  PENDING: { label: 'Pending', color: 'bg-[#FEF3C7] text-[#B45309] px-2.5 py-0.5 rounded-full text-xs font-medium' },
  UNDER_REVIEW: { label: 'Under Review', color: 'bg-[#DBEAFE] text-[#1E40AF] px-2.5 py-0.5 rounded-full text-xs font-medium' },
  PEER_REVIEW_ASSIGNED: { label: 'Peer Review', color: 'bg-[#DBEAFE] text-[#1E40AF] px-2.5 py-0.5 rounded-full text-xs font-medium' },
  RESOLVED: { label: 'Resolved', color: 'bg-[#DCFCE7] text-[#15803D] px-2.5 py-0.5 rounded-full text-xs font-medium' },
  DISMISSED: { label: 'Dismissed', color: 'bg-[#F1F5F9] text-[#64748B] px-2.5 py-0.5 rounded-full text-xs font-medium' },
}

export const columns: ColumnDef<DisputeEntry>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Filed" />,
    cell: ({ row }) => (
      <span className="text-sm text-[#64748B]">
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
        <p className="font-medium text-[#0F172A]">{row.original.patient.name ?? "Unknown"}</p>
        <p className="text-xs text-[#64748B]">{row.original.patient.email}</p>
      </div>
    ),
  },
  {
    accessorKey: "case",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Case" />,
    cell: ({ row }) => (
      <span className="text-sm text-[#0F172A]">
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
        className="inline-flex items-center gap-1 text-sm text-[#22C55E] hover:underline"
      >
        View <ArrowRight className="size-3" />
      </Link>
    ),
    enableSorting: false,
  },
]
