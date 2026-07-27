"use client"

import { useQuery } from "@tanstack/react-query"
import { motion } from "motion/react"
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
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[#64748B] text-sm mb-1">Admin Portal</p>
        <h1 className="text-[#1E3A5F] font-bold text-2xl md:text-3xl">Audit Logs</h1>
        <p className="text-[#64748B] text-sm mt-1">
          {data?.total ?? 0} total entries
        </p>
      </motion.div>

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
