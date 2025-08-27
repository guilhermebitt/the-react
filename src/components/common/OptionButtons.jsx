// Dependencies
import { Link } from 'react-router-dom';

// Stylesheet
import '../../assets/css/components_style/OptionButtons.css';



function OptionButtons() {

  

  return (
  <div className="options-menu-container">
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