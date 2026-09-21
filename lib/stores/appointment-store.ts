import { useAppStore } from './root-store';

// Backward-compatible alias — the appointment wizard now lives in the
// combined root store (booking slice) but keeps its own hook name.
export const useAppointmentStore = useAppStore;
