// Data
import enemiesJson from '../data/enemies.json' with { type: 'json' };

// Dependencies
import { createContext, useContext, useState } from "react";
import * as Entities from '../utils/entities.js';


const EnemiesContext = createContext();  // Creating provider



export function EnemiesProvider({ children }) {
  const [enemies, setEnemies] = useState([]);

  const spawnEnemies = (enemiesData) => {
    setEnemies(enemiesData.map((enemyData, index) => {
      const newEnemy = enemyData
      newEnemy.id = index
      return new Entities[newEnemy.name](newEnemy);  // gets the correct class from the enemy name
    }));
  }

  const updateEnemy = (id, partial) => {
    setEnemies(
      produce(draft => {
        const enemy = draft.find(e => e.id === id);
        if (enemy) Object.assign(enemy, partial);
      })
    );
  };

  const removeEnemy = (id) => {
    setEnemies(
      produce(draft => {
        const index = draft.findIndex(e => e.id === id);
        if (index !== -1) draft.splice(index, 1);
      })
    );
  };

  const addEnemy = (enemyData) => {
    setEnemies(
      produce(draft => {
        if (draft.length < 3) {
          const newEnemy = { ...enemyData, id: draft.length };
          draft.push(new Entities[newEnemy.name](newEnemy));
        }
      })
    );
  };

  const get = (id = null) => (id !== null) ? enemies[id] : enemies;

  const reset = () => setEnemies([]);

  return (
    <EnemiesContext.Provider value={{ get, updateEnemy, removeEnemy, addEnemy, spawnEnemies, reset }}>
      {children}
    </EnemiesContext.Provider>
  );
}

export const useEnemies = () => useContext(EnemiesContext);