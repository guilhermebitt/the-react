// Data
import gameData from '../data/game.json' with { type: 'json' } 

// Dependencies
import { createContext, useContext, useState } from "react";
import { produce } from "immer";



const GameContext = createContext();

export function GameProvider({ children }) {
  const [game, setGame] = useState(gameData)

  const get = () => game;

  // Function to update the game
  const update = (patch) => {
    setGame(prev => {
      const newGame = structuredClone(prev); // maintain the same instance to preserve the methods
      for (const key in patch) {
        const value = patch[key];
        deepUpdate(
          newGame,
          key,
          typeof value === "function" ? value(newGame) : value
        );
      }
      return newGame;
    });
  };

  // Deep update method
  const deepUpdate = (obj, path, value) => {
    const keys = path.split(".");
    let current = obj;
    keys.slice(0, -1).forEach(k => current = current[k]);
    current[keys[keys.length - 1]] = value;
  };

  /*const update = (partial) => {
    setGame(produce(draft => {
      Object.assign(draft, partial);
    }));
  };*/

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