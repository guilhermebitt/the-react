// Data
import game from '../data/game.json' with { type: 'json' }

// Dependencies
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useLocation } from 'react-router-dom';



const TickContext = createContext();

export function TickProvider({ children }) {
  const [tick, setTick] = useState(0);
  const location = useLocation();
  const intervalRef = useRef(null);
  const isCountingRef = useRef(false);

  // Resets the tick if the player returns to menu
  useEffect(() => {
    if (['/menu'].includes(location.pathname)) setTick(0)
  }, [location.pathname]);

  const get = () => tick;

  const set = (value) => setTick(value);

  const start = () => {
    if (isCountingRef.current) return console.warn('⚠️ The tick was already started');
    intervalRef.current = setInterval(() => setTick(t => t + 1), game.tickSpeed);
    isCountingRef.current = true;
  };

  const stop = () => {
    if (!isCountingRef.current) return console.warn('⚠️ The tick was already stopped');
    clearInterval(intervalRef.current);
    isCountingRef.current = false;
  }

  return (
    <TickContext.Provider value={{ get, set, start, stop }}>
      {children}
    </TickContext.Provider>
  );
}

export const useTick = () => useContext(TickContext);