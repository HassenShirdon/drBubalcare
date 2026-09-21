"use client"

import { motion } from "motion/react"
import { DataTable } from "@/components/ui/data-table"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { useDoctorCases } from "@/lib/hooks/use-doctor-cases"
import { useAppStore } from "@/lib/stores/ui-store"
import type { DoctorCasesTab } from "@/lib/stores/slices/filters.slice"
import { columns, type DoctorCase } from "./columns"

export default function DoctorCasesPage() {
  const { data: cases, isLoading } = useDoctorCases()
  const tabFilter = useAppStore((s) => s.doctorCasesTab)
  const setTabFilter = useAppStore((s) => s.setDoctorCasesTab)

  const filtered = (cases as DoctorCase[] | undefined)?.filter((c) => {
    if (tabFilter === "pending") return !c.opinions?.length || c.opinions.every((o) => o.status === "DRAFT")
    if (tabFilter === "opinion_written") return c.opinions?.some((o) => o.status !== "DRAFT")
    return true
  })

  const allCount = cases?.length ?? 0
  const pendingCount = (cases as DoctorCase[] | undefined)?.filter((c) => !c.opinions?.length || c.opinions.every((o) => o.status === "DRAFT")).length ?? 0
  const opinionCount = (cases as DoctorCase[] | undefined)?.filter((c) => c.opinions?.some((o) => o.status !== "DRAFT")).length ?? 0

  const tabs: { key: DoctorCasesTab; label: string; count: number }[] = [
    { key: "all", label: "All", count: allCount },
    { key: "pending", label: "Pending", count: pendingCount },
    { key: "opinion_written", label: "Opinion written", count: opinionCount },
  ]

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-xl font-semibold tracking-tight text-pulse-navy">My cases</h2>
        <p className="mt-0.5 text-sm text-pulse-text-secondary">View and manage your assigned diagnostic cases.</p>
      </motion.div>

      <div className="flex gap-2" role="tablist" aria-label="Filter cases">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={tabFilter === tab.key}
            onClick={() => setTabFilter(tab.key)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse-info/40 ${
              tabFilter === tab.key
                ? 'bg-pulse-navy text-white'
                : 'bg-pulse-bg text-pulse-text-secondary hover:bg-pulse-surface-elevated'
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-[10px] font-semibold tabular-nums opacity-80">
              {tab.count}
            </span>
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
