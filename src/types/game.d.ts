// Importing the the types used in GameData
import { EventData, Section, EntityIds, MapsKey, UpdaterPatch } from "@/types/";
import { validTurns } from "@/types/constants";

type TurnTypes = typeof validTurns[number];

// Main interface
interface GameData {
  // Gameplay settings
  firstLoad: boolean;
  specificEnemyTurn: EntityIds;
  target: any;  // ID of the entity
  tickSpeed: number;

  // Temporary gameplay atributes
  currentSave: number | null,  // ID of the save at localStorage
  currentTurn: TurnTypes,
  currentMap: MapsKey | null,
  currentMapSection: number,  // ID of the section
  currentMusic: [string, boolean],  // [URL, loop(?)]
  currentPath: any;  // This will be depreciated

  // Terminal atributes
  terminalText: string[];
  logText: string[];

  // Events atributes
  eventData: EventData;
  doubleEventChance: number;
  eventsEnabled: number[];

  // Map sections
  mapArea: Section[];
}

// Game updater type
type GameUpdater = (patch: UpdaterPatch<GameData>) => void;