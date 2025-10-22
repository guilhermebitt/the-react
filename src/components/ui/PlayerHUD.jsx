// Dependencies
import { useState, useEffect } from 'react';

// Components
import ComponentBorder from './ComponentBorder.jsx';

// Hooks
import { useGame } from '../../hooks/useGame';
import { useStore } from '@/stores/';

// Stylesheets
import styles from './PlayerHUD.module.css';

function PlayerHUD() {
  const { game } = useGame();

  const [healthPercent, setHealthPercent] = useState(100);
  const [manaPercent, setManaPercent] = useState(100);

  // Stores
  const player = useStore("player", s => ({
    maxHealth: s.player.stats.maxHealth,
    health: s.player.stats.health,
    maxMana: s.player.stats.maxMana,
    mana: s.player.stats.mana,
    actionsLeft: s.player.actionsLeft
  }))

  useEffect(() => {
    setHealthPercent(calcPercent(player.health, player.maxHealth));
  }, [player.health]);

  useEffect(() => {
    setManaPercent(calcPercent(player.mana, player.maxMana));
  }, [player.mana]);

  const calcPercent = (hp, maxHp) => (hp / maxHp) * 100;
  
  return (
    <>
      {/* BARS */}
      <div className={styles.barContainer}>
        {/* HEALTH BAR */}
        <ComponentBorder
          title={`HP: ${player.health}/${player.maxHealth}`}
          borderStyles={{ borderColor: 'red', padding: '5px' }}
          titleStyles={{ borderColor: 'red', padding: '0 5px', fontSize: "0.75rem", height: "0.75rem", width: "70px" }}
          boxStyles={{ color: 'red', marginTop: "0.75rem", width: "150px" }}
        >
          <div className={styles.hpContainer} style={{width: healthPercent + "%"}}>
            <div className={`${styles.hpBar} ${healthPercent <= 20 ? styles.low : ""}`}></div>
          </div>
        </ComponentBorder>

        {/* MANA BAR */}
        <ComponentBorder
          title={`MN: ${player.mana}/${player.maxMana}`}
          borderStyles={{ borderColor: 'aqua', padding: '5px' }}
          titleStyles={{ borderColor: 'aqua', padding: '0 5px', fontSize: "0.75rem", height: "0.75rem", width: "70px" }}
          boxStyles={{ color: 'aqua', marginTop: "0.75rem", width: "100px" }}
        >
          <div className={styles.mnContainer} style={{width: manaPercent + "%"}}>
            <div className={styles.mnBar}></div>
          </div>
        </ComponentBorder>
      </div>

      {/* TURN TITLE */}
      <div className={styles.turnContainer}>
        {game.get().currentTurn === "player" || game.get().currentTurn === "onAction" ? "Your Turn" : "Enemies Turn"}
      </div>

      {/* ACTIONS LEFT */}
      <div className={styles.actionsContainer}>
        Actions: {player.actionsLeft}
      </div>
    </>
  );
}

export default PlayerHUD;
