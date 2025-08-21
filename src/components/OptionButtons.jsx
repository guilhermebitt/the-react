// Data
import settingsJson from '../data/settings.json' with { type: 'json' };

// Dependencies
import { Link } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';
import { produce } from "immer";

// Stylesheet
import '../assets/css/components_style/OptionButtons.css';



function OptionButtons() {
  const [settings, setSettings] = useLocalStorage('settings', settingsJson);

  function mute() {
    console.log(settings);
    settings.muted ?
    setSettings(produce(draft => {
      draft.muted = false
    })) :
    console.log(settings)
    setSettings(produce(draft => {
      draft.muted = true
    }))
  };

  return (
  <div className="options-menu-container">
    <button onClick={mute}>Mute</button>
    <button>Log</button>
    <Link to="/settings">
      <button>Settings</button>
    </Link>
    <Link to="/menu">
      <button>Menu</button>
    </Link>
  </div>
  );
}

export default OptionButtons;