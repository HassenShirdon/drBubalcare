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
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-on-surface-variant text-sm mb-1">Doctor Portal</p>
        <h1 className="text-clinical-navy font-bold text-2xl md:text-3xl">Pending Lab Reviews</h1>
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
