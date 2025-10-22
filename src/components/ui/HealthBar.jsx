// Dependencies
import { useEffect, useState } from 'react';

// Hooks
import { useStore } from '@/stores';

// Stylesheets
import styles from './bars.module.css';

function HealthBar({ entityId }) {
  const [transition, setTransition] = useState(null);
  const enemiesActions = useStore("enemies", "actions");

  const entity = enemiesActions.getCurrent(entityId);

  const [healthPercent, setHealthPercent] = useState(100);

  useEffect(() => setTransition(true), []);

  useEffect(() => {
    setHealthPercent(calcPercent(entity.stats.health, entity.stats.maxHealth));
  }, [entity.stats.health]);

  const calcPercent = (hp, maxHp) => (hp / maxHp) * 100;

  return (
    <div className={styles['bar-container']}>
      <div className={`${styles['bar-bg']} ${styles['hp']}`}>
        <p>
          HP: {entity.stats.health}/{entity.stats.maxHealth}
        </p>
        <div
          className={`${styles['hp']} ${styles['fill']} ${
            transition && styles['transition']
          }`}
          style={{
            width: `${healthPercent}%`,
          }}
        />
      </div>
    </div>
  );
}

export default HealthBar;
