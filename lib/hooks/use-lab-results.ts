import { useQuery } from '@tanstack/react-query';

export function useLabResults(take = 50, skip = 0) {
  return useQuery({
    queryKey: ['lab-results', { take, skip }],
    queryFn: async () => {
      const res = await fetch(`/api/lab-results?take=${take}&skip=${skip}`);
      if (!res.ok) throw new Error('Failed to fetch lab results');
      const json = await res.json();
      // Support both paginated { data, total } and legacy array response
      return Array.isArray(json) ? json : (json.data ?? []);
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useLabResult(id: string) {
  return useQuery({
    queryKey: ['lab-results', id],
    queryFn: async () => {
      const res = await fetch(`/api/lab-results/${id}`);
      if (!res.ok) throw new Error('Failed to fetch lab result');
      return res.json();
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
}
