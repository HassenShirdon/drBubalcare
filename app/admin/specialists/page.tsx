"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "motion/react"
import { Shield, BadgeCheck, BadgeX } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { TableSkeleton } from "@/components/ui/table-skeleton"
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

  const all = specialists ?? []
  const verifiedCount = all.filter((s) => s.verified).length
  const pendingCount = all.filter((s) => !s.verified).length

  const filtered = all.filter((s) => {
    if (tabFilter === "verified") return s.verified
    if (tabFilter === "unverified") return !s.verified
    return true
  })

  const tabs: { key: TabFilter; label: string; icon: typeof Shield; count: number }[] = [
    { key: "all", label: "All", icon: Shield, count: all.length },
    { key: "verified", label: "Verified", icon: BadgeCheck, count: verifiedCount },
    { key: "unverified", label: "Pending", icon: BadgeX, count: pendingCount },
  ]

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-on-surface-variant text-sm mb-1">Admin Portal</p>
        <h1 className="text-clinical-navy font-bold text-2xl md:text-3xl">Specialist Management</h1>
        <p className="text-on-surface-variant text-sm mt-1">Review, verify, and manage platform specialists.</p>
      </motion.div>

      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setTabFilter(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              tabFilter === tab.key
                ? "bg-clinical-navy text-white"
                : "bg-surface text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            <tab.icon className="size-3.5" />
            {tab.label}
            <span className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              tabFilter === tab.key ? "bg-white/20" : "bg-surface-gray/60"
            }`}>
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
          data={filtered}
          searchKey="user"
          searchPlaceholder="Search by name or email..."
        />
      )}
    </div>
  )
}
