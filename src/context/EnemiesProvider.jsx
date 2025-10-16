// Dependencies
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { deepUpdate } from '../utils/stateUpdater';
import * as Entities from '../utils/entities';
import { produce } from 'immer';

const EnemiesContext = createContext();

export function EnemiesProvider({ children }) {
  const [enemies, setEnemies] = useState([]);

  // Functions to manipulate the game state:
  const controls = {
    get: (id = null) => (id !== null ? enemies[id - 1] : enemies),

    /**
     * Updates a specific enemy at index with the given patch.
     * Patch can use dot notation and updater functions just like in createUpdater.
     *
     * @param {number} index - Index of the enemy in the array.
     * @param {Object} patch - Object of key/value pairs or updater functions.
     */
    update: (index, patch) => {
      setEnemies((prev) =>
        produce(prev, (draft) => {
          const target = draft[index];
          if (!target) return;

          for (const key in patch) {
            deepUpdate(target, key, patch[key]);
          }
        })
      );
    },

    // Resets the game data
    reset: () => setEnemies([]),

    // Loads the data from save to the game context
    loadSave: (savedEnemies) => spawnLogic.spawnEnemies(savedEnemies),
  };

  // Logic of the enemy spawn
  const spawnLogic = {
    spawnEnemies: (enemiesData) => {
      setEnemies((prev) => {
        const newEnemies = [...prev];
        enemiesData.forEach((enemyData, index) => {
          const newEnemy = new Entities[enemyData.className]({
            ...enemyData,
            id: index + 1,
            update: (patch) => controls.update(index, patch),
          });
          newEnemies.push(newEnemy);
        });
        return newEnemies;
      });
    },
  };

  // Joining the all the function to one object
  const functions = {...controls, ...spawnLogic};

  return (
    <EnemiesContext.Provider value={functions}>{children}</EnemiesContext.Provider>
  );
}

export const useEnemies = () => useContext(EnemiesContext);
