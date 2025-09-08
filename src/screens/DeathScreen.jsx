// Dependencies
import { Link } from 'react-router-dom';

// Hooks
import { useGame } from '../hooks/useGame';

// Stylesheet
import styles from './DeathScreen.module.css';



function DeathScreen() {
  const { tick, game, player } = useGame();

  function tickToTime() {
    const ticks = tick.get()
    const tickSpeed = game.get().tickSpeed
    const ticksPerSecond = 1000 / tickSpeed;

    const seconds = Math.floor(ticks / ticksPerSecond);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    return `${padZero(hours % 60)}h ${padZero(minutes % 60)}m ${padZero(seconds % 60)}s`
  }

  function padZero(number) {
    return (number < 10 ? "0" : "") + number
  }

  return (
    <main className={styles.deathScreenContainer}>
      <div className={styles.statsContainer}>
        <h1>You Died</h1>
        <p>Run Time: {tickToTime()}</p>
        <p>Enemies Killed: {player.get().kills || 0}</p>
      </div>
      <Link to="/menu">
        <button className={`${styles.returnBtn} default`}>Return to Menu</button>
      </Link>
    </main>
  );
}

export default DeathScreen;
