"use client"

import { useQuery } from "@tanstack/react-query"
import { DataTable } from "@/components/ui/data-table"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { columns, type DataRequestEntry } from "./columns"

export default function AdminDataRequestsPage() {
  const { data: res, isLoading } = useQuery<{ data: DataRequestEntry[]; total: number }>({
    queryKey: ["admin-data-requests"],
    queryFn: async () => {
      const res = await fetch("/api/admin/data-requests")
      if (!res.ok) throw new Error("Failed to fetch data requests")
      return res.json()
    },
    staleTime: 60 * 1000,
  })

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
