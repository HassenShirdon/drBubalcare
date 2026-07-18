import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useCases() {
  return useQuery({
    queryKey: ['cases'],
    queryFn: async () => {
      const res = await fetch('/api/cases');
      if (!res.ok) throw new Error('Failed to fetch cases');
      return res.json();
    },
  });
}

export function useCase(id: string) {
  return useQuery({
    queryKey: ['cases', id],
    queryFn: async () => {
      const res = await fetch(`/api/cases/${id}`);
      if (!res.ok) throw new Error('Failed to fetch case');
      return res.json();
    },
    enabled: !!id,
  });
}

export function useCreateCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { serviceType: string; description: string }) => {
      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create case');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
    },
  });
}
