// Data
import enemiesJson from '../data/enemies.json' with { type: 'json' };

// Dependencies
import { createContext, useContext, useRef } from "react";
import * as Entities from '../utils/entities.js';


const EnemiesContext = createContext();  // Creating provider



export function EnemiesProvider({ children }) {
  const enemiesRef = useRef([]);

  const spawnEnemies = (enemiesData) => {
    enemiesRef.current = enemiesData.map((enemyData, index) => {
      const newEnemy = enemyData
      newEnemy.id = index
      return new Entities[newEnemy.name](newEnemy);  // gets the correct class from the enemy name
    });
  }

  const get = () => {
    const enemies = enemiesRef.current
    return enemies
  }

  return (
    <EnemiesContext.Provider value={{ get, spawnEnemies }}>
      {children}
    </EnemiesContext.Provider>
  );
}

export const useEnemies = () => useContext(EnemiesContext);