"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "motion/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query-keys"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function PatientDisputePage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const caseId = params.id as string
  const [reason, setReason] = useState("")
  const [error, setError] = useState("")

  const disputeMutation = useMutation({
    mutationFn: async (disputeReason: string) => {
      const res = await fetch(`/api/cases/${caseId}/disputes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: disputeReason }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(typeof data.error === "string" ? data.error : "Failed to submit dispute")
      }

      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cases.detail(caseId) })
      router.push(`/patient/cases/${caseId}`)
    },
    onError: (err: Error) => {
      setError(err.message)
    },
  })

  const submitting = disputeMutation.isPending

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    disputeMutation.mutate(reason)
  }

  return (
    <div className="p-4 md:p-8 space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-pulse-navy font-bold text-2xl">File a Dispute</h1>
        <p className="text-pulse-text-secondary text-sm mt-1">
          If you believe the specialist opinion is incorrect, please describe your concern below.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-pulse-text-primary mb-1">
            Reason for dispute
          </label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please describe in detail why you believe the opinion should be reviewed..."
            rows={6}
            required
            minLength={20}
          />
          <p className="text-xs text-pulse-text-secondary mt-1">
            Minimum 20 characters. A peer specialist will review your case.
          </p>
        </div>

        {error && (
          <p className="text-sm text-pulse-red">{error}</p>
        )}

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting || reason.length < 20}>
            {submitting ? "Submitting..." : "Submit Dispute"}
          </Button>
        </div>
      </form>
    </div>
  )
}
