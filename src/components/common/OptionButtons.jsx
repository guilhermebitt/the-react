// Dependencies
import { Link } from 'react-router-dom';

// Hooks
import { useGame } from '../../hooks/useGame';
import { useSaveManager } from '../../hooks/useSaveManager';

// Stylesheet
import styles from './OptionButtons.module.css';



function OptionButtons() {
  const { game } = useGame();
  const { saveGame } = useSaveManager(game.get().currentSave);

  return (
  <div className={styles["options-menu-container"]}>
    <button>Log</button>
    <Link to="/settings">
      <button>Settings</button>
    </Link>
    <Link to="/menu">
      <button>Menu</button>
    </Link>
    <button onClick={saveGame}>Save Game</button>
  </div>
  );
}

export default OptionButtons;