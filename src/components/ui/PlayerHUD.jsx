// Dependencies
import { useState, useEffect } from 'react';

// Components
import ComponentBorder from './ComponentBorder.jsx';

// Hooks
import { useGame } from '../../hooks/useGame';

// Stylesheets
import styles from './PlayerHUD.module.css';

function PlayerHUD() {
  const { player, game } = useGame();

  const [healthPercent, setHealthPercent] = useState(100);
  const [manaPercent, setManaPercent] = useState(100);

  useEffect(() => {
    setHealthPercent(calcPercent(player.get().stats.health, player.get().stats.maxHealth));
  }, [player.get().stats.health]);

  useEffect(() => {
    setManaPercent(calcPercent(player.get().stats.mana, player.get().stats.maxMana));
  }, [player.get().stats.mana]);

  const calcPercent = (hp, maxHp) => (hp / maxHp) * 100;
  
  return (
    <>
      {/* BARS */}
      <div className={styles.barContainer}>
        {/* HEALTH BAR */}
        <ComponentBorder
          title={`HP: ${player.get().stats.health}/${player.get().stats.maxHealth}`}
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
          title={`MN: ${player.get().stats.mana}/${player.get().stats.maxMana}`}
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
        Actions: {player.get().actionsLeft}
      </div>
    </>
  );
}

export default PlayerHUD;
