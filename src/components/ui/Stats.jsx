// Components
import ComponentBorder from "../ui/ComponentBorder";
import { memo } from "react";

// Store
import { useStore } from "@/stores";

// Stylesheets
import styles from "./Stats.module.css";

function Stats() {
  const stats = useStore("player", (s) => s.player.stats);

  return (
    <ComponentBorder title="Stats">
      <div className={styles.statsContainer}>
        <div className={styles.statHolder}>
          <img src="/assets/hud/sword.png" alt="" />
          Atk: <span>{stats?.minAttack} - {stats?.maxAttack}</span>
        </div>
        <div className={styles.statHolder}>
          <img src="/assets/hud/crit.png" alt="" />
          Crit: <span>{stats?.critChance}%</span>
          Mult: <span>{stats?.crit}</span>
        </div>
        <div className={styles.statHolder}>
          <img src="/assets/hud/shield.png" alt="" />
          Def: <span>{stats?.minDefense} - {stats?.maxDefense}</span>
        </div>
        <div className={styles.statHolder}>
          <img src="/assets/hud/stamina.png" alt="" />
          Acc: <span>{stats?.accuracy}%</span>
          Eva: <span>{stats?.evasion}%</span>
        </div>
        <div className={styles.statHolder}>
          <img src="/assets/hud/coin.png" alt="" />
          Money: <span>{stats?.money}</span>
        </div>
      </div>
    </ComponentBorder>
  );
}

export default memo(Stats);
