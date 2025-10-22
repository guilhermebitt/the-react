// Dependencies
import { createContext, useContext } from "react";
import { useStore } from "@/stores";

// Logic
import { createEventsLogic } from '@/logic/eventsLogic';
import { createMapLogic } from '@/logic/mapLogic';
import { useTurnLogic } from "@/logic/useTurnLogic";

// Creates the logic context
const LogicContext = createContext({});

// Function to the game provider
export function LogicProvider({ children }: { children: React.ReactNode }) {
  // Game actions
  const game = useStore("game", "actions")
  
  // Functions to handle the turns
  const turnLogic = useTurnLogic();

  // Functions to the events logic:
  const eventsLogic = createEventsLogic({ getGame: game.getCurrent, updateGame: game.update });

  // Functions to control the map and events generation:
  const mapLogic = createMapLogic({ getGame: game.getCurrent, updateGame: game.update, eventsLogic });

  const logic = { ...turnLogic, ...eventsLogic, ...mapLogic };

  return (
    <LogicContext.Provider value={logic}>
      {children}
    </LogicContext.Provider>
  );
}

export const useLogic = () => {
  const context = useContext(LogicContext);
  if (!context) {
    throw new Error('useGameData must be used within LogicProvider');
  }
  return context;
};
