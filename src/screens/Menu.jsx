import { Link } from 'react-router-dom';
import '../assets/css/screens_style/menus.css';

function Menu() {
  return (
    <main id='menu'>
      <h1>The</h1>
      <Link to="/game">
        <button>Play</button>
      </Link>
      <Link to="/settings">
        <button>Settings</button>
      </Link>
    </main>
  );
}

export default Menu;
