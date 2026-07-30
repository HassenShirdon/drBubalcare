"use client"

import { useQuery } from "@tanstack/react-query"
import { DataTable } from "@/components/ui/data-table"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { columns, type AdminCase } from "./columns"

export default function AdminCasesPage() {
  const { data: res, isLoading } = useQuery<{ data: AdminCase[]; total: number }>({
    queryKey: ["admin-cases"],
    queryFn: async () => {
      const res = await fetch("/api/admin/cases")
      if (!res.ok) throw new Error("Failed to fetch cases")
      return res.json()
    },
    staleTime: 60 * 1000,
  })

  const cases = res?.data ?? []

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-admin-text tracking-tight">Case Management</h1>
        <p className="text-sm text-admin-text-muted mt-1">Review and manage all patient cases</p>
      </div>

      {isLoading ? (
        <TableSkeleton columns={5} search />
      ) : (
        <DataTable
          columns={columns}
          data={cases}
          searchKey="patient"
          searchPlaceholder="Search by patient name or email..."
        />
      )}
    </div>
  )
}
