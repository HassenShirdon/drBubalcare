import { useQuery } from '@tanstack/react-query';

export function useLabResults() {
  return useQuery({
    queryKey: ['lab-results'],
    queryFn: async () => {
      const res = await fetch('/api/lab-results');
      if (!res.ok) throw new Error('Failed to fetch lab results');
      return res.json();
    },
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
  });
}
