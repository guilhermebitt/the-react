// Data
import settingsJson from '../data/settings.json' with { type: 'json' };

// Dependencies
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faVolumeHigh, faVolumeMute } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { produce } from "immer";

// Components
import OptionButtons from './OptionButtons';

// Stylesheets
import '../assets/css/components_style/Header.css';



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
        <div id="options">
          <OptionButtons />
        </div>
      )}
      <div className="h-btn-container">
        <button onClick={mute} className="icon-btn"><FontAwesomeIcon id="music-icon" icon={volumeIcon} /></button>
        <button onClick={handleOptions} className="icon-btn"><FontAwesomeIcon id="gear-icon" className={showOptions ? "rotate" : "no-rotate"}  icon={faGear} /></button>
      </div>
      {showOptions && (
        <div id="options">
          <OptionButtons />
        </div>
      )}
    </header>
  )
};

export default Header;