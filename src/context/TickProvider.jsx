// Data
import game from '../data/game.json' with { type: 'json' }

// Dependencies
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';



const TickContext = createContext();

export function TickProvider({ children }) {
  const [tick, setTick] = useState(0);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/game') setTick(0)  // Resets the tick
  }, [location.pathname])

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), game.tickSpeed);
    return () => clearInterval(interval);
  }, []);

  return (
    <TickContext.Provider value={tick}>
      {children}
    </TickContext.Provider>
  );
}

export const useTick = () => useContext(TickContext);