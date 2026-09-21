"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query-keys"
import { motion } from "motion/react"
import { Shield, Download, Trash2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export default function PatientPrivacyPage() {
  const queryClient = useQueryClient()
  const [deleting, setDeleting] = useState(false)
  const [deletionRequested, setDeletionRequested] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)

  const { data: consent } = useQuery<{ consentType: string; granted: boolean }[]>({
    queryKey: queryKeys.patient.consent,
    queryFn: async () => {
      const res = await fetch("/api/patient/consent")
      if (!res.ok) throw new Error("Failed")
      return res.json()
    },
  })

  const consentMutation = useMutation({
    mutationFn: async ({ type, granted }: { type: string; granted: boolean }) => {
      const res = await fetch("/api/patient/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consentType: type, granted }),
      })
      if (!res.ok) throw new Error("Failed to update consent")
      return res.json()
    },
    // Optimistic update: flip the toggle immediately, roll back on error
    onMutate: async ({ type, granted }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.patient.consent })
      const previous = queryClient.getQueryData<{
        consentType: string
        granted: boolean
      }[]>(queryKeys.patient.consent)
      queryClient.setQueryData<{
        consentType: string
        granted: boolean
      }[]>(queryKeys.patient.consent, (old) =>
        old?.map((c) => (c.consentType === type ? { ...c, granted } : c))
      )
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.patient.consent, context.previous)
      }
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.patient.consent }),
  })

  const exportMutation = useMutation({
    mutationFn: async () => {
      setExportError(null)
      const res = await fetch("/api/patient/data-export", { method: "POST" })
      if (!res.ok) throw new Error("Export failed")
      const data = await res.json()
      try {
        const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `drbubalcare-data-export-${new Date().toISOString().slice(0, 10)}.json`
        a.click()
        URL.revokeObjectURL(url)
      } catch (err) {
        setExportError(err instanceof Error ? err.message : "Failed to download export")
      }
    },
  })

  const deletionMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/patient/data-deletion", { method: "POST" })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }
      return res.json()
    },
    onSuccess: () => {
      setDeleting(false)
      setDeletionRequested(true)
    },
  })

  const aiProcessing = consent?.find((c) => c.consentType === "AI_PROCESSING")?.granted ?? false
  const dataSharing = consent?.find((c) => c.consentType === "DATA_SHARING")?.granted ?? false

  return (
    <div className="p-4 md:p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-pulse-text-secondary text-sm mb-1">Patient Portal</p>
        <h1 className="text-pulse-navy font-bold text-2xl md:text-3xl">Privacy Settings</h1>
      </motion.div>

      <div className="border rounded-lg p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="size-5 text-pulse-success" />
          <h2 className="font-semibold text-pulse-text-primary">Consent Management</h2>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">AI Processing</p>
            <p className="text-xs text-pulse-text-secondary">Allow AI to analyze your clinical data for pre-screening and summaries</p>
          </div>
          <Switch
            checked={aiProcessing}
            onCheckedChange={(checked) => consentMutation.mutate({ type: "AI_PROCESSING", granted: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">Data Sharing with Specialists</p>
            <p className="text-xs text-pulse-text-secondary">Allow sharing your data with assigned specialists for review</p>
          </div>
          <Switch
            checked={dataSharing}
            onCheckedChange={(checked) => consentMutation.mutate({ type: "DATA_SHARING", granted: checked })}
          />
        </div>
      </div>

      <div className="border rounded-lg p-5 space-y-4">
        <h2 className="font-semibold text-pulse-text-primary">Your Data</h2>

        <Button variant="outline" onClick={() => exportMutation.mutate()} disabled={exportMutation.isPending}>
          <Download className="size-4 mr-2" />
          {exportMutation.isPending ? "Exporting..." : "Export My Data"}
        </Button>
        {exportError && <p className="text-sm text-pulse-red mt-2">{exportError}</p>}
      </div>

      <div className="border border-pulse-red/20 rounded-lg p-5 space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-5 text-pulse-red" />
          <h2 className="font-semibold text-pulse-red">Danger Zone</h2>
        </div>

        {!deleting && !deletionRequested ? (
          <Button variant="outline" onClick={() => setDeleting(true)}>
            <Trash2 className="size-4 mr-2" />
            Request Data Deletion
          </Button>
        ) : deletionRequested ? (
          <p className="text-sm text-pulse-text-secondary">
            Deletion requested — your data will be deleted after 30 days. You can cancel within that time.
          </p>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-pulse-text-secondary">
              Are you sure? Your data will be deleted after a 30-day grace period. You can cancel within that time.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setDeleting(false)}>Cancel</Button>
              <Button
                variant="destructive"
                onClick={() => deletionMutation.mutate()}
                disabled={deletionMutation.isPending}
              >
                {deletionMutation.isPending ? "Processing..." : "Confirm Deletion"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
