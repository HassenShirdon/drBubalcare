import type { StateCreator } from 'zustand';

export interface BookingSlice {
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

export const BOOKING_WIZARD_MAX_STEPS = 3;

export const createBookingSlice: StateCreator<BookingSlice, [], [], BookingSlice> = (set) => ({
  step: 1,
  selectedServiceId: null,
  selectedDate: null,
  selectedTime: null,
  nextStep: () => set((s) => ({ step: Math.min(s.step + 1, BOOKING_WIZARD_MAX_STEPS) })),
  prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1) })),
  goToStep: (step) => set({ step }),
  selectService: (id) => set({ selectedServiceId: id }),
  selectDateTime: (date, time) => set({ selectedDate: date, selectedTime: time }),
  reset: () => set({ step: 1, selectedServiceId: null, selectedDate: null, selectedTime: null }),
});
