// Data
import playerJson from '../data/player.json' with { type: 'json' };

// Dependencies
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { createUpdater } from "../utils/stateUpdater";
import { Player } from '../utils/entities';
import { phrase } from '../utils/functions';
import { useGame } from '../hooks/useGame';

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
  const playerRef = useRef(player);

  // Checking if the increments changed
  useEffect(() => {
    player.incrementStats();
  }, [player.increases]);

  // Maintaining the player reference updated
  useEffect(() => {playerRef.current = player}, [player]);

  // On context construction
  useEffect(() => {
    // Putting the update function directly to the player 
    if (!player.update) player.update = update;
  }, []);

  // Tries to level up the player if he's xp value change
  useEffect(() => {
    const result = player.tryLevelUp();
    if (result) phrase('Level Up!')
  }, [player.xp]);

  // Code if the player dies
  useEffect(() => {
    if (!player.isDead()) return;

    // Phrase
    phrase("You died.");
    
    // Playing the death music:
    if (audios.get("gameMusic")?.isPlaying() && !audios.get("deathMusic")?.isPlaying()) {
      audios.get("gameMusic").stop();
      audios.get("deathMusic").start();
    }
  }, [player.isDead()]);

  const update = createUpdater(setPlayer);

  const getRef = () => playerRef.current;

  const get = () => player;

  const loadSave = (playerData) => setPlayer(new Player({ ...playerData, update: update }));

  const reset = () => setPlayer(new Player({ ...playerJson, update: update }));

  return (
    <PlayerContext.Provider value={{ get, getRef, update, loadSave, reset }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);
