// Data
import gameData from '../data/game.json' with { type: 'json' } 

// Dependencies
import { createContext, useContext, useState } from "react";
import { produce } from "immer";



const GameContext = createContext();

export function GameProvider({ children }) {
  const [game, setGame] = useState(gameData)

  const get = () => {
    return game
  }

  const update = (partial) => {
    setGame(produce(draft => {
      Object.assign(draft, partial);
    }));
  };

  const loadSave = (gameData) => {
    setGame(gameData);
  }

  const reset = () => setGame(gameData)

  return (
    <GameContext.Provider value={{ get, update, loadSave, reset }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGameData = () => useContext(GameContext);