// Dependencies
import { useEffect, useState } from "react";

// Stylesheets
import styles from './Stats.module.css';



function HealthBar({entity}) {

  const [healthPercent, setHealthPercent] = useState(100);

  useEffect(() => {
    setHealthPercent(calcPercent(entity?.stats?.health, entity?.stats?.maxHealth));
  }, [entity?.stats.health]);

  const calcPercent = (hp, maxHp) => (hp / maxHp) * 100;

  return (
    <div className={styles["bar-container"]}>
      <div className={styles["bar-bg"]}>
        <p>{entity?.stats?.health}/{entity?.stats?.maxHealth}</p>
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