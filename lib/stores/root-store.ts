import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createUISlice, type UISlice } from './slices/ui.slice';
import { createBookingSlice, type BookingSlice } from './slices/booking.slice';
import { createFiltersSlice, type FiltersSlice } from './slices/filters.slice';

export type RootState = UISlice & BookingSlice & FiltersSlice;

export const useAppStore = create<RootState>()(
  persist(
    (...a) => ({
      ...createUISlice(...a),
      ...createBookingSlice(...a),
      ...createFiltersSlice(...a),
    }),
    {
      name: 'dbc-booking-wizard',
      storage: createJSONStorage(() => sessionStorage),
      // Only the booking wizard survives a refresh. PHI rule (AGENTS.md):
      // never persist identifiers — these fields are service/date/time strings only.
      partialize: (s) => ({
        step: s.step,
        selectedServiceId: s.selectedServiceId,
        selectedDate: s.selectedDate,
        selectedTime: s.selectedTime,
      }),
      // Rehydrate manually from a client effect (app/Providers.tsx) so the
      // server-rendered HTML never diverges from hydrated state.
      skipHydration: true,
    }
  )
);
