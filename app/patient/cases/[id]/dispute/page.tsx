"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function PatientDisputePage() {
  const params = useParams()
  const router = useRouter()
  const caseId = params.id as string
  const [reason, setReason] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const res = await fetch(`/api/cases/${caseId}/disputes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(typeof data.error === "string" ? data.error : "Failed to submit dispute")
        return
      }

      router.push(`/patient/cases/${caseId}`)
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-[#1E3A5F] font-bold text-2xl">File a Dispute</h1>
        <p className="text-[#64748B] text-sm mt-1">
          If you believe the specialist opinion is incorrect, please describe your concern below.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#0F172A] mb-1">
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
          <p className="text-xs text-[#64748B] mt-1">
            Minimum 20 characters. A peer specialist will review your case.
          </p>
        </div>

        {error && (
          <p className="text-sm text-[#B91C1C]">{error}</p>
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
