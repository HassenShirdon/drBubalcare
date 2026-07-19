"use client"

import { useQuery } from "@tanstack/react-query"
import { motion } from "motion/react"
import { DataTable } from "@/components/ui/data-table"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { columns, type DataRequestEntry } from "./columns"

export default function AdminDataRequestsPage() {
  const { data: requests, isLoading } = useQuery<DataRequestEntry[]>({
    queryKey: ["admin-data-requests"],
    queryFn: async () => {
      const res = await fetch("/api/admin/data-requests")
      if (!res.ok) throw new Error("Failed to fetch data requests")
      return res.json()
    },
    staleTime: 60 * 1000,
  })

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-on-surface-variant text-sm mb-1">Admin Portal</p>
        <h1 className="text-clinical-navy font-bold text-2xl md:text-3xl">Data Requests</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          GDPR data deletion requests and their status
        </p>
      </motion.div>

      {isLoading ? (
        <TableSkeleton columns={4} search />
      ) : (
        <DataTable
          columns={columns}
          data={requests ?? []}
          searchKey="patient"
          searchPlaceholder="Search by patient name..."
        />
      )}
    </div>
  )
}
