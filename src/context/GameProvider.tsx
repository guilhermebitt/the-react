// Data
import rawGameData from '../data/game.json' with { type: 'json' };

// Types
import { GameData } from '@/types';

// Dependencies
import { createContext, useContext, useState } from "react";
import { createUpdater } from "../utils/stateUpdater";

// Logic
import { createEventsLogic } from '@/logic/eventsLogic';
import { createTurnLogic } from '@/logic/turnLogic';
import { createMapLogic } from '@/logic/mapLogic';

// Conversion of JSON to types
const gameData = rawGameData as unknown as GameData;

interface GameContextType {
  get: () => GameData;
  update: (updates: any) => void;
  reset: () => void;
  loadSave: (gameData: GameData) => void;
  [key: string]: any;
}

// Creates the game context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Function to the game provider
export function GameProvider({ children }: { children: React.ReactNode }) {
  const [game, setGame] = useState<GameData>(gameData);
 
  // Functions to manipulate the game state:
  const controls = {
    get: () => game,

    // Update function
    update: createUpdater(setGame),

    // Resets the game data
    reset: () => setGame(gameData),

    // Loads the data from save to the game context
    loadSave: (gameData: GameData) => setGame(gameData)
  };

  // Functions to the events logic:
  const eventsLogic = createEventsLogic({getGame: controls.get, updateGame: controls.update});

  // Functions to control the map and events generation:
  const mapLogic = createMapLogic({getGame: controls.get, updateGame: controls.update, eventsLogic})

  // Functions to handle the turns
  const turnLogic = createTurnLogic({getGame: controls.get, updateGame: controls.update});

  // Joining the all the function to one object
  const functions = {...controls, ...eventsLogic, ...mapLogic, ...turnLogic};

  return (
    <GameContext.Provider value={functions}>
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
