"use client"

import { useQuery } from "@tanstack/react-query"
import { DataTable } from "@/components/ui/data-table"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { columns, type AuditLogEntry } from "./columns"

export default function AdminAuditLogsPage() {
  const { data, isLoading } = useQuery<{ logs: AuditLogEntry[]; total: number }>({
    queryKey: ["admin-audit-logs"],
    queryFn: async () => {
      const res = await fetch("/api/admin/audit-logs?limit=100&offset=0")
      if (!res.ok) throw new Error("Failed to fetch audit logs")
      return res.json()
    },
    staleTime: 30 * 1000,
  })

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-admin-text tracking-tight">Audit Logs</h1>
        <p className="text-sm text-admin-text-muted mt-1">
          {data?.total ?? 0} total entries
        </p>
      </div>

      {isLoading ? (
        <TableSkeleton columns={5} search />
      ) : (
        <DataTable
          columns={columns}
          data={data?.logs ?? []}
          searchKey="user"
          searchPlaceholder="Search by user name or email..."
        />
      )}
    </div>
  )
}
