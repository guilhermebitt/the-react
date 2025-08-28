// Dependencies
import { Link } from 'react-router-dom';

// Stylesheet
import styles from './OptionButtons.module.css';



function OptionButtons() {

  

  return (
  <div className={styles["options-menu-container"]}>
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