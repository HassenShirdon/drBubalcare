"use client"

import { useQuery } from "@tanstack/react-query"
import { motion } from "motion/react"
import { DataTable } from "@/components/ui/data-table"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { columns, type LabReview } from "./columns"

export default function DoctorLabReviewPage() {
  const { data: labs, isLoading } = useQuery<LabReview[]>({
    queryKey: ["doctor-lab-reviews"],
    queryFn: async () => {
      const res = await fetch("/api/lab-results/pending-review")
      if (!res.ok) throw new Error("Failed to fetch lab reviews")
      return res.json()
    },
    staleTime: 2 * 60 * 1000,
  })

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-clinical-navy font-headline-md font-semibold text-xl">Pending Lab Reviews</h1>
        <p className="text-sm text-on-surface-variant mt-0.5">Review and interpret patient lab results</p>
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
