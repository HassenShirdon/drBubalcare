import type { StateCreator } from 'zustand';

export type DoctorCasesTab = 'all' | 'pending' | 'opinion_written';
export type SpecialistsTab = 'all' | 'verified' | 'unverified';

export interface FiltersSlice {
  // Patient labs list filter
  filterStatus: string | null;
  setFilterStatus: (status: string | null) => void;
  // Table tab filters — survive tab switches within a session
  doctorCasesTab: DoctorCasesTab;
  setDoctorCasesTab: (tab: DoctorCasesTab) => void;
  specialistsTab: SpecialistsTab;
  setSpecialistsTab: (tab: SpecialistsTab) => void;
}

export const createFiltersSlice: StateCreator<FiltersSlice, [], [], FiltersSlice> = (set) => ({
  filterStatus: null,
  setFilterStatus: (status) => set({ filterStatus: status }),
  doctorCasesTab: 'all',
  setDoctorCasesTab: (tab) => set({ doctorCasesTab: tab }),
  specialistsTab: 'all',
  setSpecialistsTab: (tab) => set({ specialistsTab: tab }),
});
