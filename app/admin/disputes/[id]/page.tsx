"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion } from "motion/react"
import { ArrowLeft, CheckCircle, XCircle, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

type DisputeDetail = {
  id: string
  status: string
  reason: string
  adminNotes: string | null
  resolution: string | null
  createdAt: string
  resolvedAt: string | null
  case: { id: string; serviceType: string; description: string | null }
  patient: { name: string | null; email: string }
  opinion: { content: string; specialist: { name: string | null; email: string } }
  peerReviewOpinion: { content: string; specialist: { name: string | null; email: string } } | null
}

type PeerCandidate = {
  userId: string
  name: string | null
  email: string
  specialty: string
}

export default function AdminDisputeDetailPage() {
  const params = useParams()
  const queryClient = useQueryClient()
  const disputeId = params.id as string
  const [adminNotes, setAdminNotes] = useState("")
  const [resolution, setResolution] = useState("")

  const { data: dispute, isLoading } = useQuery<DisputeDetail>({
    queryKey: ["admin-dispute", disputeId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/disputes/${disputeId}`)
      if (!res.ok) throw new Error("Failed to fetch dispute")
      return res.json()
    },
  })

  const triageMutation = useMutation({
    mutationFn: async (valid: boolean) => {
      const res = await fetch(`/api/admin/disputes/${disputeId}/triage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ valid, adminNotes }),
      })
      if (!res.ok) throw new Error("Failed to triage")
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-dispute", disputeId] }),
  })

  const resolveMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/admin/disputes/${disputeId}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolution, adminNotes }),
      })
      if (!res.ok) throw new Error("Failed to resolve")
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-dispute", disputeId] }),
  })

  if (isLoading) return <div className="p-6">Loading...</div>
  if (!dispute) return <div className="p-6">Dispute not found</div>

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/admin/disputes" className="text-sm text-[#22C55E] hover:underline inline-flex items-center gap-1 mb-3">
          <ArrowLeft className="size-3" /> Back to disputes
        </Link>
        <h1 className="text-[#1E3A5F] font-bold text-2xl">Dispute Detail</h1>
        <p className="text-[#64748B] text-sm">
          Case {dispute.case.id.slice(0, 8)}... — Filed by {dispute.patient.name ?? "Unknown"}
        </p>
      </motion.div>

      <div className="border border-[#E2E8F0] rounded-lg p-4 space-y-3">
        <h2 className="font-semibold text-[#0F172A]">Original Opinion</h2>
        <p className="text-sm text-[#64748B]">By {dispute.opinion.specialist.name}</p>
        <div className="text-sm whitespace-pre-wrap">{dispute.opinion.content || "(Draft - not yet written)"}</div>
      </div>

      <div className="border border-[#E2E8F0] rounded-lg p-4 space-y-3">
        <h2 className="font-semibold text-[#0F172A]">Patient Dispute Reason</h2>
        <p className="text-sm whitespace-pre-wrap">{dispute.reason}</p>
      </div>

      {dispute.peerReviewOpinion && (
        <div className="border border-[#C4B5FD] bg-[#F5F3FF] rounded-lg p-4 space-y-3">
          <h2 className="font-semibold text-[#0F172A]">Peer Review Opinion</h2>
          <p className="text-sm text-[#64748B]">By {dispute.peerReviewOpinion.specialist.name}</p>
          <div className="text-sm whitespace-pre-wrap">{dispute.peerReviewOpinion.content}</div>
        </div>
      )}

      {dispute.status === "PENDING" && (
        <div className="border border-[#E2E8F0] rounded-lg p-4 space-y-3">
          <h2 className="font-semibold text-[#0F172A]">Admin Triage</h2>
          <Textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Add admin notes (optional)..."
            rows={3}
            className="bg-[#F8FAFC] border-[#E2E8F0]"
          />
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => triageMutation.mutate(false)}>
              <XCircle className="size-4 mr-1" /> Dismiss
            </Button>
            <Button onClick={() => triageMutation.mutate(true)}>
              <CheckCircle className="size-4 mr-1" /> Mark Valid
            </Button>
          </div>
        </div>
      )}

      {dispute.status === "UNDER_REVIEW" && (
        <div className="border border-[#E2E8F0] rounded-lg p-4 space-y-3">
          <h2 className="font-semibold text-[#0F172A]">Assign Peer Review</h2>
          <PeerReviewAssignment disputeId={disputeId} />
        </div>
      )}

      {dispute.status === "PEER_REVIEW_ASSIGNED" && (
        <div className="border border-[#E2E8F0] rounded-lg p-4 space-y-3">
          <h2 className="font-semibold text-[#0F172A]">Resolve Dispute</h2>
          <Textarea
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            placeholder="Document the resolution..."
            rows={4}
            className="bg-[#F8FAFC] border-[#E2E8F0]"
          />
          <Button onClick={() => resolveMutation.mutate()} disabled={resolution.length < 10}>
            Resolve Dispute
          </Button>
        </div>
      )}

      {dispute.resolution && (
        <div className="border border-[#22C55E]/20 bg-[#DCFCE7]/50 rounded-lg p-4 space-y-2">
          <h2 className="font-semibold text-[#0F172A]">Resolution</h2>
          <p className="text-sm whitespace-pre-wrap">{dispute.resolution}</p>
          {dispute.adminNotes && (
            <p className="text-xs text-[#64748B]">Notes: {dispute.adminNotes}</p>
          )}
        </div>
      )}
    </div>
  )
}

function PeerReviewAssignment({ disputeId }: { disputeId: string }) {
  const queryClient = useQueryClient()
  const [candidates, setCandidates] = useState<PeerCandidate[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const assignMutation = useMutation({
    mutationFn: async (specialistId: string) => {
      const res = await fetch(`/api/admin/disputes/${disputeId}/assign-peer-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ specialistId }),
      })
      if (!res.ok) throw new Error("Failed to assign specialist")
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-dispute", disputeId] }),
  })

  async function loadCandidates() {
    if (candidates.length > 0) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/disputes/${disputeId}/peer-review-candidates`)
      if (!res.ok) throw new Error("Failed to load candidates")
      const data = await res.json()
      setCandidates(data.candidates)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load candidates")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div onMouseEnter={loadCandidates}>
      {error && (
        <p className="text-sm text-[#B91C1C]">{error}</p>
      )}
      {loading ? (
        <p className="text-sm text-[#64748B]">Loading candidates...</p>
      ) : candidates.length === 0 && !error ? (
        <p className="text-sm text-[#64748B]">No matching specialists found</p>
      ) : (
        <div className="space-y-2">
          {candidates.map((c) => (
            <div key={c.userId} className="flex items-center justify-between border border-[#E2E8F0] rounded-lg p-3">
              <div>
                <p className="font-medium text-sm">{c.name ?? "Unknown"}</p>
                <p className="text-xs text-[#64748B]">{c.specialty}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => assignMutation.mutate(c.userId)}
                disabled={assignMutation.isPending}
              >
                <UserPlus className="size-3 mr-1" />
                {assignMutation.isPending ? "Assigning..." : "Assign"}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
