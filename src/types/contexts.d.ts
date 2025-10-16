// Getting classes, interfaces and types
import { PlayerData, EnemyData, UpdaterPatch } from "@/types";
import { Enemy } from "@/utils/entities";

// Player context interface
export interface PlayerContext {
  get: () => PlayerData;
  update: (patch: UpdaterPatch<PlayerData>) => void;
  reset: () => void;
  loadSave: (savedData: PlayerData) => void;
}

// Enemy context interface
export interface EnemyContext {
  get: (id?: number) => (Enemy | Enemy[]);
  update: (index: number, patch: UpdaterPatch<EnemyData>) => void;
  reset: () => void;
  loadSave: (savedData: Enemy[]) => void;
}