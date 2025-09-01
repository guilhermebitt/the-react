// Data
import savesData from '../data/saves.json' with { type: 'json' }

// Dependencies
import { Link } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';
import { useEffect } from 'react';

// Components
import SaveGame from '../components/ui/SaveGame';

// Stylesheet
import styles from './menus.module.css';

function Saves() {
  // Getting the lastScreen from localStorage
  const [lastScreen, setLastScreen] = useLocalStorage('lastScreen', '/');

  useEffect(() => {
    if (lastScreen === '/saves') {
      setLastScreen('/');
    }
  });

  return (
    <main className={styles['menus']}>
      <section>
        <h1>Saves</h1>
        {
          [0, 1, 2].map(index => (
            <SaveGame key={index} saveId={index}/>
          ))
        }
        <Link to={lastScreen}>
          <button className={styles['menus']}>Back</button>
        </Link>
      </section>
    </main>
  );
}

export default Saves;
