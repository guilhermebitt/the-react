// Data
import gameData from '../data/game.json' with { type: 'json' } 

// Dependencies
import { createContext, useContext, useState } from "react";



const GameContext = createContext();

export function GameProvider({ children }) {
  const [game, setGame] = useState(gameData)

  // Get the game object
  const get = () => game;

  // Function to update the game
  const update = (patch) => {
    setGame(prev => {
      const newGame = structuredClone(prev); // maintain the same instance to preserve the methods
      for (const key in patch) {
        const updater = patch[key];
        deepUpdate(
          newGame,
          key,
          updater
        );
      }
      return newGame;
    });
  };

  // Deep update method
  const deepUpdate = (obj, path, valueOrFn) => {
    const keys = path.split(".");
    let current = obj;
    keys.slice(0, -1).forEach(k => current = current[k]);

    const lastKey = keys[keys.length - 1];
    const prevValue = current[lastKey];

    current[lastKey] =
      typeof valueOrFn === "function" ? valueOrFn(prevValue) : valueOrFn;
  };

  // Loads the data from save to the game context
  const loadSave = (gameData) => {
    setGame(gameData);
  };

  // Resets the game data
  const reset = () => setGame(gameData);

  // Function to create a map region
  const createRegion = (region) => {
    
  };

  return (
    <GameContext.Provider value={{ get, update, loadSave, reset }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGameData = () => useContext(GameContext);