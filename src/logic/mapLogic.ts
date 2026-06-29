// Data
import rawMapsData from '../data/maps.json' with { type: 'json' };
import rawEventsData from '../data/events.json' with { type: 'json' };
import rawEnemiesData from '../data/enemies.json' with { type: 'json' };

// Importing TS types
import { GameData, GameUpdater, MapsData, MapsKey, Event, SpawnableEnemy, EventType, EnemyData } from "@/types";

// Other 
import { random, ponderedChance } from "@/utils/functions";

// Conversion of JSON to types
const mapsData = rawMapsData as unknown as MapsData;
const eventsData = rawEventsData as unknown as Record<EventType, Event>;
const enemiesData = rawEnemiesData as unknown as {[key in SpawnableEnemy]: EnemyData};

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
    // Generates a map region
    createRegion() {
      // Getting a region by generating it from a pondered chance
      const result = ponderedChance(mapsData as { [key: string]: Ponderable }) as [MapsKey, Ponderable];

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
      const result = ponderedChance(eventsData as unknown as { [key: string]: Ponderable });
      if (!result) return null;
      const [, eventTemplate] = result; // Deconstructing the result
      events.push(structuredClone(eventTemplate));

      // Verifies if the section will have two events
      const doubleEventRoll = random(100);
      if (doubleEventRoll < game?.doubleEventChance && allowMultipleEvents) {
        const secondResult = ponderedChance(eventsData as unknown as { [key: string]: Ponderable });
        if (secondResult) {
          const [, secondEventTemplate] = secondResult;
          events.push(structuredClone(secondEventTemplate));
        }
      }

      // Returning the events
      return events;
    },

    // Function to generate the enemies of an battle event
    generateEnemies(regionKey: MapsKey, eventType: EventType, allowMultipleEnemies = true, sectionNum: number) {
      let enemiesToSpawn = [];
      const MAX_OF_ENEMIES = 3;
      const SECTION_LEVEL_MULTIPLIER = 0.4;

      // Getting the enemies list of the region and event type from the maps json
      const enemiesList = mapsData[regionKey]["mapEnemies"][eventType] as Record<SpawnableEnemy, {appearChance: number }>;

      // Trying to spawn multiple enemies
      for (let i = 0; i < MAX_OF_ENEMIES; i++) {
        // Random number from 0 to 100
        const moreEnemiesRoll = random(100);

        // Verifying if can spawn more enemies
        const multipleEnemiesChance = mapsData[regionKey]["multipleEnemiesChance"] + eventsLogic.getLastEventId();
        if (moreEnemiesRoll >= multipleEnemiesChance && i !== 0) {
          break;
        }

        // Getting the name of the enemy
        const result = ponderedChance(enemiesList);
        if (!result) return null;
        const [enemyKey] = result as [SpawnableEnemy, Ponderable];

        // Getting the level of the enemy
        const regionLevel = random(mapsData[regionKey]["baseLevel"][1], mapsData[regionKey]["baseLevel"][0])
        const enemyBonus = enemiesData[enemyKey]["levelMod"]
        const sectionBonus = sectionNum * SECTION_LEVEL_MULTIPLIER
        const enemyLevel = Math.round(Math.max((regionLevel + enemyBonus + sectionBonus), 1))

        // Adding the enemies to the enemies to spawn list
        enemiesToSpawn.push({ name: enemyKey, level: enemyLevel });

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
      let sectionNum = getGame().currentMapSection;
      for (let event of events) {
        // ID
        event.eventId = lastEventId + 1;
        lastEventId++;

        // Enemies
        if (["battle", "bossBattle"].includes(event?.type)) {
          const enemiesToSpawn = this.generateEnemies(
            regionKey, 
            event?.type, 
            event.allowMultipleEnemies,
            sectionNum
          );

          event.enemiesToSpawn = enemiesToSpawn;
        }

        sectionNum++;
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
