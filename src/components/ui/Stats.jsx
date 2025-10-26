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
          Str: <span>{stats?.strength}</span>
          Atk: <span>{stats?.attack}</span>
        </div>
        <div className={styles.statHolder}>
          <img src="/assets/hud/shield.png" alt="" />
          Con: <span>{stats?.constitution}</span>
          Def: <span>{stats?.defense}</span>
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
