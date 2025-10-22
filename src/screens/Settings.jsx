// Data
import settingsData from '../data/settings.json' with { type: 'json' };

// Dependencies
import { Link } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';
import { useEffect, useState } from 'react';

// Hooks
import { useStore } from '@/stores';

// Stylesheet
import styles from './menus.module.css';

function Settings() {
  // Getting the lastScreen from localStorage
  const [lastScreen, setLastScreen] = useLocalStorage('lastScreen', '/');
  const [settings, setSettings] = useLocalStorage('settings', settingsData);

  const [gVolume, setGVolume] = useState(settings.volume);
  const [sfxVolume, setSfxVolume] = useState(settings.sfxVolume);
  const [musicVolume, setMusicVolume] = useState(settings.musicVolume);

  // Stores
  const audiosActions = useStore("audios", "actions")

  useEffect(() => {
    if (lastScreen === '/settings') {
      setLastScreen('/');
    }
    // Stopping the death music
    if (audiosActions.getAudio('deathMusic')?.isPlaying()) {
      audiosActions.getAudio('deathMusic').stop();
    }

  }, []);

  useEffect(() => {
    // Maintaining the music if the last screen was the game
      if (lastScreen.includes('/battle')) {
        if (!audiosActions.getAudio('gameMusic')?.isPlaying()) {
          audiosActions.getAudio('gameMusic')?.play();
        }
      } else {
        if (audiosActions.getAudio('gameMusic')?.isPlaying()) {
          audiosActions.getAudio('gameMusic')?.stop();
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
