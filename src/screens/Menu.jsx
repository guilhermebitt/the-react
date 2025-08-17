// Data
import gameData from '../data/game.json' with { type: 'json' };

// Dependencies
import { Link } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';

// Stylesheet
import '../assets/css/screens_style/menus.css';




function Menu() {
  const [currentTurn, setCurrentTurn] = useLocalStorage('currentTurn', gameData.currentTurn);

  const handlePlay = () => currentTurn === "none" && setCurrentTurn('player');

  return (
    <main id='menu'>
      <h1>The</h1>
      <Link to="/game">
        <button onClick={handlePlay}>Play</button>
      </Link>
      <Link to="/settings">
        <button>Settings</button>
      </Link>
    </main>
  );
}

export default Menu;
