// Data
import gameData from '../data/game.json' with { type: 'json' };

// Dependencies
import { Link } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';
import { clearStorage } from '../utils/functions';

// Stylesheet
import styles from './menus.module.css';

function Menu() {
  const [currentTurn, setCurrentTurn] = useLocalStorage('currentTurn', gameData.currentTurn);

  const handlePlay = () => currentTurn === "none" && setCurrentTurn('player');
  const keysToKeep = ['lastScreen', 'settings'];  // these keys won't be removed

  return (
    <main className={styles['menus']}>
      <section>
        <h1>The</h1>
        <Link to="/game">
          <button className={styles['menus']} onClick={handlePlay}>Play</button>
        </Link>
        <Link to="/settings">
          <button className={styles['menus']} >Settings</button>
        </Link>
        <button className={`${styles['menus']} ${styles['clear']}`} onClick={() => clearStorage(keysToKeep)}>Clear all data (temporary)</button>
      </section>
      
    </main>
  );
}

export default Menu;
