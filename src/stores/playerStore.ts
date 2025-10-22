// Importing dependencies
import { create } from "zustand";
import rawPlayerJson from "@/data/player.json";
import { PlayerData, UpdaterPatch } from "@/types";
import { createUpdater } from "@/utils/stateUpdater";
import { Player } from "@/utils/entities";

// Typing the data from playerJson
const playerJson = rawPlayerJson as unknown as PlayerData;

// State type
type PlayerStoreState = {
  player: Player,
};
// Action type
type PlayerStoreAction = {
  update: (patch: UpdaterPatch<Player>) => void;
  getCurrent: () => Player;
  reset: () => void;
  loadSave: (playerData: PlayerData) => void;
};
// Store type
type PlayerStore = PlayerStoreState & PlayerStoreAction;

// Tick store hook
export const usePlayerStore = create<PlayerStore>((set, get) => {
  // Defining the function to update the player instance
  const update = createUpdater<Player>((fn) => 
    set((state) => ({ player: fn(state.player) }))
  );
  
  // Initializing the player instance before creating the setPlayer function
  const player = new Player(playerJson, update);

  // Returning the actual state of the player without re-rendering
  const getCurrent = () => get().player;

  // Resetting the player state
  const reset = () => set({player: new Player(playerJson, update)});

  // Loads the data from the game save
  const loadSave = (playerData: PlayerData) => set({player: new Player(playerData, update)});

  // Returning the complete state
  return {
    player,
    update,
    getCurrent,
    reset,
    loadSave,
  }
});
