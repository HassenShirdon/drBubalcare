"use client"

import { motion } from "motion/react"
import { DataTable } from "@/components/ui/data-table"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { useQuery } from "@tanstack/react-query"
import { columns, type DoctorPatient } from "./columns"

export default function DoctorPatientsPage() {
  const { data: patients, isLoading } = useQuery<DoctorPatient[]>({
    queryKey: ["doctor-patients"],
    queryFn: async () => {
      const res = await fetch("/api/doctor/patients")
      if (!res.ok) throw new Error("Failed to fetch patients")
      return res.json()
    },
    staleTime: 5 * 60 * 1000,
  })

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-clinical-navy font-headline-md font-semibold text-xl">My Patients</h1>
        <p className="text-sm text-on-surface-variant mt-0.5">Patients you've consulted with</p>
      </motion.div>

      {isLoading ? (
        <TableSkeleton columns={3} search />
      ) : (
        <DataTable
          columns={columns}
          data={patients ?? []}
          searchKey="name"
          searchPlaceholder="Search by name or email..."
        />
      )}
    </div>
  )
}
