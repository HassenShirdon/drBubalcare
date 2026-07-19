"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion } from "motion/react"
import { Shield, Download, Trash2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export default function PatientPrivacyPage() {
  const queryClient = useQueryClient()
  const [deleting, setDeleting] = useState(false)

  const { data: consent } = useQuery<{ consentType: string; granted: boolean }[]>({
    queryKey: ["patient-consent"],
    queryFn: async () => {
      const res = await fetch("/api/patient/consent")
      if (!res.ok) throw new Error("Failed")
      return res.json()
    },
  })

  const consentMutation = useMutation({
    mutationFn: async ({ type, granted }: { type: string; granted: boolean }) => {
      await fetch("/api/patient/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consentType: type, granted }),
      })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["patient-consent"] }),
  })

  const exportMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/patient/data-export", { method: "POST" })
      if (!res.ok) throw new Error("Export failed")
      const data = await res.json()
      const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `drbubalcare-data-export-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
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
    onSuccess: () => setDeleting(false),
  })

  const aiProcessing = consent?.find((c) => c.consentType === "AI_PROCESSING")?.granted ?? false
  const dataSharing = consent?.find((c) => c.consentType === "DATA_SHARING")?.granted ?? false

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-on-surface-variant text-sm mb-1">Patient Portal</p>
        <h1 className="text-clinical-navy font-bold text-2xl md:text-3xl">Privacy Settings</h1>
      </motion.div>

      <div className="border rounded-lg p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="size-5 text-healing-teal" />
          <h2 className="font-semibold text-text-medical-black">Consent Management</h2>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">AI Processing</p>
            <p className="text-xs text-on-surface-variant">Allow AI to analyze your clinical data for pre-screening and summaries</p>
          </div>
          <Switch
            checked={aiProcessing}
            onCheckedChange={(checked) => consentMutation.mutate({ type: "AI_PROCESSING", granted: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">Data Sharing with Specialists</p>
            <p className="text-xs text-on-surface-variant">Allow sharing your data with assigned specialists for review</p>
          </div>
          <Switch
            checked={dataSharing}
            onCheckedChange={(checked) => consentMutation.mutate({ type: "DATA_SHARING", granted: checked })}
          />
        </div>
      </div>

      <div className="border rounded-lg p-5 space-y-4">
        <h2 className="font-semibold text-text-medical-black">Your Data</h2>

        <Button variant="outline" onClick={() => exportMutation.mutate()} disabled={exportMutation.isPending}>
          <Download className="size-4 mr-2" />
          {exportMutation.isPending ? "Exporting..." : "Export My Data"}
        </Button>
      </div>

      <div className="border border-error/20 rounded-lg p-5 space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-5 text-error" />
          <h2 className="font-semibold text-error">Danger Zone</h2>
        </div>

        {!deleting ? (
          <Button variant="outline" onClick={() => setDeleting(true)}>
            <Trash2 className="size-4 mr-2" />
            Request Data Deletion
          </Button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-on-surface-variant">
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
