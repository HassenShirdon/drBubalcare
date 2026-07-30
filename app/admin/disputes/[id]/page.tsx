"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
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

  if (isLoading) return <div className="p-6 text-admin-text-muted">Loading...</div>
  if (!dispute) return <div className="p-6 text-admin-text-muted">Dispute not found</div>

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-4xl">
      <div>
        <Link href="/admin/disputes" className="text-sm text-admin-success hover:underline inline-flex items-center gap-1 mb-3">
          <ArrowLeft className="size-3" /> Back to disputes
        </Link>
        <h1 className="text-xl md:text-2xl font-semibold text-admin-text tracking-tight">Dispute Detail</h1>
        <p className="text-sm text-admin-text-muted mt-1">
          Case {dispute.case.id.slice(0, 8)}... - Filed by {dispute.patient.name ?? "Unknown"}
        </p>
      </div>

      <div className="bg-admin-surface rounded-xl border border-admin-border p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-admin-text">Original Opinion</h2>
          <span className="text-xs text-admin-text-faint">By {dispute.opinion.specialist.name}</span>
        </div>
        <div className="text-sm text-admin-text-muted whitespace-pre-wrap leading-relaxed">{dispute.opinion.content || "(Draft - not yet written)"}</div>
      </div>

      <div className="bg-admin-surface rounded-xl border border-admin-border p-5 space-y-3">
        <h2 className="text-sm font-semibold text-admin-text">Patient Dispute Reason</h2>
        <p className="text-sm text-admin-text-muted whitespace-pre-wrap leading-relaxed">{dispute.reason}</p>
      </div>

      {dispute.peerReviewOpinion && (
        <div className="border border-admin-brand-muted/30 bg-admin-brand-light/30 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-admin-text">Peer Review Opinion</h2>
            <span className="text-xs text-admin-text-faint">By {dispute.peerReviewOpinion.specialist.name}</span>
          </div>
          <div className="text-sm text-admin-text-muted whitespace-pre-wrap leading-relaxed">{dispute.peerReviewOpinion.content}</div>
        </div>
      )}

      {dispute.adminNotes && dispute.status !== "PENDING" && (
        <div className="bg-admin-surface-elevated rounded-xl border border-admin-border p-5 space-y-2">
          <h2 className="text-sm font-semibold text-admin-text">Admin Notes</h2>
          <p className="text-sm text-admin-text-muted whitespace-pre-wrap">{dispute.adminNotes}</p>
        </div>
      )}

      {dispute.status === "PENDING" && (
        <div className="bg-admin-surface rounded-xl border border-admin-border p-5 space-y-4">
          <h2 className="text-sm font-semibold text-admin-text">Admin Triage</h2>
          <Textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Add admin notes (optional)..."
            rows={3}
          />
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => triageMutation.mutate(false)}>
              <XCircle className="size-4" /> Dismiss
            </Button>
            <Button onClick={() => triageMutation.mutate(true)}>
              <CheckCircle className="size-4" /> Mark Valid
            </Button>
          </div>
        </div>
      )}

      {dispute.status === "UNDER_REVIEW" && (
        <div className="bg-admin-surface rounded-xl border border-admin-border p-5 space-y-4">
          <h2 className="text-sm font-semibold text-admin-text">Assign Peer Review</h2>
          <PeerReviewAssignment disputeId={disputeId} />
        </div>
      )}

      {dispute.status === "PEER_REVIEW_ASSIGNED" && (
        <div className="bg-admin-surface rounded-xl border border-admin-border p-5 space-y-4">
          <h2 className="text-sm font-semibold text-admin-text">Resolve Dispute</h2>
          <Textarea
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            placeholder="Document the resolution..."
            rows={4}
          />
          <Button onClick={() => resolveMutation.mutate()} disabled={resolution.length < 10}>
            Resolve Dispute
          </Button>
        </div>
      )}

      {dispute.resolution && (
        <div className="border border-admin-success/20 bg-admin-success-light/50 rounded-xl p-5 space-y-2">
          <h2 className="text-sm font-semibold text-admin-text">Resolution</h2>
          <p className="text-sm text-admin-text-muted whitespace-pre-wrap">{dispute.resolution}</p>
          {dispute.adminNotes && (
            <p className="text-xs text-admin-text-faint">Notes: {dispute.adminNotes}</p>
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
    <div onMouseEnter={loadCandidates} className="space-y-2">
      {error && (
        <p className="text-sm text-admin-danger">{error}</p>
      )}
      {loading ? (
        <p className="text-sm text-admin-text-muted">Loading candidates...</p>
      ) : candidates.length === 0 && !error ? (
        <p className="text-sm text-admin-text-muted">No matching specialists found</p>
      ) : (
        candidates.map((c) => (
          <div key={c.userId} className="flex items-center justify-between border border-admin-border rounded-xl p-3">
            <div>
              <p className="text-sm font-medium text-admin-text">{c.name ?? "Unknown"}</p>
              <p className="text-xs text-admin-text-muted">{c.specialty}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => assignMutation.mutate(c.userId)}
              disabled={assignMutation.isPending}
            >
              <UserPlus className="size-3" />
              {assignMutation.isPending ? "Assigning..." : "Assign"}
            </Button>
          </div>
        ))
      )}
    </div>
  )
}
