import { Link } from 'react-router-dom';
import '../assets/css/components_style/buttons.css';



function OptionButtons() {
  return (
  <div className="action-buttons-container">
    <button>Mute</button>
    <button>Log</button>
    <Link to="/settings">
      <button>Settings</button>
    </Link>
    <Link to="/">
      <button>Menu</button>
    </Link>
  </div>
  );
}

export default OptionButtons;