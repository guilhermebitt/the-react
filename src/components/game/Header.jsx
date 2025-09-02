// Data
import settingsJson from '../../data/settings.json' with { type: 'json' };

// Dependencies
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faVolumeHigh, faVolumeMute } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { produce } from "immer";

// Components
import OptionButtons from '../common/OptionButtons';

// Stylesheets
import styles from './Header.module.css';



function Header() {
  const [showOptions, setShowOptions] = useState(false);
  const [volumeIcon, setVolumeIcon] = useState(faVolumeHigh);
  const [settings, setSettings] = useLocalStorage('settings', settingsJson);

  useEffect(() => {
    settings.muted === true ? setVolumeIcon(faVolumeMute) : setVolumeIcon(faVolumeHigh);
  }, [settings.muted]);

  const handleOptions = () => {
    setShowOptions(!showOptions);
  };

  function mute() {
    settings.muted ?
    setSettings(produce(draft => {
      draft.muted = false
    })) :
    setSettings(produce(draft => {
      draft.muted = true
    }))
  };

  return (
    <header>
      <h1>The</h1>
      {/* SETTINGS BUTTON LOGIC */}
      {showOptions && (
        <div id={styles.options}>
          <OptionButtons />
        </div>
      )}
      <div className={styles["h-btn-container"]}>
        <button 
          onClick={mute} 
          className={styles["icon-btn"]}>
            <FontAwesomeIcon 
              id={styles["music-icon"]} 
              icon={volumeIcon} />
        </button>
        <button 
          onClick={handleOptions} 
          className={styles["icon-btn"]}>
            <FontAwesomeIcon 
            id={styles["gear-icon"]}
            className={showOptions ? styles.rotate : styles.noRotate} 
            icon={faGear} />
        </button>
      </div>
      {showOptions && (
        <div id={styles.options}>
          <OptionButtons />
        </div>
      )}
    </header>
  )
};

export default Header;