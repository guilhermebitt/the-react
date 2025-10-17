// Data
import rawGameData from '../data/game.json' with { type: 'json' };

// Types
import { GameData, UpdaterPatch } from '@/types';

// Dependencies
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { createUpdater } from "../utils/stateUpdater";

// Conversion of JSON to types
const gameData = rawGameData as unknown as GameData;

interface GameContextType {
  get: () => GameData;
  update: (patch: UpdaterPatch<GameData>) => void;
  reset: () => void;
  loadSave: (gameData: GameData) => void;
  [key: string]: any;
}

// Creates the game context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Function to the game provider
export function GameProvider({ children }: { children: React.ReactNode }) {
  const [game, setGame] = useState<GameData>(gameData);
  const gameRef = useRef(game);

  // Maintaining the game reference updated
  useEffect(() => {gameRef.current = game}, [game]);
 
  // Functions to manipulate the game state:
  const controls = {
    // Gets the game ref
    getRef: () => gameRef.current,

    // Gets the game data
    get: () => game,

    // Update function
    update: createUpdater(setGame),

    // Resets the game data
    reset: () => setGame(gameData),

    // Loads the data from save to the game context
    loadSave: (gameData: GameData) => setGame(gameData)
  };

  return (
    <GameContext.Provider value={controls}>
      {children}
    </GameContext.Provider>
  );
}

export const useGameData = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameData must be used within GameProvider');
  }
  return context;
};
