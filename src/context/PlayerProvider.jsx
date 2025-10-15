// Data
import playerJson from '../data/player.json' with { type: 'json' };

// Dependencies
import { createContext, useContext, useState, useEffect } from "react";
import { createUpdater } from "../utils/stateUpdater.js";
import { Player } from '../utils/entities.js';
import { init, phrase } from '../utils/functions.ts';
import { useGame } from '../hooks/useGame.js';

const PlayerContext = createContext();

/**
 * For some reason, the useEffects did not work properly
 * when the context is created, so, if you need to get something
 * updated, give to it some attribute to listen and do not expect
 * that it will work on construction.
 */

export function PlayerProvider({ children }) {
  // Player State
  const [player, setPlayer] = useState(() => new Player({ ...playerJson, update: () => {} }));
  const { game } = useGame();

  // On context construction
  useEffect(() => {
    // Putting the update function directly to the player 
    if (!player.update) player.update = update;
    init(game);
  }, []);

  // Tries to level up the player if he's xp value change
  useEffect(() => {
    const result = player.tryLevelUp();
    if (result) phrase('Level Up!')
  }, [player.xp, player.level]);

  const update = createUpdater(setPlayer);

  const get = () => player;

  const loadSave = (playerData) => setPlayer(new Player({ ...playerData, update: update }));

  const reset = () => setPlayer(new Player({ ...playerJson, update: update }));

  return (
    <PlayerContext.Provider value={{ get, update, loadSave, reset }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);
