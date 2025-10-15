// In this file you'll encounter the event types and interfaces
// Importing the enemies Json
import enemiesJson from "@/data/enemies.json";

// importing constant
import { eventsTypes } from "@/types/constants";

// Event types and path
type EventType = typeof eventsTypes[number];
type EventPath = `/${EventType}`;

// This will take all keys of the enemiesJson, with exception of "commonProperties" and "deathAnimation"
type SpawnableEnemy = Exclude<keyof typeof enemiesJson, "commonProperties" | "deathAnimation">;

// This is the base interface for the event to work
interface Event {
  eventId?: number;
  type: EventType;
  path: EventPath;
  isFinished: boolean;
  enemiesToSpawn?:
    | {
        name: SpawnableEnemy;
        level?: number;
      }[]
    | null;
  allowMultipleEnemies: boolean;
}

// EventData: this is the interface for the event used at the moment in gameplay
interface EventData {
  event: Event;
  isFirstLoad: boolean;
  type: EventType;
  killsOnEvent: number;
  path: EventPath;
}
