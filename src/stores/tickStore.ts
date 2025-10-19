// Importing dependencies
import { create } from "zustand";
import { createSelectors } from "@/stores";
import gameJson from "@/data/game.json";

// State type
type TickStoreState = {
  tick: number,
  isCounting: boolean,
  tickInterval: any,
};
// Action type
type TickStoreAction = {
  update: (newTick: number) => void;
  start: (tickSpeed: number) => void;
  stop: () => void;
  getCurrent: () => number;
};

// Tick store hook
const useTickStore = create<TickStoreState & TickStoreAction>((set, get) => ({
  tick: 0,
  isCounting: false,
  tickInterval: null,
  update: (newTick) => set({tick: newTick}),
  start: (tickSpeed = gameJson.tickSpeed) => {
    if (get().isCounting) return console.warn('⚠️ The tick was already started');
        get().tickInterval = setInterval(() => set((state) => ({tick: state.tick + 1})), tickSpeed);
        get().isCounting = true;
  },
  stop: () => {},
  getCurrent: () => get().tick,
}));

// Tick store selectors
export const useTick = createSelectors(useTickStore);
