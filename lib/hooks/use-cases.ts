import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useCases(take = 50, skip = 0) {
  return useQuery({
    queryKey: ['cases', { take, skip }],
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

export function useCase(id: string) {
  return useQuery({
    queryKey: ['cases', id],
    queryFn: async () => {
      const res = await fetch(`/api/cases/${id}`);
      const text = await res.text();
      if (!res.ok) throw new Error('Failed to fetch case');
      try { return JSON.parse(text); } catch { return null; }
    },
    enabled: !!id,
    staleTime: 60 * 1000,
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
      queryClient.invalidateQueries({ queryKey: ['cases'] });
    },
  });
}
