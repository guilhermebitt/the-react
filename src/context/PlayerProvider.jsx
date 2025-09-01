// Data
import playerJson from '../data/player.json' with { type: 'json' };

// Dependencies
import { createContext, useContext, useRef, useState } from "react";
import * as Entities from '../utils/entities.js';


const PlayerContext = createContext();  // Creating provider



export function PlayerProvider({ children }) {
  const [playerState, setPlayerState] = useState(new Entities.Player(playerJson));

  const get = () => {
    return playerState
  }

  const reset = () => setPlayerState(new Entities.Player(playerJson));

  return (
    <PlayerContext.Provider value={{ get, reset }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);
