// Data
import playerJson from '../data/player.json' with { type: 'json' };

// Dependencies
import { createContext, useContext, useRef } from "react";
import { Player } from '../utils/entities.js';


const PlayerContext = createContext();  // Creating provider



export function PlayerProvider({ children }) {
  const playerRef = useRef(new Player(playerJson));

  const get = () => {
    const player = playerRef.current
    return player
  }

  const loadSave = (playerData) => {
    playerRef.current = new Player(playerData)
  }

  const reset = () => playerRef.current = new Player(playerJson);

  return (
    <PlayerContext.Provider value={{ get, loadSave, reset }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);
