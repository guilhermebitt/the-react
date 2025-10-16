// Dependencies
import { useEffect, useState } from "react";

// Hooks
import { useGame } from '../../hooks/useGame';

// Stylesheets
import styles from './bars.module.css';



function ExperienceBar() {
  const { player } = useGame();

  const [XPPercent, setXPPercent] = useState(100);

  useEffect(() => {
    setXPPercent(calcPercent(player.get().xp, player.get().getNextLvXP())), 100;
  }, [player.get().xp, player.get().getNextLvXP()]);

  const calcPercent = (xp, xpToLvl) => Math.min((xp / xpToLvl) * 100, 100);

  return (
    <div className={styles["bar-container"]}>
      <div className={`${styles["bar-bg"]} ${styles["xp"]}`}>
        <div
          className={`${styles["xp"]} ${styles["fill"]}`}
          style={{
            width: `${XPPercent}%`
          }}
        />
      </div>
    </div>
  );
};

export default ExperienceBar;