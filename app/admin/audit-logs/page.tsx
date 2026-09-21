"use client"

import { DataTable } from "@/components/ui/data-table"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { useAdminAuditLogs } from "@/lib/hooks/use-admin"
import { columns } from "./columns"

export default function AdminAuditLogsPage() {
  const { data, isLoading } = useAdminAuditLogs(100, 0)

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
