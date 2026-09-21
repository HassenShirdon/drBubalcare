"use client"

import { DataTable } from "@/components/ui/data-table"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { useAdminDataRequests } from "@/lib/hooks/use-admin"
import { columns } from "./columns"

export default function AdminDataRequestsPage() {
  const { data: res, isLoading } = useAdminDataRequests()

  const requests = res?.data ?? []

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-admin-text tracking-tight">Data Requests</h1>
        <p className="text-sm text-admin-text-muted mt-1">
          GDPR data deletion requests and their status
        </p>
      </div>

      {isLoading ? (
        <TableSkeleton columns={4} search />
      ) : (
        <DataTable
          columns={columns}
          data={requests}
          searchKey="patient"
          searchPlaceholder="Search by patient name..."
        />
      )}
    </div>
  )
}
