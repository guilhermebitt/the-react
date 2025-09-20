// Data
import settingsData from '../data/settings.json' with { type: 'json' };

// Dependencies
import { Link } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';
import { useEffect, useState } from 'react';

// Hooks
import { useGame } from '../hooks/useGame';

// Stylesheet
import styles from './menus.module.css';

function Settings() {
  // Getting the lastScreen from localStorage
  const [lastScreen, setLastScreen] = useLocalStorage('lastScreen', '/');
  const [settings, setSettings] = useLocalStorage('settings', settingsData);

  const { audios } = useGame();
  
  const [gVolume, setGVolume] = useState(settings.volume);
  const [sfxVolume, setSfxVolume] = useState(settings.sfxVolume);
  const [musicVolume, setMusicVolume] = useState(settings.musicVolume);

  useEffect(() => {
    if (lastScreen === '/settings') {
      setLastScreen('/');
    }
    // Stopping the death music
    if (audios.get('deathMusic')?.isPlaying()) {
      audios.get('deathMusic').stop();
    }

  }, []);

  useEffect(() => {
    // Maintaining the music if the last screen was the game
      if (lastScreen.includes('/battle')) {
        if (!audios.get('gameMusic')?.isPlaying()) {
          audios.get('gameMusic')?.play();
        }
      } else {
        if (audios.get('gameMusic')?.isPlaying()) {
          audios.get('gameMusic')?.stop();
        }
      }
  }, [lastScreen])

  useEffect(() => {
    // This effect runs whenever any volume state changes
    const newSettings = {
      ...settings,
      volume: gVolume,
      sfxVolume: sfxVolume,
      musicVolume: musicVolume,
    };
    setSettings(newSettings);

    // Apply the new volume to the game's audio
    // code.

  }, [gVolume, sfxVolume, musicVolume]);

  const getSliderBackground = (value) => {
    const percentage = value * 100;
    return {
      background: `linear-gradient(to right, aqua ${percentage}%, #ccc ${percentage}%)`
    };
  };

  return (
    <main className={styles['menus']}>
      <section>
        <h1>SETTINGS</h1>
        {/* SLIDER OPTIONS */}
        <h2>Audio</h2>
        <div className={styles.sliderOption}>
          <label htmlFor="gVolume">Global Volume: </label>
          <input
            name="gVolume"
            id="gVolume"
            type="range"
            min="0"
            max="100"
            value={gVolume * 100}
            style={getSliderBackground(gVolume)}
            className={styles.slider}
            onChange={(e) => setGVolume(Number(e.target.value / 100))}
            />
        </div>
        <div className={styles.sliderOption}>
          <label htmlFor="sfxVolume">SFX Volume: </label>
          <input
            name="sfxVolume"
            id="sfxVolume"
            type="range"
            min="0"
            max="100"
            value={sfxVolume * 100}
            style={getSliderBackground(sfxVolume)}
            className={styles.slider}
            onChange={(e) => setSfxVolume(Number(e.target.value / 100))}
          />
        </div>
        <div className={styles.sliderOption}>
          <label htmlFor="musicVolume">Music Volume: </label>
          <input
            name="musicVolume"
            id="musicVolume"
            type="range"
            min="0"
            max="100"
            value={musicVolume * 100}
            style={getSliderBackground(musicVolume)}
            className={styles.slider}
            onChange={(e) => setMusicVolume(Number(e.target.value / 100))}
          />
        </div>
        <Link to={lastScreen}>
          <button className={styles['menus']}>Back</button>
        </Link>
      </section>
    </main>
  );
}

export default Settings;
