// Dependencies
import { useEffect, useState } from "react";

// Hooks
import { useStore } from "@/stores";

// Stylesheets
import styles from './bars.module.css';



function ExperienceBar() {
  const [XPPercent, setXPPercent] = useState(100);
  // Store
  const playerXP = useStore("player", s => s.player.xp);
  const playerActions = useStore("player", "instanceActions");

  useEffect(() => {
    setXPPercent(calcPercent(playerXP, playerActions.getNextLvXP())), 100;
  }, [playerXP, playerActions.getNextLvXP()]);

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