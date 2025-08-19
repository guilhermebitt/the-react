// Dependencies
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

// Components
import OptionButtons from './OptionButtons';

// Stylesheets
import '../assets/css/components_style/Header.css';



function Header() {
  const [showOptions, setShowOptions] = useState(false);

  const handleOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <header>
      <h1>The</h1>
      {/* SETTINGS BUTTON LOGIC */}
      <button onClick={handleOptions} id="gear"><FontAwesomeIcon id="gear-icon" className={showOptions ? "rotate" : "no-rotate"}  icon={faGear} /></button>
      {showOptions && (
        <div id="options">
          <OptionButtons />
        </div>
      )}
      {/* TERMINAL BUTTON LOGIC */}
      <button onClick={handleOptions} id="gear"><FontAwesomeIcon id="gear-icon" className={showOptions ? "rotate" : "no-rotate"}  icon={faGear} /></button>
      {showOptions && (
        <div id="options">
          <OptionButtons />
        </div>
      )}
    </header>
  )
};

export default Header;