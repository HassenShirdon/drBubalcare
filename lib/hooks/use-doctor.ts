import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import type { DoctorPatient } from '@/app/doctor/patients/columns';
import type { LabReview } from '@/app/doctor/labs/review/columns';

export function useDoctors() {
  return useQuery({
    queryKey: queryKeys.doctors.all,
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
    queryKey: queryKeys.doctors.detail(id),
    queryFn: async () => {
      const res = await fetch(`/api/doctors/${id}`);
      if (!res.ok) throw new Error('Failed to fetch doctor');
      return res.json();
    },
    enabled: !!id,
    staleTime: 15 * 60 * 1000,
  });
}

export function useDoctorPatients() {
  return useQuery<DoctorPatient[]>({
    queryKey: queryKeys.doctor.patients,
    queryFn: async () => {
      const res = await fetch('/api/doctor/patients');
      if (!res.ok) throw new Error('Failed to fetch patients');
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useDoctorLabReviews() {
  return useQuery<LabReview[]>({
    queryKey: queryKeys.doctor.labReviews,
    queryFn: async () => {
      const res = await fetch('/api/lab-results/pending-review');
      if (!res.ok) throw new Error('Failed to fetch lab reviews');
      return res.json();
    },
    staleTime: 2 * 60 * 1000,
  });
}
