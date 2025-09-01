// Data
import gameData from '../data/game.json' with { type: 'json' } 

// Dependencies
import { createContext, useContext, useState } from "react";
import { produce } from "immer";



const GameContext = createContext();

export function GameProvider({ children }) {
  const [gameState, setGameState] = useState(gameData)

  const data = () => {
    return gameState
  }

  const update = (partial) => {
    setGameState(produce(draft => {
      Object.assign(draft, partial);
    }));
  };

  const reset = () => setGameState(gameData)

  return (
    <GameContext.Provider value={{ data, update, reset }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGameData = () => useContext(GameContext);