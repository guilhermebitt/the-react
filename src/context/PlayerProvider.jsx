// Data
import playerJson from '../data/player.json' with { type: 'json' };

// Dependencies
import { createContext, useContext, useState } from "react";
import { createUpdater } from "../utils/stateUpdater.js";
import { Player } from '../utils/entities.js';

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  // Player State
  const [player, setPlayer] = useState(() => new Player({ ...playerJson, update: () => {} }));

  // Update function
  const update = createUpdater(setPlayer);

  const get = () => player;

  const loadSave = (playerData) => setPlayer(new Player({ ...playerData, update: update }));

  const reset = () => setPlayer(new Player({ ...playerJson, update: update }));

  // Putting the update function directly to the player 
  if (!player.update) {
    player.update = update;
  }

  return (
    <PlayerContext.Provider value={{ get, update, loadSave, reset }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);