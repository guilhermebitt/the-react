//importing Event interface and mapData
import { Event, SpawnableEnemy } from "@/types";
import mapsJson from "@/data/maps.json";

// mapData keys
type MapsKey = keyof typeof mapsJson;

// Enemies that can be spawned at current map
interface MapEnemies {
  battle: {
    [key: SpawnableEnemy]: {
      appearChance: number;
    };
  };
  bossBattle: {
    [key: SpawnableEnemy]: {
      appearChance: number;
    };
  };
}

// MapData
interface MapData {
  name: string;
  appearChance: number;
  src: string;
  section: string;
  multipleEnemiesChance: number;
  mapEnemies: MapEnemies;
}

// MapsData
type MapsData = Record<MapsKey, MapData>;

// The section of the mapData at the gameData
export interface Section {
  url: string;
  events: Event[];
}
