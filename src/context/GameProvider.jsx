// Data
import gameData from '../data/game.json' with { type: 'json' };
import mapsData from '../data/maps.json' with { type: 'json' };

// Dependencies
import { createContext, useContext, useState } from "react";
import { createUpdater } from "../utils/stateUpdater.js";

// Creates the game context
const GameContext = createContext();

// Function to the game provider
export function GameProvider({ children }) {
  const [game, setGame] = useState(gameData);

  // Functions to manipulate the game state:
  const controls = {
    get: () => game,

    // Update function
    update: createUpdater(setGame),

    // Resets the game data
    reset: () => setGame(gameData),

    // Loads the data from save to the game context
    loadSave: (gameData) => setGame(gameData)
  };

  // Utils functions
  const utils = {
    // Generates a random number
    // Returns the min AND the max (e.g. random(100) => min: 0, max: 100)
    random(max, min = 0) {
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      return min + (array[0] % (max + 1 - min));
    }
  }

  // Functions to the events logic:
  const eventsLogic = {
    // Finishes the event
    finishEvent() {
      const event = game?.eventData?.event;
      const pathToEvent = this.findEventPath(event?.eventId);
      controls.update({ [pathToEvent]: prev => ({...prev, "isFinished": true}) });
      this.passEvents();
    },

    // Function to pass the events in the map
    passEvents() {
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
      controls.update({ eventsEnabled: nextEvents })

      // Updating the currentMapSection
      controls.update({ currentMapSection: nextSectionId });
    },

    // Gets the event by the ID
    getEventById(id) {
      // This function return the event by its ID
      for (const data of game?.mapData) {
        const found = data?.events.find(event => event?.eventId === id);
        if (found) return found;
      }
      return null;
    },

    // Gets the event by the path
    findEventPath(id) {
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
    }
  };

  // Functions to control the map and events generation:
  const mapLogic = {
    // Creates the ponderedChance of an array of objects with appearChance
    ponderedChance(array) {
      try {
        for (const item of array) {
          // If the obj does not have an appearChance, returns
          if (!item[1]?.appearChance) {console.warn("⚠️ obj of array in ponderedChance() does not have an appearChance."); return null;}
        }
      } catch (e) {
        console.error("something goes wrong: ", e)
        return null;
      }

      // Sorting the array
      const sortedArray = structuredClone(array.sort((a, b) => b[1].appearChance - a[1].appearChance));

      // Variable to storage the pondered chance
      let ponderedChance = 0;

      // Iterates into the array to get the pondered chance
      for (const [, obj] of sortedArray) {
        // Adds the chance to the total
        ponderedChance += obj?.appearChance || 0;
      };

      // Iterates into the array to update the appearChance of the obj accordingly to the pondered chance
      for (const [, obj] of sortedArray) {
        // Updates the appear chance of the obj
        obj.appearChance = ponderedChance * (obj.appearChance / 100);
      };

      // Iterates into the array to verify the individual chance of each obj
      for (const [objKey, obj] of sortedArray) {
        // Setting the chance value
        const roll = utils.random(ponderedChance);

        // Console.log just for debugging
        console.log("Verifying chance. Obj:", obj?.name || obj, "Roll:", roll, "Chance(<):", obj.appearChance);

        if (roll <= obj.appearChance) {
          console.log("Obj selected:", obj?.name || obj);

          // Returning the result if the object is select
          return [objKey, obj];
        }
      };

      // Trying again if obj is not selected
      console.log("Nothing selected. Trying again...")
      this.ponderedChance(array);
    },

    // Generates a map region
    createRegion() {
      // Converts the entries of the map to an array with [key, value]
      let maps = structuredClone(Object.entries(mapsData));

      // Getting a region by generating it from a pondered chance
      const result = this.ponderedChance(maps);

      // Returns null if the result fails
      if (!result) return null;
      
      // Deconstructing the result
      const [regionKey, region] = result;

      // Defining the region to the game object currentMap
      controls.update({ currentMap: regionKey });

      // Creates the mapData sections
      this.createSections(region);

      // Returning the result
      return {regionKey, region};

      // Iterates into the maps array to verify the individual chance of each region
      for (const [regionKey, region] of maps) {
        // Setting the chance value
        const chance = utils.random(ponderedChance);

        // Console.log just for debugging
        console.log("Verifying chance to spawn. Region:", region.name, "Roll:", chance, "Chance(<):", region.appearChance);

        if (chance <= region.appearChance) {
          console.log("Region selected: ", region.name);

          // Defining the region to the game object currentMap
          controls.update({ currentMap: regionKey })

          // Creates the mapData sections
          this.createSections(region);

          // Returning the result
          return {regionKey, region};
        }
      };

      // If nothing is selected, calls the function again
      console.log("Nothing selected.");
      this.createRegion();
    },

    // Functions that generates the events for a section
    createEvents() {
      // Generating a random number for the double event chance
      const doubleEventRoll = utils.random(100);

      // Generating a random number for the events
      const eventRoll = utils.random(100);

      // Getting an event from the chance

      // Verifying if the section will have two events
      if (doubleEventRoll < game.doubleEventChance) {

      }
    },

    // Function that creates the sections of a region
    createSections(region, secNumber = 4) {
      // Variable of the mapData
      let mapData = structuredClone(game.mapData);

      // Generating the first sections
      for (let i = 0; i < secNumber; i++) {
        const section = {
          "url": region?.section
        }

        // Adding section to the mapData
        mapData.push(section);
      }

      console.log(mapData)

      // Generating the boss section
    }
  };

  // Joining the all the function to one object
  const functions = {...controls, ...eventsLogic, ...mapLogic};

  return (
    <GameContext.Provider value={functions}>
      {children}
    </GameContext.Provider>
  );
}

export const useGameData = () => useContext(GameContext);