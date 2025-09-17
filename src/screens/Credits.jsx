// Dependencies
import { Link } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';
import { useEffect } from 'react';

// Hooks
import { useGame } from '../hooks/useGame';

// Stylesheet
import styles from './menus.module.css';
import '../assets/css/scrollbar.css'



function Credits() {
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
    <main className={`${styles['menus']} scrollbar`}>
      <section>
        <h1>CREDITS</h1>
        <Link to={lastScreen}>
          <button className={styles['menus']}>Back</button>
        </Link>

        {/* CREDITS: */}
        <hr />
        {/* ART: */}
        <h2>Art made by</h2>
        {/* Eder Muniz */}
        <div className={styles['credits']}>
          <h3>Eder Muniz</h3>
          <p>Itch.io: <a href='https://edermunizz.itch.io' target='_blank'>https://edermunizz.itch.io/</a></p>
          <p>Website: <a href='https://edermuniz.carrd.co/' target='_blank'>https://edermuniz.carrd.co/</a></p>
          <p>Twitter: @EdermuniZpixels/</p>
          <p>Email: edermuniz14@gmail.com/</p>
        </div>
        {/* Guilherme Bittencourt */}
        <div className={styles['credits']}>
          <h3>Guilherme Bittencourt</h3>
          <p>GitHub: <a href='https://github.com/guilhermebitt' target='_blank'>https://github.com/guilhermebitt</a></p>
          <p>Email: guilherme.assis.bittencourt@gmail.com/</p>
        </div>
        <hr />
        {/* SOUNDS: */}
        <h2>Sound FX and music</h2>
        {/* Guilherme Bittencourt */}
        <div className={styles['credits']}>
          <h3>Guilherme Bittencourt</h3>
          <p>GitHub: <a href='https://github.com/guilhermebitt' target='_blank'>https://github.com/guilhermebitt</a></p>
          <p>Email: guilherme.assis.bittencourt@gmail.com/</p>
        </div>
        <hr />
        {/* PROGRAMMERS */}
        <h2>Programmers</h2>
        {/* Guilherme Bittencourt */}
        <div className={styles['credits']}>
          <h3>Guilherme Bittencourt</h3>
          <p>GitHub: <a href='https://github.com/guilhermebitt' target='_blank'>https://github.com/guilhermebitt</a></p>
          <p>Email: guilherme.assis.bittencourt@gmail.com/</p>
        </div>
        <hr />
        {/* BETA TESTERS */}
        <h2>Beta Testers</h2>
        {/* Guilherme Bittencourt */}
        <div className={styles['credits']}>
          <h3>Bianca (Amaldiçoada)</h3>
        </div>
        <hr />
        {/* SPECIAL THANKS */}
        <h2>Special thanks to</h2>
        {/* Guilherme Bittencourt */}
        <div className={styles['credits']}>
          <h3>Vinícius Duarte</h3>
          <h3>Emmanuel Resende</h3>
          <h3>Matheus Dutra</h3>
          <h3>Gustavo Henrique</h3>
          <h3>Bernardo Pinheiro</h3>
        </div>
        <hr />

        <Link to={lastScreen}>
          <button className={styles['menus']}>--- Return to menu ---</button>
        </Link>
      </section>

    </main>
  );
}

export default Credits;
