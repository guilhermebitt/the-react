// Dependencies
import { Link } from 'react-router-dom';

// Components
import ComponentBorder from '../ui/ComponentBorder';

// Hooks
import { useGame } from '../../hooks/useGame';
import { useSaveManager } from '../../hooks/useSaveManager';

// Stylesheet
import styles from './OptionButtons.module.css';



function OptionButtons() {
  const { game } = useGame();
  const { saveGame } = useSaveManager(game.get().currentSave);

  return (
  <ComponentBorder title="Options">
    <div className={styles["options-menu-container"]}>
      <Link to="/settings">
        <button className='default'>Settings</button>
      </Link>
      <Link to="/menu">
        <button className='default'>Menu</button>
      </Link>
      <button className='default' onClick={saveGame} disabled={!(game.get().currentTurn === "player")}>Save Game</button>
    </div>
  </ComponentBorder>
  );
}

export default OptionButtons;