import { useQuery } from '@tanstack/react-query';

export function useDoctors() {
  return useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const res = await fetch('/api/doctors');
      if (!res.ok) throw new Error('Failed to fetch doctors');
      return res.json();
    },
    staleTime: 15 * 60 * 1000,
  });
}

export function useDoctor(id: string) {
  return useQuery({
    queryKey: ['doctors', id],
    queryFn: async () => {
      const res = await fetch(`/api/doctors/${id}`);
      if (!res.ok) throw new Error('Failed to fetch doctor');
      return res.json();
    },
    enabled: !!id,
    staleTime: 15 * 60 * 1000,
  });
}
