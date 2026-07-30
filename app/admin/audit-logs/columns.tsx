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
    LOGIN: 'bg-admin-brand-light text-admin-accent-blue',
    LOGOUT: 'bg-admin-surface-elevated text-admin-text-faint',
    REGISTER: 'bg-admin-success-light text-admin-success',
    CASE_CREATE: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    CASE_STATUS_CHANGE: 'bg-admin-warning-light text-admin-warning',
    DISPUTE_FILED: 'bg-admin-danger-light text-admin-danger',
    DISPUTE_RESOLVED: 'bg-admin-success-light text-admin-success',
    OPINION_SIGNED: 'bg-admin-success-light text-admin-success',
    DATA_EXPORT_REQUESTED: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    DATA_DELETION_REQUESTED: 'bg-admin-danger-light text-admin-danger',
  }
  const color = colors[action] ?? 'bg-admin-surface-elevated text-admin-text-faint'
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
      <span className="text-sm text-admin-text-faint">
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
        <p className="text-sm font-medium text-admin-text">{row.original.user.name ?? "System"}</p>
        <p className="text-xs text-admin-text-faint">{row.original.user.email}</p>
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
      <span className="text-sm text-admin-text">
        {row.original.resourceType}: {row.original.resourceId}
      </span>
    ),
  },
  {
    accessorKey: "metadata",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Details" />,
    cell: ({ row }) => {
      const meta = row.original.metadata
      if (!meta) return <span className="text-xs text-admin-text-faint">-</span>
      return (
        <span className="text-xs text-admin-text-faint truncate max-w-[200px] block">
          {JSON.stringify(meta)}
        </span>
      )
    },
  },
]
