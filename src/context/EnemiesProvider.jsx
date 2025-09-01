// Data
import enemiesJson from '../data/enemies.json' with { type: 'json' };

// Dependencies
import { createContext, useContext, useRef } from "react";
import * as Entities from '../utils/entities.js';


const EnemiesContext = createContext();  // Creating provider



export function EnemiesProvider({ children }) {
  const enemies = useRef([])

  const get = (id = null) => (id !== null) ? enemies.current[id] : enemies.current;

  const spawnEnemies = (enemiesData) => {
    enemiesData.map((enemyData, index) => {
      const newEnemy = enemyData
      newEnemy.id = index
      enemies.current = [...enemies.current, new Entities[newEnemy.name](newEnemy)];  // gets the correct class from the enemy name
    });
  }

  const reset = () => enemies.current = [];

  const loadSave = (enemies) => {
    spawnEnemies(enemies)
  }

  return (
    <EnemiesContext.Provider value={{ get, spawnEnemies, loadSave, reset }}>
      {children}
    </EnemiesContext.Provider>
  );
}

export const useEnemies = () => useContext(EnemiesContext);