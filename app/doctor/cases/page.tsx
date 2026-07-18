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

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-on-surface-variant text-sm mb-1">Doctor Portal</p>
        <h1 className="text-clinical-navy font-bold text-2xl md:text-3xl">My Cases</h1>
      </motion.div>

      <div className="flex gap-2">
        {(["all", "pending", "opinion_written"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setTabFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              tabFilter === tab
                ? "bg-clinical-navy text-white"
                : "bg-surface text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            {tab === "all" ? "All" : tab === "pending" ? "Pending" : "Opinion Written"}
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
