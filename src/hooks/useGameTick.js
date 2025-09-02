// Data
import gameJson from '../data/game.json' with { type: 'json' };

// Dependencies
import { useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { produce } from "immer";



function useGameTick() {
  const [game, setGame] = useLocalStorage('game', gameJson);
  const [tick, setTick] = useState(game.gameTick || 0);

  // 1. Updates the tick interval
  useEffect(() => {
    const tickSpeed = game.tickSpeed || 500;

    const gameTickInterval = setInterval(() => {
      setTick(prevTick => (prevTick === 0 ? 1 : 0));
    }, tickSpeed);

    return () => {
      clearInterval(gameTickInterval);
    };
  }, [game.tickSpeed]);

  // 2. Reacts to the change
  useEffect(() => {
    setGame(produce(draft => {
      draft.gameTick = tick;
    }));
  }, [tick, setGame]);

}

export default useGameTick;