// Data
import playerJson from '../data/player.json' with { type: 'json' };

// Dependencies
import { createContext, useContext, useState } from "react";
import { Player } from '../utils/entities.js';

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  // Player State
  const [player, setPlayer] = useState(() => new Player(playerJson));

  // Function to update the player
  const update = (patch) => {
    setPlayer(prev => {
      const newPlayer = prev; // maintain the same instance to preserve the methods
      for (const key in patch) {
        const value = patch[key];
        deepUpdate(
          newPlayer,
          key,
          typeof value === "function" ? value(newPlayer) : value
        );
      }
      return newPlayer;
    });
  };

  // Deep update method
  const deepUpdate = (obj, path, value) => {
    const keys = path.split(".");
    let current = obj;
    keys.slice(0, -1).forEach(k => current = current[k]);
    current[keys[keys.length - 1]] = value;
  };

  const get = () => player;

  const loadSave = (playerData) => setPlayer(new Player(playerData));

  const reset = () => setPlayer(new Player(playerJson));

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