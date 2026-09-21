import { useAppStore } from './root-store';

// Backward-compatible alias — the labs filter now lives in the combined
// root store (filters slice) but keeps its own hook name.
export const useLabsStore = useAppStore;
