// Dependencies
import { Link } from 'react-router-dom';
import * as funcs from '../utils/functions.js';

// Hooks
import { useGame } from '../hooks/useGame';

// Stylesheet
import styles from './DeathScreen.module.css';



function DeathScreen() {
  const { tick, game, player } = useGame();

  function getTime() {
    return funcs.tickToTime(tick.get(), game.get().tickSpeed)
  }

  return (
    <main className={styles.deathScreenContainer}>
      <div className={styles.statsContainer}>
        <h1>You Died</h1>
        <p>Game Time: {getTime()}</p>
        <p>Enemies Killed: {player.get().kills || 0}</p>
      </div>
      <Link to="/menu">
        <button className={`${styles.returnBtn} default`}>Return to Menu</button>
      </Link>
    </main>
  );
}

export default DeathScreen;
