"use client";

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Briefcase, Loader2, Search, UserPlus, RefreshCw } from 'lucide-react';

type CaseWithRelations = {
  id: string;
  serviceType: string;
  status: string;
  createdAt: string;
  patient: { name: string | null; email: string };
  specialist: { name: string | null; email: string } | null;
};

type DoctorWithUser = {
  id: string;
  userId: string;
  specialty: string;
  verified: boolean;
  user: { name: string | null; email: string };
};

const serviceTypeLabels: Record<string, string> = {
  SPECIALIST_OPINION: 'Specialist Opinion',
  RESULT_INTERPRETATION: 'Result Interpretation',
  FOLLOW_UP: 'Follow-up',
  TREND_ANALYSIS: 'Trend Analysis',
};

const statusConfig: Record<string, { label: string; color: string }> = {
  OPEN: { label: 'Open', color: 'bg-blue-50 text-blue-600' },
  AI_PRE_SCREENED: { label: 'Pre-screened', color: 'bg-purple-50 text-purple-600' },
  UNDER_REVIEW: { label: 'Under Review', color: 'bg-amber-50 text-amber-600' },
  OPINION_READY: { label: 'Opinion Ready', color: 'bg-healing-teal/10 text-healing-teal' },
  CLOSED: { label: 'Closed', color: 'bg-gray-100 text-gray-500' },
  DISPUTED: { label: 'Disputed', color: 'bg-red-50 text-red-600' },
};

export default function AdminCasesPage() {
  const [filter, setFilter] = useState<'all' | 'unassigned' | 'under_review'>('all');
  const [search, setSearch] = useState('');
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: cases, isLoading } = useQuery({
    queryKey: ['admin-cases'],
    queryFn: async () => {
      const res = await fetch('/api/admin/cases');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    staleTime: 60 * 1000,
  });

  const { data: doctors } = useQuery({
    queryKey: ['admin-specialists'],
    queryFn: async () => {
      const res = await fetch('/api/admin/specialists');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    staleTime: 60 * 1000,
  });

  const assignMutation = useMutation({
    mutationFn: async ({ caseId, specialistId }: { caseId: string; specialistId: string | null }) => {
      const res = await fetch(`/api/admin/cases/${caseId}/assign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ specialistId }),
      });
      if (!res.ok) throw new Error('Failed to assign');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cases'] });
      setAssigningId(null);
    },
  });

  const verifiedDoctors = (doctors ?? []).filter((d: DoctorWithUser) => d.verified);

  const filtered = (cases ?? [])
    .filter((c: CaseWithRelations) => {
      if (filter === 'unassigned') return !c.specialist;
      if (filter === 'under_review') return c.status === 'UNDER_REVIEW';
      return true;
    })
    .filter((c: CaseWithRelations) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        c.patient.name?.toLowerCase().includes(q) ||
        c.patient.email.toLowerCase().includes(q) ||
        c.serviceType.toLowerCase().includes(q)
      );
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline-lg text-2xl font-bold text-clinical-navy">Case Routing</h1>
        <p className="text-on-surface-variant text-sm mt-1">Assign cases to verified specialists.</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search cases..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-surface-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-clinical-navy/20 focus:border-clinical-navy"
          />
        </div>
        <div className="flex gap-1 bg-surface rounded-lg p-1">
          {(['all', 'unassigned', 'under_review'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === f
                  ? 'bg-clinical-navy text-white'
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              {f === 'all' ? 'All' : f === 'unassigned' ? 'Unassigned' : 'Under Review'}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-healing-teal" size={32} />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-surface-gray overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-gray bg-surface-container-low">
                <th className="text-left px-4 py-3 font-semibold text-clinical-navy">Patient</th>
                <th className="text-left px-4 py-3 font-semibold text-clinical-navy">Service Type</th>
                <th className="text-left px-4 py-3 font-semibold text-clinical-navy">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-clinical-navy">Specialist</th>
                <th className="text-left px-4 py-3 font-semibold text-clinical-navy">Created</th>
                <th className="text-right px-4 py-3 font-semibold text-clinical-navy">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-on-surface-variant">
                    No cases found.
                  </td>
                </tr>
              ) : (
                filtered.map((c: CaseWithRelations) => {
                  const s = statusConfig[c.status] || statusConfig.OPEN;
                  return (
                    <tr key={c.id} className="border-b border-surface-gray/50 hover:bg-surface-container-low/50">
                      <td className="px-4 py-3 font-medium text-clinical-navy">
                        {c.patient.name ?? 'Unknown'}
                      </td>
                      <td className="px-4 py-3 text-on-surface-variant">
                        {serviceTypeLabels[c.serviceType] || c.serviceType}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${s.color}`}>
                          {s.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-on-surface-variant text-xs">
                        {c.specialist?.name ?? <span className="text-amber-500 italic">Unassigned</span>}
                      </td>
                      <td className="px-4 py-3 text-on-surface-variant text-xs">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {assigningId === c.id ? (
                          <div className="flex items-center gap-2 justify-end">
                            <select
                              className="text-xs border border-surface-gray rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-clinical-navy/20"
                              onChange={(e) => {
                                if (e.target.value) {
                                  assignMutation.mutate({ caseId: c.id, specialistId: e.target.value });
                                }
                              }}
                              defaultValue=""
                            >
                              <option value="" disabled>Select specialist...</option>
                              {verifiedDoctors.map((d: DoctorWithUser) => (
                                <option key={d.userId} value={d.userId}>
                                  {d.user.name} ({d.specialty})
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => setAssigningId(null)}
                              className="text-xs text-on-surface-variant hover:text-error"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setAssigningId(c.id)}
                            className="inline-flex items-center gap-1 text-xs text-clinical-navy hover:text-healing-teal font-medium transition-colors"
                          >
                            {c.specialist ? <RefreshCw className="size-3" /> : <UserPlus className="size-3" />}
                            {c.specialist ? 'Reassign' : 'Assign'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
