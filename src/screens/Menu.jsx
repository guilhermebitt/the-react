// Data
import gameData from '../data/game.json' with { type: 'json' };

// Dependencies
import { Link } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';
import { clearStorage } from '../scripts/functions';

// Stylesheet
import '../assets/css/screens_style/menus.css';




function Menu() {
  const [currentTurn, setCurrentTurn] = useLocalStorage('currentTurn', gameData.currentTurn);

  const handlePlay = () => currentTurn === "none" && setCurrentTurn('player');
  const keysToKeep = ['lastScreen', 'settings'];  // these keys won't be removed

  return (
    <main className='menus'>
      <section>
        <h1>The</h1>
        <Link to="/game">
          <button className='menus' onClick={handlePlay}>Play</button>
        </Link>
        <Link to="/settings">
          <button className='menus' >Settings</button>
        </Link>
        <button className='menus clear' onClick={() => clearStorage(keysToKeep)}>Clear all data (temporary)</button>
      </section>
      
    </main>
  );
}

export default Menu;
