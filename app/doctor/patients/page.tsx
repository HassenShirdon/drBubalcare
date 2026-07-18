"use client"

import { motion } from "motion/react"
import { Loader2 } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
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
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-on-surface-variant text-sm mb-1">Doctor Portal</p>
        <h1 className="text-clinical-navy font-bold text-2xl md:text-3xl">My Patients</h1>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-healing-teal" size={32} />
        </div>
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
