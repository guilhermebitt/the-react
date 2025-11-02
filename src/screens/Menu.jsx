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
import { useSaveManager } from '@/hooks/';
import { useStore } from '@/stores';

// Stylesheet
import styles from './menus.module.css';

function Menu() {
  const [settings, setSettings] = useLocalStorage('settings', settingsData);
  const { resetGame } = useSaveManager();
  // Stores
  const audios = useStore("audios", s => ({getAudio: s.getAudio}));

  useEffect(() => {
    // Resets the game contexts
    resetGame();

    // Closes the log (if open)
    if (settings?.showLog) setSettings(prev => {return{...prev, showLog: false}});
    // Stop the music on menu
    if (audios.getAudio("gameMusic")?.isPlaying()) audios.getAudio("gameMusic")?.stop()
    if (audios.getAudio("deathMusic")?.isPlaying()) audios.getAudio("deathMusic")?.stop()
    if (audios.getAudio("mapMusic")?.isPlaying()) audios.getAudio("mapMusic")?.stop()
    
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
