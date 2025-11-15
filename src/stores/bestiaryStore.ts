// bestiaryStore.ts
import { create } from "zustand";

type BestiaryStoreState = {
  discovered: Record<string, boolean>;
};

type BestiaryStoreAction = {
  discover: (id: string) => void;
  getCurrent: () => Record<string, boolean>;
  reset: () => void;
  loadSave: (saved: Record<string, boolean>) => void;
};

// Store type
type BestiaryStore = BestiaryStoreState & BestiaryStoreAction;

export const useBestiaryStore = create<BestiaryStore>((set, get) => ({
  discovered: {},

  discover: (id) =>
    set((state) => ({
      discovered: { ...state.discovered, [id]: true }
    })),

    // Returns the current state without causing components to rerender
  getCurrent: () => get().discovered ?? {},

  // Function to reset the game data
  reset: () => set({ discovered: {}}),

  // Function to load the game data
  loadSave: (saved) => set({ discovered: saved ?? {}}),
}));
