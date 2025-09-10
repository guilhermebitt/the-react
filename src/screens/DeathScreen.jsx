// Dependencies
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import * as funcs from '../utils/functions.js';

// Components
import ValueIncrement from '../components/ui/ValueIncrement.jsx';

// Hooks
import { useGame } from '../hooks/useGame';

// Stylesheet
import styles from './DeathScreen.module.css';



function DeathScreen() {
  const { tick, player } = useGame();
  const [finished, setFinished] = useState(false);
  const [timeForEach] = useState(1000)  // Time in MS to determine the time for each stat
  const [infoId, setInfoId] = useState(0);

  useEffect(() => {
    // Changes the id after the time pass
    let times = 0;
    const interval = setInterval(() => {
      setInfoId(prev => prev + 1)
      times++;
      if (times >= 2) clearInterval(interval);
    }, timeForEach);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (infoId >= 2) setFinished(true);
  }, [infoId]);

  return (
    <main className={styles.deathScreenContainer}>
      <div className={styles.statsContainer}>
        <h1>You Died</h1>
        {/* EVENT TIME */}
          {(infoId ?? 0) >= 0 && (
            <p
              style={{
                visibility: (infoId ?? 0) >= 0 ? 'visible' : 'hidden',
              }}
            >
              Event Duration: {<ValueIncrement finalValue={tick.get()} duration={timeForEach} type={"time"}/>}
            </p>
          )}
          {/* ENEMIES KILLED */}
          {infoId >= 1 && (
            <p
              style={{
                visibility: infoId >= 1 ? 'visible' : 'hidden',
              }}
            >
              Enemies Killed: {<ValueIncrement finalValue={player.get().kills} duration={timeForEach}/>}
            </p>
          )}
      </div>
      <Link to="/menu">
        <button disabled={finished ? false : true} className={`${styles.returnBtn} default`}>Return to Menu</button>
      </Link>
    </main>
  );
}

export default DeathScreen;
