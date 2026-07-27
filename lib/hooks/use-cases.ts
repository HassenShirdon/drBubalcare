import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useCases() {
  return useQuery({
    queryKey: ['cases'],
    queryFn: async () => {
      const res = await fetch('/api/cases');
      const text = await res.text();
      if (!res.ok) throw new Error('Failed to fetch cases');
      try { return JSON.parse(text); } catch { return []; }
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
    mutationFn: async (data: { serviceType: string; description: string }) => {
      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const text = await res.text();
      if (!res.ok) {
        let message = 'Failed to create case';
        try {
          const error = JSON.parse(text);
          if (error.error) message = error.error;
          else if (error.formErrors) message = Object.values(error.formErrors).flat().join(', ');
          else if (error.fieldErrors) message = Object.values(error.fieldErrors).flat().join(', ');
        } catch {
          if (text) message = text;
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
