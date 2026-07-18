import { create } from 'zustand';

interface AppointmentState {
  step: number;
  selectedServiceId: string | null;
  selectedDate: string | null;
  selectedTime: string | null;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  selectService: (id: string) => void;
  selectDateTime: (date: string, time: string) => void;
  reset: () => void;
}

export const useAppointmentStore = create<AppointmentState>((set) => ({
  step: 1,
  selectedServiceId: null,
  selectedDate: null,
  selectedTime: null,
  nextStep: () => set((s) => ({ step: Math.min(s.step + 1, 3) })),
  prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1) })),
  goToStep: (step) => set({ step }),
  selectService: (id) => set({ selectedServiceId: id }),
  selectDateTime: (date, time) => set({ selectedDate: date, selectedTime: time }),
  reset: () => set({ step: 1, selectedServiceId: null, selectedDate: null, selectedTime: null }),
}));
