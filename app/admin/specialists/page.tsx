"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "motion/react"
import { Loader2 } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { columns, type AdminSpecialist } from "./columns"

type TabFilter = "all" | "verified" | "unverified"

export default function AdminSpecialistsPage() {
  const [tabFilter, setTabFilter] = useState<TabFilter>("all")
  const { data: specialists, isLoading } = useQuery<AdminSpecialist[]>({
    queryKey: ["admin-specialists"],
    queryFn: async () => {
      const res = await fetch("/api/admin/specialists")
      if (!res.ok) throw new Error("Failed to fetch specialists")
      return res.json()
    },
    staleTime: 60 * 1000,
  })

  const filtered = specialists?.filter((s) => {
    if (tabFilter === "verified") return s.verified
    if (tabFilter === "unverified") return !s.verified
    return true
  })

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-on-surface-variant text-sm mb-1">Admin Portal</p>
        <h1 className="text-clinical-navy font-bold text-2xl md:text-3xl">Specialist Management</h1>
      </motion.div>

      {/* Tab filter */}
      <div className="flex gap-2">
        {(["all", "verified", "unverified"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setTabFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              tabFilter === tab
                ? "bg-clinical-navy text-white"
                : "bg-surface text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-healing-teal" size={32} />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filtered ?? []}
          searchKey="user"
          searchPlaceholder="Search by name or email..."
        />
      )}
    </div>
  )
}
