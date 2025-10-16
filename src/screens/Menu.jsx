// Data
import settingsData from '../data/settings.json' with { type: 'json' };

// Dependencies
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';
import { clearStorage } from '../utils/functions';

// Components
import Changelog from '../components/common/Changelog';

// Hooks
import { useGame } from '../hooks/useGame';
import { useSaveManager } from '../hooks/useSaveManager';

// Stylesheet
import styles from './menus.module.css';

function Menu() {
  const [settings, setSettings] = useLocalStorage('settings', settingsData);
  const { audios } = useGame();
  const { resetGame } = useSaveManager();

  useEffect(() => {
    // Resets the game contexts
    resetGame();

    // Closes the log (if open)
    if (settings?.showLog) setSettings(prev => {return{...prev, showLog: false}});
    // Stop the music on menu
    if (audios.get("gameMusic")?.isPlaying()) audios.get("gameMusic")?.stop()
    if (audios.get("deathMusic")?.isPlaying()) audios.get("deathMusic")?.stop()
    
    return () => resetGameStorage(keysToKeep);
  }, []);

  const keysToKeep = ['lastScreen', 'settings', 'saves'];  // these keys won't be removed

  const resetGameStorage = (keysToKeep) => {
    // Cleaning the local storage
    clearStorage(keysToKeep);
  }

  return (
    <main className={styles['menus']}>
      <section>
        <h1>THE</h1>
        <Link to="/saves">
          <button className={styles['menus']}>Play</button>
        </Link>
        <Link to="/settings">
          <button className={styles['menus']}>Settings</button>
        </Link>
        <Link to="/credits">
          <button className={styles['menus']}>Credits</button>
        </Link>
        <button className={`${styles['menus']} ${styles['clear']}`} onClick={() => resetGame([''])}>Clear all data</button>
      </section>
      <Changelog />
      
    </main>
  );
}

export default Menu;
