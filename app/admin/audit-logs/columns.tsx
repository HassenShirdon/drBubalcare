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
    LOGIN: 'bg-blue-50 text-blue-600',
    LOGOUT: 'bg-gray-100 text-gray-500',
    REGISTER: 'bg-green-50 text-green-600',
    CASE_CREATE: 'bg-purple-50 text-purple-600',
    CASE_STATUS_CHANGE: 'bg-amber-50 text-amber-600',
    DISPUTE_FILED: 'bg-red-50 text-red-600',
    DISPUTE_RESOLVED: 'bg-healing-teal/10 text-healing-teal',
    OPINION_SIGNED: 'bg-healing-teal/10 text-healing-teal',
    DATA_EXPORT_REQUESTED: 'bg-orange-50 text-orange-600',
    DATA_DELETION_REQUESTED: 'bg-red-50 text-red-600',
  }
  const color = colors[action] ?? 'bg-gray-100 text-gray-500'
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
      <span className="text-sm text-on-surface-variant">
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
        <p className="text-sm font-medium text-text-medical-black">{row.original.user.name ?? "System"}</p>
        <p className="text-xs text-on-surface-variant">{row.original.user.email}</p>
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
      <span className="text-sm text-text-medical-black">
        {row.original.resourceType}: {row.original.resourceId}
      </span>
    ),
  },
  {
    accessorKey: "metadata",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Details" />,
    cell: ({ row }) => {
      const meta = row.original.metadata
      if (!meta) return <span className="text-xs text-on-surface-variant">—</span>
      return (
        <span className="text-xs text-on-surface-variant truncate max-w-[200px] block">
          {JSON.stringify(meta)}
        </span>
      )
    },
  },
]
