// Dependencies
import { useEffect, useState, memo } from 'react';

// Hooks
import { useStore } from '@/stores';

// Stylesheets
import styles from './bars.module.css';

function HealthBar({ entityId }) {
  const [transition, setTransition] = useState(null);

  const entity =
    entityId === 0 ?
      useStore("player", s => s.player.stats) :
      useStore("enemies", s => s.enemies[entityId - 1].stats)

  const [healthPercent, setHealthPercent] = useState(100);

  useEffect(() => setTransition(true), []);

  useEffect(() => {
    setHealthPercent(calcPercent(entity.health, entity.maxHealth));
  }, [entity.health]);

  const calcPercent = (hp, maxHp) => (hp / maxHp) * 100;

  return (
    <div className={styles['bar-container']}>
      <div className={`${styles['bar-bg']} ${styles['hp']}`}>
        <p>
          HP: {entity.health}/{entity.maxHealth}
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

export default memo(HealthBar);
