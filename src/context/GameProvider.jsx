// Data
import gameData from '../data/game.json' with { type: 'json' };
import mapsData from '../data/maps.json' with { type: 'json' };
import eventsData from '../data/events.json' with { type: 'json' };

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

    // Function that returns the last ID of the mapData events
    getLastEventId() {
      let lastEventId = -1;  // If the last was "-1", the actual is 0 :)
      for (const section of game.mapData) {
        for (const event of section.events) {
          lastEventId = event.eventId;
        }
      }

      return lastEventId;
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
      // Converts the entries of the array to [key, value]
      let arrayEntries = structuredClone(Object.entries(array));

      for (const item of arrayEntries) {
        // If the obj appearChance is equals to 0, skip this for
        if (item[1]?.appearChance === 0) continue;

        // If the obj does not have an appearChance, returns
        if (!item[1]?.appearChance) {
          console.warn("⚠️ obj of array in ponderedChance() does not have an appearChance."); 
          return null;
        }
      }

      // Sorting the array
      const sortedArray = structuredClone(arrayEntries).sort((a, b) => b[1].appearChance - a[1].appearChance);

      // Variable to storage sum of all chances
      const totalChance = sortedArray.reduce(
        (acc, [, obj]) => acc + obj.appearChance,
        0
      );

      // Generating the roll random number
      const roll = utils.random(totalChance);
      let cumulative = 0;

      for (const [key, obj] of sortedArray) {
        cumulative += obj.appearChance;
        //console.log("Object:", key, "Roll:", roll, "Cumulative:", cumulative);
        if (roll <= cumulative) return [key, obj];
      }

      // Just in case that something went wrong
      return this.ponderedChance(array);
    },

    // Generates a map region
    createRegion() {
      // Getting a region by generating it from a pondered chance
      const result = this.ponderedChance(mapsData);

      // Returns null if the result fails
      if (!result) return null;
      
      // Deconstructing the result
      const [regionKey, region] = result;

      // Defining the region to the game object currentMap
      controls.update({ currentMap: regionKey });

      // Generating a random number for the amount of sections
      const secAmount = utils.random(6, 4);

      // Creating the mapData sections
      let mapData = [];
      let lastEventId = eventsLogic.getLastEventId();
      for (let i = 0; i < secAmount; i++) {
        
        // Generating events to the region
        const eventsList = this.createEvents(i === 0 ? false : true);

        // Generating the section
        const [section, newLastEventId] = this.createSection(regionKey, eventsList, lastEventId);
        lastEventId = newLastEventId;
        mapData.push(section);
      };

      // Adding the boss event to the mapData
      const bossEvent = structuredClone([eventsData["bossBattle"]]);
      const [bossSection,] = this.createSection(regionKey, bossEvent, lastEventId);
      mapData.push(bossSection);

      // Returning the result
      return {regionKey, mapData};
    },

    // Functions that generates the events for a section
    createEvents(allowMultipleEvents = true) {
      // Setting up the variable of events
      let events = [];

      // Getting a event by generating it from a pondered chance
      const result = this.ponderedChance(eventsData);
      if (!result) return null;
      const [, eventTemplate] = result;  // Deconstructing the result
      events.push(structuredClone(eventTemplate))
      
      // Verifies if the section will have two events
      const doubleEventRoll = utils.random(100);
      if (doubleEventRoll < game?.doubleEventChance && allowMultipleEvents) {
        const secondResult = this.ponderedChance(eventsData);
        if (secondResult) {
          const [, secondEventTemplate] = secondResult;
          events.push(structuredClone(secondEventTemplate));
        }
      }

      // Returning the events
      return events;
    },

    // Function to generate the enemies of an battle event
    generateEnemies(regionKey, eventType, allowMultipleEnemies = true) {
      let enemiesToSpawn = [];
      const MAX_OF_ENEMIES = 3;

      // Getting the enemies list of the region and event type from the maps json
      const enemiesList = mapsData[regionKey]["enemies"][eventType];
      
      // Trying to spawn multiple enemies
      for (let i = 0; i < MAX_OF_ENEMIES; i++) {
        // Random number from 0 to 100
        const moreEnemiesRoll = utils.random(100);

        // Verifying if can spawn more enemies
        const multipleEnemiesChance = mapsData[regionKey]["multipleEnemiesChance"] + eventsLogic.getLastEventId();
        if (moreEnemiesRoll >= multipleEnemiesChance && i !== 0) {
          break;
        }

        const result = this.ponderedChance(enemiesList);
        if (!result) return null;
        const [enemyKey] = result;

        // Adding the enemies to the enemies to spawn list
        enemiesToSpawn.push({name: enemyKey});

        // If the allow multiples enemies is false, break the loop
        if (!allowMultipleEnemies) {
          break;
        }
      }
      
      // Returning the list of enemies
      return enemiesToSpawn;
    },

    // Function that creates the sections of a region
    createSection(regionKey, events, startingId) {
      // Updating the event with an ID and enemies to spawn
      let lastEventId = startingId;
      for (let event of events) {
        // ID
        event.eventId = lastEventId + 1;
        lastEventId++;

        // Enemies
        if (["battle", "bossBattle"].includes(event?.type)) {
          const enemiesToSpawn = this.generateEnemies(regionKey, event?.type, event?.allowMultipleEnemies);

          event.enemiesToSpawn = enemiesToSpawn;
        }
      }

      return [{
        url: mapsData[regionKey]["section"],
        events: events
      }, lastEventId];
    }
  };

  // Functions to handle the turns
  const turnLogic = {
    switchTurn(turnToSwitch = null) {
      // Saving the variable locally
      let nextTurn = turnToSwitch;

      // Verifying if the currentTurn is switchable
      if (!['player', 'enemies'].includes(game.currentTurn)) {
        return console.warn("⚠️ At switchTurn function: the current turn is not switchable.");
      };

      // Switching the current turn
      if (!nextTurn) {
        nextTurn = game.currentTurn === "player"
          ? "enemies"  // If the current turn is "player", the next is "enemies"
          : "player"  // Same thing from above
      };

      // Defining the next turn
      controls.update({ currentTurn: nextTurn })
    },
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