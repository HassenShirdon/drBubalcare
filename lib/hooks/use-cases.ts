import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';

export function useCases(take = 50, skip = 0) {
  return useQuery({
    queryKey: queryKeys.cases.list({ take, skip }),
    queryFn: async () => {
      const res = await fetch(`/api/cases?take=${take}&skip=${skip}`);
      const text = await res.text();
      if (!res.ok) throw new Error('Failed to fetch cases');
      try {
        const json = JSON.parse(text);
        // Support both paginated { data, total } and legacy array response
        return Array.isArray(json) ? json : (json.data ?? []);
      } catch {
        return [];
      }
    },
    staleTime: 60 * 1000,
  });
}

// Statuses where the case is still moving through the pipeline — poll for
// changes (e.g. AI pre-screen completing, specialist assigned) so the patient
// sees progress without a manual refresh. Polling stops once the opinion is
// ready or the case reaches a terminal state.
const IN_FLIGHT_STATUSES = new Set(['OPEN', 'AI_PRE_SCREENED', 'UNDER_REVIEW']);
const CASE_POLL_INTERVAL_MS = 30_000;

export function useCase(id: string) {
  return useQuery({
    queryKey: queryKeys.cases.detail(id),
    queryFn: async () => {
      const res = await fetch(`/api/cases/${id}`);
      const text = await res.text();
      if (!res.ok) throw new Error('Failed to fetch case');
      try { return JSON.parse(text); } catch { return null; }
    },
    enabled: !!id,
    staleTime: 60 * 1000,
    refetchInterval: (query) => {
      const status = (query.state.data as { status?: string } | null | undefined)?.status;
      return status && IN_FLIGHT_STATUSES.has(status) ? CASE_POLL_INTERVAL_MS : false;
    },
    // Pause polling while the tab is hidden (default behaviour, explicit here)
    refetchIntervalInBackground: false,
  });
}

export function useCreateCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      serviceType: string;
      description: string;
      intake?: Record<string, unknown>;
    }) => {
      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      const text = await res.text();
      if (!res.ok) {
        let message = `Failed to create case (status ${res.status})`;
        try {
          const error = JSON.parse(text);
          if (error.error) message = `${error.error} (status ${res.status})`;
          else if (error.formErrors) message = `${Object.values(error.formErrors).flat().join(', ')} (status ${res.status})`;
          else if (error.fieldErrors) message = `${Object.values(error.fieldErrors).flat().join(', ')} (status ${res.status})`;
        } catch {
          if (text) message = `${text} (status ${res.status})`;
        }
        throw new Error(message);
      }
      try {
        return JSON.parse(text);
      } catch {
        throw new Error('Unexpected response from server');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cases.all });
    },
  });
}
