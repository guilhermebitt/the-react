// Dependencies
import { createContext, useContext, useState } from 'react';
import { deepUpdate } from '../utils/stateUpdater.js';
import * as Entities from '../utils/entities.js';
import { produce } from 'immer';

const EnemiesContext = createContext();

export function EnemiesProvider({ children }) {
  const [enemies, setEnemies] = useState([]);

  /**
   * Updates a specific enemy at index with the given patch.
   * Patch can use dot notation and updater functions just like in createUpdater.
   *
   * @param {number} index - Index of the enemy in the array.
   * @param {Object} patch - Object of key/value pairs or updater functions.
   */
  const update = (index, patch) => {
    setEnemies((prev) =>
      produce(prev, (draft) => {
        const target = draft[index];
        if (!target) return;

        for (const key in patch) {
          deepUpdate(target, key, patch[key]);
        }
      })
    );
  };

  const spawnEnemies = (enemiesData) => {
    setEnemies((prev) => {
      const newEnemies = [...prev];
      enemiesData.forEach((enemyData, index) => {
        const newEnemy = new Entities[enemyData.name]({
          ...enemyData,
          id: index,
          update: (patch) => update(index, patch),
        });
        newEnemies.push(newEnemy);
      });
      return newEnemies;
    });
  };

  const get = (id = null) => (id !== null ? enemies[id] : enemies);

  const reset = () => setEnemies([]);

  const loadSave = (savedEnemies) => spawnEnemies(savedEnemies);

  return (
    <EnemiesContext.Provider
      value={{ get, spawnEnemies, update, loadSave, reset }}
    >
      {children}
    </EnemiesContext.Provider>
  );
}

export const useEnemies = () => useContext(EnemiesContext);
