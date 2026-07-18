import { create } from 'zustand';

interface LabsState {
  filterStatus: string | null;
  setFilterStatus: (status: string | null) => void;
}

export const useLabsStore = create<LabsState>((set) => ({
  filterStatus: null,
  setFilterStatus: (status) => set({ filterStatus: status }),
}));
