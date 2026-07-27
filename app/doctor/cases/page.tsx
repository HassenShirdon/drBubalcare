"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { DataTable } from "@/components/ui/data-table"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { useDoctorCases } from "@/lib/hooks/use-doctor-cases"
import { columns, type DoctorCase } from "./columns"

type TabFilter = "all" | "pending" | "opinion_written"

export default function DoctorCasesPage() {
  const { data: cases, isLoading } = useDoctorCases()
  const [tabFilter, setTabFilter] = useState<TabFilter>("all")

  const filtered = (cases as DoctorCase[] | undefined)?.filter((c) => {
    if (tabFilter === "pending") return !c.opinions?.length || c.opinions.every((o) => o.status === "DRAFT")
    if (tabFilter === "opinion_written") return c.opinions?.some((o) => o.status !== "DRAFT")
    return true
  })

  const allCount = cases?.length ?? 0
  const pendingCount = (cases as DoctorCase[] | undefined)?.filter((c) => !c.opinions?.length || c.opinions.every((o) => o.status === "DRAFT")).length ?? 0
  const opinionCount = (cases as DoctorCase[] | undefined)?.filter((c) => c.opinions?.some((o) => o.status !== "DRAFT")).length ?? 0

  const tabs: { key: TabFilter; label: string; count: number }[] = [
    { key: "all", label: "All", count: allCount },
    { key: "pending", label: "Pending", count: pendingCount },
    { key: "opinion_written", label: "Opinion Written", count: opinionCount },
  ]

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-semibold text-xl" style={{ color: '#1E3A5F' }}>My Cases</h1>
        <p className="text-sm mt-0.5" style={{ color: '#64748B' }}>View and manage your assigned diagnostic cases</p>
      </motion.div>

      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setTabFilter(tab.key)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={
              tabFilter === tab.key
                ? { background: '#1E3A5F', color: '#FFFFFF' }
                : { background: '#F8FAFC', color: '#64748B' }
            }
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {isLoading ? (
        <TableSkeleton columns={5} search />
      ) : (
        <DataTable
          columns={columns}
          data={filtered ?? []}
          searchKey="patient"
          searchPlaceholder="Search by patient name or email..."
        />
      )}
    </div>
  )
}
