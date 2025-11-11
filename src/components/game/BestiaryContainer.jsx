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

function BestiaryContainer() {
  // Stores
  const game = useStore("game", "actions")
  const [selectedEnemy, setSelectedEnemy] = useState(enemiesJson.snake);
  const [, setSettings] = useLocalStorage('settings');
  const [enemies, setEnemies] = useLocalStorage("enemies", enemiesJson);

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
          <button className={styles.close} onClick={closeBestiary}>
            <FontAwesomeIcon 
              id={styles["music-icon"]} 
              icon={faXmark}
            />
          </button>
        
          <div className={styles.innerBestiaryContainer}>
            <div className={`${styles.textContainer} scrollbar-black`}>
              {Object.entries(enemiesJson)
              .slice(2) // skip first two entries who aren't enemies
              //.filter(([key, n]) => n.isDiscovered === true) Leaving this here for later, (to filter only discovered enemies)
              .map(([key, n]) => (
              <div key={key} style={{ backgroundImage: `url(${n.img})` }} className={`${styles.enemyImages}`} onClick={() => selectBestiary(n)}/>
              ))}
            </div>

            <div className={`${styles.selectedContainer} scrollbar-black`}>

              <div className={`${styles.textContainer} ${styles.statsContainer} scrollbar-black`}>
                <div style={{ backgroundImage: `url(${selectedEnemy.img})` }} className={`${styles.selectedImage}`}/>
              </div>

              <div className={`${styles.textContainer} ${styles.statsContainer} scrollbar-black`}>
                
                <h1 style={{ color: selectedEnemy.isBoss === true ? "red" : "white"}}>{`${selectedEnemy.name}`}</h1>
                <div className={`${styles.innerStatsContainer}`}>
                  <h3> HP  <span>{`${selectedEnemy.stats.maxHealth}`}</span></h3>
                  <h3> XP  <span>{`${selectedEnemy.loot.xp}`.replace(","," ~ ")}</span></h3>
                  <h3> STR <span>{`${selectedEnemy.stats.strength}`}</span></h3>
                  <h3> ATK <span>{`${selectedEnemy.stats.attack}`}</span></h3>
                  <h3> CON <span>{`${selectedEnemy.stats.constitution}`}</span></h3>
                  <h3> DEF <span>{`${selectedEnemy.stats.defense}`}</span></h3>
                  <h3> ACC <span>{`${selectedEnemy.stats.accuracy}`}</span></h3>
                  <h3> EVA <span>{`${selectedEnemy.stats.evasion}`}</span></h3>
                </div>

              </div>

            </div>

          </div>

        </div>

      </ComponentBorder>
    </div>
  );
}

export default BestiaryContainer;
