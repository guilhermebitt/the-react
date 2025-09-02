// Dependencies
import { createContext, useContext, useState } from "react";
import * as Entities from '../utils/entities.js';

const EnemiesContext = createContext();

export function EnemiesProvider({ children }) {
  const [enemies, setEnemies] = useState([]);

  const update = (index, patch) => {
    setEnemies(prevEnemies => {
      const updated = [...prevEnemies];
      const target = updated[index];
      if (!target) return prevEnemies;
      
      for (const key in patch) {
        const value = patch[key];
        const keys = key.split(".");
        let current = target;
        keys.slice(0, -1).forEach(k => current = current[k]);
        current[keys[keys.length - 1]] = 
          typeof value === "function" ? value(target) : value;
      }

      return updated;
    });
  };

  const spawnEnemies = (enemiesData) => {
    setEnemies(prev => {
      const newEnemies = [...prev];
      enemiesData.forEach((enemyData, index) => {
        const newEnemy = new Entities[enemyData.name]({
          ...enemyData,
          id: index,
          update: (patch) => update(index, patch)
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
    <EnemiesContext.Provider value={{ get, spawnEnemies, update, loadSave, reset }}>
      {children}
    </EnemiesContext.Provider>
  );
}

export const useEnemies = () => useContext(EnemiesContext);