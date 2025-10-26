// Dependencies
import { useEffect, useState, memo } from "react";

// Hooks
import { useStore } from "@/stores";

// Stylesheets
import styles from "./bars.module.css";

function ExperienceBar() {
  const [XPPercent, setXPPercent] = useState(100);
  // Store
  const playerXP = useStore("player", (s) => s.player.xp);
  const playerLevel = useStore("player", (s) => s.player.level);
  const playerActions = useStore("player", "instanceActions");

  useEffect(() => {
    const prevLevelXP = playerActions.getNextLvXP(playerLevel - 1);
    const nextLevelXP = playerActions.getNextLvXP();
    const xpToNextLevel = nextLevelXP - prevLevelXP;
    const currentXP = playerXP - prevLevelXP;

    setXPPercent(calcPercent(currentXP, xpToNextLevel));

    // Debugging
    console.log(
      "Experience Bar |",
      "Percent:", calcPercent(currentXP, xpToNextLevel),
      "Current:", currentXP,
      "ToNext:", xpToNextLevel
    );
  }, [playerXP, playerLevel]);

  const calcPercent = (xp, xpToLvl) => Math.floor(Math.min((xp / xpToLvl) * 100, 100));

  return (
    <div className={styles["bar-container"]}>
      <div className={`${styles["bar-bg"]} ${styles["xp"]}`}>
        <div
          className={`${styles["xp"]} ${styles["fill"]}`}
          style={{
            width: `${XPPercent}%`,
          }}
        />
      </div>
    </div>
  );
}

export default memo(ExperienceBar);
