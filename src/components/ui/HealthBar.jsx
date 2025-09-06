// Dependencies
import { useEffect, useState } from "react";

// Hooks
import { useGame } from '../../hooks/useGame.js';

// Stylesheets
import styles from './HealthBar.module.css';



function HealthBar({ entityId }) {
  const { enemies } = useGame();
  const entity = enemies.get(entityId);

  const [healthPercent, setHealthPercent] = useState(100);

  useEffect(() => {
    setHealthPercent(calcPercent(entity.stats.health, entity.stats.maxHealth));
  }, [entity.stats.health]);

  const calcPercent = (hp, maxHp) => (hp / maxHp) * 100;

  return (
    <div className={styles["bar-container"]}>
      <div className={styles["bar-bg"]}>
        <p>{entity.stats.health}/{entity.stats.maxHealth}</p>
        <div
          className={`${styles["hp"]} ${styles["fill"]}`}
          style={{
            width: `${healthPercent}%`
          }}
        />
      </div>
    </div>
  );
};

export default HealthBar;