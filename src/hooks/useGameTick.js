// Data
import gameJson from '../data/game.json' with { type: 'json' };

// Dependencies
import { useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { produce } from "immer";



function useGameTick() {
  const [game, setGame] = useLocalStorage('game', gameJson);
  const [tick, setTick] = useState(game.gameTick || 0);

  // Updating gameTick
  useEffect(() => {
    const tickSpeed = game.tickSpeed || 500;

    // Updating gameTick
    const gameTickInterval = setInterval(() => {
      setTick(prevTick => {
        const newTick = (prevTick === 0 ? 1 : 0);

        // Updates the gameTick too
        setGame(produce(draft => {
          draft.gameTick = newTick;
        }));

        return newTick;
      });
    }, tickSpeed);

    return () => {
      clearInterval(gameTickInterval);
    };
  }, [game.tickSpeed, setGame]);

}

export default useGameTick;