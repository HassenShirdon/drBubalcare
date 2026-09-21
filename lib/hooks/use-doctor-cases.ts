import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';

export function useDoctorCases() {
  return useQuery({
    queryKey: queryKeys.doctor.cases.all,
    queryFn: async () => {
      const res = await fetch('/api/doctor/cases');
      if (!res.ok) throw new Error('Failed to fetch cases');
      return res.json();
    },
    staleTime: 60 * 1000,
  });
}

export function useDoctorCase(id: string) {
  return useQuery({
    queryKey: queryKeys.doctor.cases.detail(id),
    queryFn: async () => {
      const res = await fetch(`/api/doctor/cases/${id}`);
      if (!res.ok) throw new Error('Failed to fetch case');
      return res.json();
    },
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}

export function useSubmitOpinion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      caseId,
      content,
      sign,
    }: {
      caseId: string;
      content: string;
      sign: boolean;
    }) => {
      const res = await fetch(`/api/doctor/cases/${caseId}/opinion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, sign }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to submit opinion');
      }
      return res.json();
    },
    onSuccess: () => {
      // 'all' prefix-matches both the list and every detail key
      queryClient.invalidateQueries({ queryKey: queryKeys.doctor.cases.all });
    },
  });
}
