// Dependencies
import { Link } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';
import { useEffect } from 'react';

// Hooks
import { useGame } from '../hooks/useGame';

// Stylesheet
import styles from './menus.module.css';



function Settings() {
  // Getting the lastScreen from localStorage
  const [lastScreen, setLastScreen] = useLocalStorage('lastScreen', '/');
  
  const { audios } = useGame();

  useEffect(() => {
    if (lastScreen === '/settings') {
      setLastScreen('/');
    }
    // Stopping the death music
    if (audios.get("deathMusic")?.isPlaying()) {
      audios.get("deathMusic").stop();
    }
  }, []);

  return (
    <main className={styles['menus']}>
      <section>
        <h1>Settings</h1>
        <button className={styles['menus']}>Option1</button>
        <Link to={lastScreen}>
          <button className={styles['menus']}>Back</button>
        </Link>
      </section>
    </main>
  );
}

export default Settings;
