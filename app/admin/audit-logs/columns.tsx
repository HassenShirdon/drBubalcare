"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"

export type AuditLogEntry = {
  id: string
  userId: string
  action: string
  resourceType: string
  resourceId: string
  before: Record<string, unknown> | null
  after: Record<string, unknown> | null
  metadata: Record<string, unknown> | null
  timestamp: string
  user: { name: string | null; email: string }
}

function ActionBadge({ action }: { action: string }) {
  const colors: Record<string, string> = {
    LOGIN: 'bg-[#DBEAFE] text-[#1E40AF]',
    LOGOUT: 'bg-[#F1F5F9] text-[#64748B]',
    REGISTER: 'bg-[#DCFCE7] text-[#15803D]',
    CASE_CREATE: 'bg-[#F3E8FF] text-[#7C3AED]',
    CASE_STATUS_CHANGE: 'bg-[#FEF3C7] text-[#B45309]',
    DISPUTE_FILED: 'bg-[#FEF2F2] text-[#B91C1C]',
    DISPUTE_RESOLVED: 'bg-[#DCFCE7] text-[#22C55E]',
    OPINION_SIGNED: 'bg-[#DCFCE7] text-[#22C55E]',
    DATA_EXPORT_REQUESTED: 'bg-[#FFF7ED] text-[#C2410C]',
    DATA_DELETION_REQUESTED: 'bg-[#FEF2F2] text-[#B91C1C]',
  }
  const color = colors[action] ?? 'bg-[#F1F5F9] text-[#64748B]'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {action.replace(/_/g, ' ')}
    </span>
  )
}

export const columns: ColumnDef<AuditLogEntry>[] = [
  {
    accessorKey: "timestamp",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Time" />,
    cell: ({ row }) => (
      <span className="text-sm text-[#64748B]">
        {new Date(row.original.timestamp).toLocaleString("en-US", {
          month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
        })}
      </span>
    ),
  },
  {
    accessorKey: "user",
    header: ({ column }) => <DataTableColumnHeader column={column} title="User" />,
    cell: ({ row }) => (
      <div>
        <p className="text-sm font-medium text-[#0F172A]">{row.original.user.name ?? "System"}</p>
        <p className="text-xs text-[#64748B]">{row.original.user.email}</p>
      </div>
    ),
    filterFn: (row, id, value) => {
      const user = row.original.user
      const search = (value as string).toLowerCase()
      return (
        (user.name?.toLowerCase().includes(search) ?? false) ||
        user.email.toLowerCase().includes(search)
      )
    },
  },
  {
    accessorKey: "action",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Action" />,
    cell: ({ row }) => <ActionBadge action={row.original.action} />,
  },
  {
    accessorKey: "resourceType",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Resource" />,
    cell: ({ row }) => (
      <span className="text-sm text-[#0F172A]">
        {row.original.resourceType}: {row.original.resourceId}
      </span>
    ),
  },
  {
    accessorKey: "metadata",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Details" />,
    cell: ({ row }) => {
      const meta = row.original.metadata
      if (!meta) return <span className="text-xs text-[#64748B]">—</span>
      return (
        <span className="text-xs text-[#64748B] truncate max-w-[200px] block">
          {JSON.stringify(meta)}
        </span>
      )
    },
  },
]
