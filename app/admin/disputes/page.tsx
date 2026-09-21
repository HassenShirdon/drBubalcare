"use client"

import { DataTable } from "@/components/ui/data-table"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { useAdminDisputes } from "@/lib/hooks/use-admin"
import { columns } from "./columns"

export default function AdminDisputesPage() {
  const { data: disputes, isLoading } = useAdminDisputes()

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-admin-text tracking-tight">Disputes</h1>
        <p className="text-sm text-admin-text-muted mt-1">Review and resolve patient disputes</p>
      </div>

      {isLoading ? (
        <TableSkeleton columns={5} search />
      ) : (
        <DataTable
          columns={columns}
          data={disputes ?? []}
          searchKey="patient"
          searchPlaceholder="Search by patient name..."
        />
      )}
    </div>
  )
}
