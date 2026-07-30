"use client"

import { useState } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { AlertTriangle, Bell, Clock, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import Link from "next/link"

type UnmatchedCase = {
  id: string
  serviceType: string
  createdAt: string
  patient: { name: string | null; email: string }
}

export default function AdminEdgeCasesPage() {
  const [alertMessage, setAlertMessage] = useState("")
  const [alertCaseId, setAlertCaseId] = useState<string | null>(null)

  const { data, isLoading } = useQuery<{ cases: UnmatchedCase[] }>({
    queryKey: ["admin-edge-cases"],
    queryFn: async () => {
      const res = await fetch("/api/admin/edge-cases/pending")
      if (!res.ok) throw new Error("Failed to fetch edge cases")
      return res.json()
    },
    staleTime: 30 * 1000,
  })

  const urgentAlertMutation = useMutation({
    mutationFn: async ({ caseId, message }: { caseId: string; message: string }) => {
      const res = await fetch("/api/admin/edge-cases/urgent-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId, message }),
      })
      if (!res.ok) throw new Error("Failed to send urgent alert")
      return res.json()
    },
    onSuccess: () => {
      setAlertCaseId(null)
      setAlertMessage("")
    },
  })

  const cases = data?.cases ?? []

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-admin-text tracking-tight">Edge Cases</h1>
        <p className="text-sm text-admin-text-muted mt-1">Cases requiring attention</p>
      </div>

      {isLoading ? (
        <TableSkeleton columns={4} />
      ) : cases.length === 0 ? (
        <div className="text-center py-16">
          <AlertTriangle className="size-10 text-admin-text-faint mx-auto mb-4" />
          <h2 className="text-base font-semibold text-admin-text">No pending edge cases</h2>
          <p className="text-sm text-admin-text-muted mt-1">All cases are being handled</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cases.map((c) => (
            <div
              key={c.id}
              className="border border-admin-danger/30 bg-admin-danger-light rounded-xl p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-10 rounded-full bg-admin-danger-light flex items-center justify-center shrink-0">
                  <Clock className="size-5 text-admin-danger" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-admin-text">
                    Case {c.id.slice(0, 8)}...
                  </p>
                  <p className="text-sm text-admin-text-muted truncate">
                    {c.patient.name ?? "Unknown"} - Open for {Math.floor((Date.now() - new Date(c.createdAt).getTime()) / (1000 * 60 * 60))}h without specialist
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setAlertCaseId(c.id)
                    setAlertMessage(`Urgent: Case ${c.id.slice(0, 8)}... has been unmatched for over 4 hours.`)
                  }}
                >
                  <Bell className="size-4" />
                  Alert
                </Button>
                <Link href="/admin/cases">
                  <Button variant="outline" size="sm">
                    <UserPlus className="size-4" />
                    Assign
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {alertCaseId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setAlertCaseId(null)}>
          <div className="bg-admin-surface rounded-xl p-6 max-w-md w-full mx-4 shadow-xl border border-admin-border" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-base font-semibold text-admin-text mb-3">Send Urgent Alert</h2>
            <textarea
              value={alertMessage}
              onChange={(e) => setAlertMessage(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-admin-border bg-admin-bg p-3 text-sm text-admin-text resize-none focus:outline-none focus:ring-2 focus:ring-admin-brand-muted/40"
              placeholder="Alert message..."
            />
            <p className="text-xs text-admin-text-faint mt-2">
              This will notify all admins and the patient&apos;s primary contact.
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={() => setAlertCaseId(null)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => urgentAlertMutation.mutate({ caseId: alertCaseId, message: alertMessage })}
                disabled={urgentAlertMutation.isPending || !alertMessage.trim()}
              >
                {urgentAlertMutation.isPending ? "Sending..." : "Send Alert"}
              </Button>
            </div>
            {urgentAlertMutation.isError && (
              <p className="text-xs text-admin-danger mt-2">Failed to send alert. Try again.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
