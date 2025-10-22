// Importing dependencies
import { create } from "zustand";
import { EnemyData, EntityIds, UpdaterPatch } from "@/types";
import { deepUpdate } from "@/utils/stateUpdater";
import * as Entities from "../utils/entities";
import { Entity, Enemy } from "@/utils/entities";
import { produce } from "immer";

// State type
type EnemiesStoreState = {
  enemies: Enemy[];
};
// Action type
type EnemiesStoreAction = {
  update: (id: EntityIds, patch: UpdaterPatch<Enemy>) => void;
  getCurrent: (id?: EntityIds) => Enemy | Enemy[];
  reset: () => void;
  loadSave: (savedEnemies: EnemyData[]) => void;
  spawnEnemies: (enemiesData: EnemyData[]) => void;
};
// Store type
type EnemiesStore = EnemiesStoreState & EnemiesStoreAction;

// Tick store hook
export const useEnemiesStore = create<EnemiesStore>((set, get) => {
  // Enemies array
  const enemies: Enemy[] = [];

  /**
   * Updates a specific enemy at index with the given patch.
   * Patch can use dot notation and updater functions just like in createUpdater.
   *
   * @param {number} id - Index of the enemy in the array.
   * @param {Object} patch - Object of key/value pairs or updater functions.
   */
  const update = (id: EntityIds, patch: UpdaterPatch<Enemy>) => {
    set((state) => ({
      enemies: produce(state.enemies, (draft) => {
        const target = draft[id - 1]; // The minus one is because the id "0" is for the player, but the array index 0 has a enemy too
        if (!target) return;

        for (const key in patch) {
          deepUpdate(target, key, patch[key as keyof UpdaterPatch<Enemy>]);
        }
      }),
    }));
  };

  // Returning the actual state of the enemies array without re-rendering
  const getCurrent = (id?: EntityIds) => (typeof id === "number" ? get().enemies[id - 1] : get().enemies);

  // Resetting the array of enemies state
  const reset = () => set({ enemies: [] });

  // Loads the data from the game save
  const loadSave = (savedEnemies: EnemyData[]) => spawnEnemies(savedEnemies);

  // Logic to spawn the enemies and set their setters
  const spawnEnemies = (enemiesData: EnemyData[]) => {
    set((state) => {
      const newEnemies = [...state.enemies];
      enemiesData.forEach((enemyData, index) => {
        const newEnemy = new (Entities as { [key: string]: typeof Entity })[enemyData.className](
          {
            ...enemyData,
            id: index + 1,
          },
          (patch: UpdaterPatch<Enemy>) => update(index + 1, patch)
        );
        newEnemies.push(newEnemy as Enemy);
      });
      return { enemies: newEnemies };
    });
  };

  // Returning the complete state
  return {
    enemies,
    update,
    getCurrent,
    reset,
    loadSave,
    spawnEnemies,
  };
});
