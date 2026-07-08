// JSON
import enemiesJson from "../../data/enemies.json";

// Dependencies
import { useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { produce } from 'immer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMousePointer, faXmark } from '@fortawesome/free-solid-svg-icons';

// Components
import ComponentBorder from '../ui/ComponentBorder';

// Hooks
import { useStore } from '@/stores';

// Stylesheets
import styles from './BestiaryContainer.module.css';
import '../../assets/css/scrollbar.css';
import { Enemy } from "@/utils/entities";
import Terminal from "./Terminal";

function BestiaryContainer() {
  // Stores
  const game = useStore("game", "actions")
  const bestiary = useStore("bestiary", "actions");
  const [selectedEnemy, setSelectedEnemy] = useState(enemiesJson.null);
  const [, setSettings] = useLocalStorage('settings');

  const discovered = bestiary.getCurrent() || {};
  const [level, setLevel] = useState(1);

  const GROWTH_RATE = 1.25;
  const scaleStat = (base) =>
  Math.floor(base * (1 + (level - 1) * (GROWTH_RATE - 1)));

        // Stat = default * const(1.5) * level - 1
        // Exemple:
        // snake lv 1 => health = 8
        // snake lv 2 => health = 12
        //maxHealth: Math.floor(BASE_HEALTH * (1 + (level - 1) * (GROWTH_RATE - 1)))

  function closeBestiary() {
    setSettings(
      produce((draft) => {
        draft.showBestiary = false;
      })
    );
  }

  function selectBestiary(enemy) {
    setSelectedEnemy(enemy);
  }

  function checkLevel(e) {
    setLevel(Number(e.target.value));
  }

  return (
    <div className="backdrop">
      <ComponentBorder
        title="Bestiary"
        boxStyles={{
          height: 'fit-content',
          width: '700px',
          backgroundColor: 'black',
        }}
        titleStyles={{ backgroundColor: 'black' }}
      >
        <div className={styles.bestiaryContainer}>
          <div className={styles.bestiaryOptions}>
            <button className={styles.close} onClick={closeBestiary}>
            <FontAwesomeIcon 
              id={styles["music-icon"]} 
              icon={faXmark}
            />
            </button>
            <div></div>
            <input type="number" className={styles.input} min={1} max={99} value={level} onChange={checkLevel}></input>
            <h1>LV:</h1>
          </div>
        
          <div className={styles.innerBestiaryContainer}>
            <div className={`${styles.textContainer} scrollbar-black`}>
              {Object.entries(enemiesJson)
              .filter(([key,n]) => discovered[n.className]) // to filter only discovered enemies using bestiary store
              .map(([key, n]) => (
              <div key={key} style={{ backgroundImage: `url(${n.img})`, "--cols": n.animations.columns, "--rows": n.animations.rows }} className={`${styles.enemyImages}`} onClick={() => selectBestiary(n)}/>
              ))}
            </div>

            <div className={`${styles.selectedContainer} scrollbar-black`}>

              <div className={`${styles.textContainer} ${styles.statsContainer} scrollbar-black`}>
                <div style={selectedEnemy.name != '‎' ? { backgroundImage: `url(${selectedEnemy.img})`, "--cols": selectedEnemy.animations.columns, "--rows": selectedEnemy.animations.rows } : { backgroundColor: 'black' }} className={`${styles.selectedImage}`}/>
              </div>

              <div className={`${styles.textContainer} ${styles.statsContainer} scrollbar-black`}>
                
                <h1 style={{ color: selectedEnemy.isBoss === true ? "red" : "white"}}>{`${selectedEnemy.name}`}</h1>
                <div className={`${styles.innerStatsContainer}`} style={selectedEnemy.name != '‎' ? { display: `flex` } : { display: 'none' }}>
                  <h3> HP  </h3><span>{`${scaleStat(selectedEnemy.stats.maxHealth)}`}</span>
                  <h3> XP  </h3><span>{`${scaleStat(selectedEnemy.loot.xp[0])} ~ ${scaleStat(selectedEnemy.loot.xp[1])}`}</span>
                  <h3> ATK </h3><span>{`${scaleStat(selectedEnemy.stats.minAttack)} ~ ${scaleStat(selectedEnemy.stats.maxAttack)}`}</span>
                  <h3> DEF </h3><span>{`${scaleStat(selectedEnemy.stats.minDefense)} ~ ${scaleStat(selectedEnemy.stats.maxDefense)}`}</span>
                  <h3> ACC </h3><span>{`${selectedEnemy.stats.accuracy}`}</span>
                  <h3> EVA </h3><span>{`${selectedEnemy.stats.evasion}`}</span>
                  <h3> CCH </h3><span>{`${selectedEnemy.stats.critChance}`}</span>
                  <h3> CRT </h3><span>{`${selectedEnemy.stats.crit}`}</span>
                </div>
                <a>{`${selectedEnemy.flavorText != undefined ? selectedEnemy.flavorText : ""}`}</a>

              </div>

            </div>

          </div>

        </div>

      </ComponentBorder>
    </div>
  );
}

export default BestiaryContainer;
