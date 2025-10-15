// Data
import rawMapsData from '../data/maps.json' with { type: 'json' };
import rawEventsData from '../data/events.json' with { type: 'json' };

// Importing TS types
import { GameData, GameUpdater, MapsData, MapsKey, Event, SpawnableEnemy, EventType } from "@/types";

// Other 
import { random } from "@/utils/functions";

// Conversion of JSON to types
const mapsData = rawMapsData as unknown as MapsData;
const eventsData = rawEventsData as unknown as Record<EventType, Event>;

// EventsLogicManager
interface EventManager {
  passEvents(): void;
  finishEvent(): void;
  getEventById(id: number): Event | null;
  getLastEventId(): number;
  findEventPath(id: number | undefined): string | null;
}

// Interface for the deps
export interface MapLogicDeps {
  getGame: () => GameData;
  updateGame: GameUpdater;
  eventsLogic: EventManager;
}

// Custom interface for ponderable objects
interface Ponderable {
  // All ponderable objects must have an appearChance
  appearChance: number;

  // All other keys can be any
  [key: string]: any;
};

// Functions that handle the context dependencies
export function createMapLogic(deps: MapLogicDeps) {
  const { getGame, updateGame, eventsLogic } = deps;

  return {
    // Creates the ponderedChance of an array of objects with appearChance
    ponderedChance(PonderableArray: { [key: string]: Ponderable }): [string, Ponderable] | null {
      // Converts the entries of the array to [key, value]
      let arrayEntries = structuredClone(Object.entries(PonderableArray));

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
      const totalChance = sortedArray.reduce((acc, [, obj]) => acc + obj.appearChance, 0);

      // Generating the roll random number
      const roll = random(totalChance);
      let cumulative = 0;

      for (const [key, obj] of sortedArray) {
        cumulative += obj.appearChance;
        const validKeys = Object.keys(mapsData) as MapsKey[];
        //console.log("Object:", key, "Roll:", roll, "Cumulative:", cumulative);
        if (roll <= cumulative) return [key, obj];
      }

      // Just in case that something went wrong
      return this.ponderedChance(PonderableArray);
    },

    // Generates a map region
    createRegion() {
      // Getting a region by generating it from a pondered chance
      const result = this.ponderedChance(mapsData as { [key: string]: Ponderable }) as [MapsKey, Ponderable];

      // Returns null if the result fails
      if (!result) return null;

      // Deconstructing the result
      const [regionKey, region] = result;

      // Defining the region to the game object currentMap
      updateGame({ currentMap: regionKey });

      // Generating a random number for the amount of sections
      const secAmount = random(6, 4);

      // Creating the mapData sections
      let mapData = [];
      let lastEventId = eventsLogic.getLastEventId();
      for (let i = 0; i < secAmount; i++) {
        // Generating events to the region
        const eventsList = this.createEvents(i === 0 ? false : true) as unknown as Event[];

        // Generating the section
        const [section, newLastEventId] = this.createSection(regionKey, eventsList, lastEventId);
        lastEventId = newLastEventId as number;
        mapData.push(section);
      }

      // Adding the boss event to the mapData
      const event: Event = structuredClone(eventsData["bossBattle"]);
      const events: Event[] = [event];

      const [bossSection] = this.createSection(regionKey, events, lastEventId);
      mapData.push(bossSection);

      // Returning the result
      return { regionKey, mapData };
    },

    // Functions that generates the events for a section
    createEvents(allowMultipleEvents = true) {
      const game = getGame();
      // Setting up the variable of events
      let events = [];

      // Getting a event by generating it from a pondered chance
      const result = this.ponderedChance(eventsData as unknown as { [key: string]: Ponderable });
      if (!result) return null;
      const [, eventTemplate] = result; // Deconstructing the result
      events.push(structuredClone(eventTemplate));

      // Verifies if the section will have two events
      const doubleEventRoll = random(100);
      if (doubleEventRoll < game?.doubleEventChance && allowMultipleEvents) {
        const secondResult = this.ponderedChance(eventsData as unknown as { [key: string]: Ponderable });
        if (secondResult) {
          const [, secondEventTemplate] = secondResult;
          events.push(structuredClone(secondEventTemplate));
        }
      }

      // Returning the events
      return events;
    },

    // Function to generate the enemies of an battle event
    generateEnemies(regionKey: MapsKey, eventType: EventType, allowMultipleEnemies = true) {
      let enemiesToSpawn = [];
      const MAX_OF_ENEMIES = 3;

      // Getting the enemies list of the region and event type from the maps json
      const enemiesList: Record<SpawnableEnemy, { appearChance: number }> = mapsData[regionKey]["mapEnemies"][
        eventType
      ] as Record<SpawnableEnemy, { appearChance: number }>;

      // Trying to spawn multiple enemies
      for (let i = 0; i < MAX_OF_ENEMIES; i++) {
        // Random number from 0 to 100
        const moreEnemiesRoll = random(100);

        // Verifying if can spawn more enemies
        const multipleEnemiesChance = mapsData[regionKey]["multipleEnemiesChance"] + eventsLogic.getLastEventId();
        if (moreEnemiesRoll >= multipleEnemiesChance && i !== 0) {
          break;
        }

        const result = this.ponderedChance(enemiesList);
        if (!result) return null;
        const [enemyKey] = result as [SpawnableEnemy, Ponderable];

        // Adding the enemies to the enemies to spawn list
        enemiesToSpawn.push({ name: enemyKey });

        // If the allow multiples enemies is false, break the loop
        if (!allowMultipleEnemies) {
          break;
        }
      }

      // Returning the list of enemies
      return enemiesToSpawn;
    },

    // Function that creates the sections of a region
    createSection(regionKey: MapsKey, events: Event[], startingId: number) {
      // Updating the event with an ID and enemies to spawn
      let lastEventId = startingId;
      for (let event of events) {
        // ID
        event.eventId = lastEventId + 1;
        lastEventId++;

        // Enemies
        if (["battle", "bossBattle"].includes(event?.type)) {
          const enemiesToSpawn = this.generateEnemies(regionKey, event?.type, event.allowMultipleEnemies);

          event.enemiesToSpawn = enemiesToSpawn;
        }
      }

      return [
        {
          url: mapsData[regionKey]["section"],
          events: events,
        },
        lastEventId,
      ];
    },
  };
}
