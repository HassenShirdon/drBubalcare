"use client"

import { useQuery } from "@tanstack/react-query"
import { motion } from "motion/react"
import { AlertTriangle, Clock, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TableSkeleton } from "@/components/ui/table-skeleton"

type UnmatchedCase = {
  id: string
  serviceType: string
  createdAt: string
  patient: { name: string | null; email: string }
}

export default function AdminEdgeCasesPage() {
  const { data, isLoading } = useQuery<{ cases: UnmatchedCase[] }>({
    queryKey: ["admin-edge-cases"],
    queryFn: async () => {
      const res = await fetch("/api/admin/edge-cases/pending")
      if (!res.ok) throw new Error("Failed to fetch edge cases")
      return res.json()
    },
    staleTime: 30 * 1000,
  })

  const cases = data?.cases ?? []

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[#64748B] text-sm mb-1">Admin Portal</p>
        <h1 className="text-[#1E3A5F] font-bold text-2xl md:text-3xl">Edge Cases</h1>
        <p className="text-[#64748B] text-sm mt-1">
          Cases requiring attention
        </p>
      </motion.div>

      {isLoading ? (
        <TableSkeleton columns={4} />
      ) : cases.length === 0 ? (
        <div className="text-center py-12">
          <AlertTriangle className="size-12 text-[#64748B] mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-[#0F172A]">No pending edge cases</h2>
          <p className="text-[#64748B] text-sm mt-1">All cases are being handled</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cases.map((c) => (
            <div key={c.id} className="border border-[#FECACA] bg-[#FEF2F2] rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FEF2F2] flex items-center justify-center">
                  <Clock className="size-5 text-[#E63946]" />
                </div>
                <div>
                  <p className="font-medium text-[#0F172A]">
                    Case {c.id.slice(0, 8)}...
                  </p>
                  <p className="text-sm text-[#64748B]">
                    {c.patient.name ?? "Unknown"} — Open for {Math.floor((Date.now() - new Date(c.createdAt).getTime()) / (1000 * 60 * 60))}h without specialist
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <UserPlus className="size-4 mr-1" />
                Assign
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
