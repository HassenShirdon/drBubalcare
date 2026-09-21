import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import type { AdminCase } from '@/app/admin/cases/columns';
import type { AdminSpecialist } from '@/app/admin/specialists/columns';
import type { DisputeEntry } from '@/app/admin/disputes/columns';
import type { AuditLogEntry } from '@/app/admin/audit-logs/columns';
import type { DataRequestEntry } from '@/app/admin/data-requests/columns';

export type UnmatchedCase = {
  id: string;
  serviceType: string;
  createdAt: string;
  patient: { name: string | null; email: string };
};

export function useAdminCases() {
  return useQuery<{ data: AdminCase[]; total: number }>({
    queryKey: queryKeys.admin.cases.list,
    queryFn: async () => {
      const res = await fetch('/api/admin/cases');
      if (!res.ok) throw new Error('Failed to fetch cases');
      return res.json();
    },
    staleTime: 60 * 1000,
  });
}

export function useAdminSpecialists() {
  return useQuery<{ data: AdminSpecialist[]; total: number }>({
    queryKey: queryKeys.admin.specialists,
    queryFn: async () => {
      const res = await fetch('/api/admin/specialists');
      if (!res.ok) throw new Error('Failed to fetch specialists');
      return res.json();
    },
    staleTime: 60 * 1000,
  });
}

export function useAdminDisputes() {
  return useQuery<DisputeEntry[]>({
    queryKey: queryKeys.admin.disputes.list,
    queryFn: async () => {
      const res = await fetch('/api/admin/disputes');
      if (!res.ok) throw new Error('Failed to fetch disputes');
      return res.json();
    },
    staleTime: 60 * 1000,
  });
}

export function useAdminAuditLogs(limit = 100, offset = 0) {
  return useQuery<{ logs: AuditLogEntry[]; total: number }>({
    queryKey: [...queryKeys.admin.auditLogs, { limit, offset }],
    queryFn: async () => {
      const res = await fetch(`/api/admin/audit-logs?limit=${limit}&offset=${offset}`);
      if (!res.ok) throw new Error('Failed to fetch audit logs');
      return res.json();
    },
    staleTime: 30 * 1000,
  });
}

export function useAdminDataRequests() {
  return useQuery<{ data: DataRequestEntry[]; total: number }>({
    queryKey: queryKeys.admin.dataRequests,
    queryFn: async () => {
      const res = await fetch('/api/admin/data-requests');
      if (!res.ok) throw new Error('Failed to fetch data requests');
      return res.json();
    },
    staleTime: 60 * 1000,
  });
}

export function useAdminEdgeCases() {
  return useQuery<{ cases: UnmatchedCase[] }>({
    queryKey: queryKeys.admin.edgeCases,
    queryFn: async () => {
      const res = await fetch('/api/admin/edge-cases/pending');
      if (!res.ok) throw new Error('Failed to fetch edge cases');
      return res.json();
    },
    staleTime: 30 * 1000,
  });
}
