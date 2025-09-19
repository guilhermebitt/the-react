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

  const finishEvent = () => {
    const event = game?.eventData?.event;
    const pathToEvent = findEventPath(event?.eventId);
    update({ [pathToEvent]: prev => ({...prev, "isFinished": true}) });
    passEvents();
  };

  // Function to pass the events in the map
  const passEvents = () => {
    let nextSectionId = game?.currentMapSection + 1;
    let nextEvents = [];

    // Getting the next section
    const nextSection = game?.mapData[nextSectionId];

    // Setting up the next events
    nextSection?.events.map((event) => {
      if (!event?.isFinished) {  // If the event is not "finished"/skipped
        nextEvents.push(event?.eventId);
      }
    });

    // Adding the nextEvents to the eventsEnabled
    update({ eventsEnabled: nextEvents })

    // Updating the currentMapSection
    update({ currentMapSection: nextSectionId });
  };

  const getEventById = (id) => {
    // This function return the event by its ID
    for (const data of game?.mapData) {
      const found = data?.events.find(event => event?.eventId === id);
      if (found) return found;
    }
    return null;
  };

  const findEventPath = (id) => {
    // This function return the path to the event passed by the ID
    for (let i = 0; i < game?.mapData.length; i++) {
      const section = game?.mapData[i];
      for (let j = 0; j < section?.events?.length; j++) {
        const event = section?.events[j];
        if (event?.eventId === id) {
          return `mapData.${i}.events.${j}`;
        }
      }
    }
    return null;
  };

  return (
    <GameContext.Provider value={{ get, update, loadSave, reset, finishEvent, findEventPath }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGameData = () => useContext(GameContext);