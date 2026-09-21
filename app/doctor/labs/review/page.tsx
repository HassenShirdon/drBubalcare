"use client"

import { motion } from "motion/react"
import { DataTable } from "@/components/ui/data-table"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { useDoctorLabReviews } from "@/lib/hooks/use-doctor"
import { columns } from "./columns"

export default function DoctorLabReviewPage() {
  const { data: labs, isLoading } = useDoctorLabReviews()

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-xl font-semibold tracking-tight text-pulse-navy">Pending lab reviews</h2>
        <p className="mt-0.5 text-sm text-pulse-text-secondary">Review and interpret patient lab results.</p>
      </motion.div>

      {isLoading ? (
        <TableSkeleton columns={5} search />
      ) : (
        <DataTable
          columns={columns}
          data={labs ?? []}
          searchKey="patient"
          searchPlaceholder="Search by patient name or email..."
        />
      )}
    </div>
  )
}
