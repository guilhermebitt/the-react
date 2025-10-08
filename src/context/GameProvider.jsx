// Data
import gameData from '../data/game.json' with { type: 'json' } 

// Dependencies
import { createContext, useContext, useState } from "react";
import { createUpdater } from "../utils/stateUpdater.js";

// Creates the game context
const GameContext = createContext();

// Function to the game provider
export function GameProvider({ children }) {
  const [game, setGame] = useState(gameData);

  // OBJECT DATA FUNCTIONS
  // Get the game object
  const get = () => game;

  // Update function
  const update = createUpdater(setGame);

  // Resets the game data
  const reset = () => setGame(gameData);

  // Loads the data from save to the game context
  const loadSave = (gameData) => {
    setGame(gameData);
  };

  // GAME LOGIC FUNCTIONS
  // Finishes the event
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

  // Gets the event by the ID
  const getEventById = (id) => {
    // This function return the event by its ID
    for (const data of game?.mapData) {
      const found = data?.events.find(event => event?.eventId === id);
      if (found) return found;
    }
    return null;
  };

  // Gets the event by the path
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

  // Functions to export
  const values = {
    get,
    update,
    reset,
    loadSave,
    finishEvent,
    findEventPath,
  }

  return (
    <GameContext.Provider value={values}>
      {children}
    </GameContext.Provider>
  );
}

export const useGameData = () => useContext(GameContext);