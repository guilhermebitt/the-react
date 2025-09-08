// Data
import gameData from '../data/game.json' with { type: 'json' };

// Dependencies
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';
import { clearStorage } from '../utils/functions';

// Components
import Changelog from '../components/common/Changelog.jsx';

// Hooks
import { useGame } from '../hooks/useGame.js';

// Stylesheet
import styles from './menus.module.css';


function Menu() {
  const [currentTurn, setCurrentTurn] = useLocalStorage('currentTurn', gameData.currentTurn);
  const { audios } = useGame();

  useEffect(() => {
    // Stop the music on menu
    if (audios.get("gameMusic")?.isPlaying()) audios.get("gameMusic")?.stop()
    if (audios.get("deathMusic")?.isPlaying()) audios.get("deathMusic")?.stop()
    
    return () => resetGame(keysToKeep);
  }, []);

  const handlePlay = () => currentTurn === "none" && setCurrentTurn('player');
  const keysToKeep = ['lastScreen', 'settings', 'saves'];  // these keys won't be removed

  const resetGame = (keysToKeep) => {
    // Cleaning the local storage
    clearStorage(keysToKeep);
  }

  return (
    <main className={styles['menus']}>
      <section>
        <h1>The</h1>
        <Link to="/saves">
          <button className={styles['menus']} onClick={handlePlay}>Play</button>
        </Link>
        <Link to="/settings">
          <button className={styles['menus']} >Settings</button>
        </Link>
        {/* <button className={`${styles['menus']} ${styles['clear']}`} onClick={() => resetGame(keysToKeep)}>Clear all data</button>*/}
      </section>
      <Changelog />
      
    </main>
  );
}

export default Menu;
