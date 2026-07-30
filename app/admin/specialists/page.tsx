"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Shield, BadgeCheck, BadgeX } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { columns, type AdminSpecialist } from "./columns"

type TabFilter = "all" | "verified" | "unverified"

export default function AdminSpecialistsPage() {
  const [tabFilter, setTabFilter] = useState<TabFilter>("all")
  const { data: res, isLoading } = useQuery<{ data: AdminSpecialist[]; total: number }>({
    queryKey: ["admin-specialists"],
    queryFn: async () => {
      const res = await fetch("/api/admin/specialists")
      if (!res.ok) throw new Error("Failed to fetch specialists")
      return res.json()
    },
    staleTime: 60 * 1000,
  })
  const specialists = res?.data ?? []

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
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-admin-text tracking-tight">Specialist Management</h1>
        <p className="text-sm text-admin-text-muted mt-1">Review, verify, and manage platform specialists.</p>
      </div>

      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setTabFilter(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              tabFilter === tab.key
                ? "bg-admin-brand text-white"
                : "bg-admin-bg text-admin-text-faint hover:bg-admin-surface-elevated"
            }`}
          >
            <tab.icon className="size-3.5" />
            {tab.label}
            <span className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              tabFilter === tab.key ? "bg-white/20" : "bg-admin-surface-elevated"
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
