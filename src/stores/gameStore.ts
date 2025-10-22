// Importing dependencies
import { create } from "zustand";
import gameJson from "@/data/game.json";
import { GameData, UpdaterPatch } from "@/types";
import { createUpdater } from "@/utils/stateUpdater";

// Getting the initial gameData
const gameData = gameJson as unknown as GameData;

// State type
type GameStoreState = {
  game: GameData;
};
// Action type
type GameStoreAction = {
  update: (patch: UpdaterPatch<GameData>) => void;
  getCurrent: () => GameData;
  reset: () => void;
  loadSave: (gameData: GameData) => void;
};
// Store type
type GameStore = GameStoreState & GameStoreAction;

// Tick store hook
export const useGameStore = create<GameStore>((set, get) => ({
  // Initial value of gameData
  game: gameData,

  // Updater to the game
  update: createUpdater<GameData>((fn) => set((state) => ({ game: fn(state.game) }))),

  // Function to get the game data without causing re-render
  getCurrent: () => get().game,

  // Function to reset the game data
  reset: () => set({ game: gameData}),

  // Function to load the game data
  loadSave: (gameData) => set({ game: gameData }),
}));
