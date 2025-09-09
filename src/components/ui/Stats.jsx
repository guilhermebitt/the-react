// Components
import ComponentBorder from '../ui/ComponentBorder';

// Stylesheets
import styles from './Stats.module.css';



function Stats({entity}) {
  return (
      <ComponentBorder title='Stats'>
        <div className={styles.statsContainer}>
          <div className={styles.statHolder}>
            <img src="/assets/hud/sword.png" alt="" />
            Str: <span>{entity?.stats?.strength}</span>
            Atk: <span>{entity?.stats?.attack}</span>
          </div>
          <div className={styles.statHolder}>
            <img src="/assets/hud/shield.png" alt="" />
            Con: <span>{entity?.stats?.constitution}</span>
            Def: <span>{entity?.stats?.defense}</span>
          </div>
          <div className={styles.statHolder}>
            <img src="/assets/hud/coin.png" alt="" />
            Money: <span>{entity?.stats?.money}</span>
          </div>
        </div>
      </ComponentBorder>
  );
};

export default Stats;