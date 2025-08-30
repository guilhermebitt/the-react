// Data
import playerJson from '../data/player.json' with { type: 'json' };

// Dependencies
import { createContext, useContext, useRef } from "react";
import * as Entities from '../utils/entities.js';


const PlayerContext = createContext();  // Creating provider



export function PlayerProvider({ children }) {
  const playerRef = useRef(new Entities.Player(playerJson));

  const get = () => {
    const player = playerRef.current
    return player
  }

  const player = get()

  return (
    <PlayerContext.Provider value={ player }>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);