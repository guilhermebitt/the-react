// Dependencies
import { Link } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';
import { produce } from 'immer';

// Hooks
import { useGame } from '../../hooks/useGame';

// Stylesheet
import styles from './OptionButtons.module.css';



function OptionButtons() {
  const [, setSaves] = useLocalStorage('saves');
  const { player, enemies, game } = useGame();
  
  function saveGame() {
    const saveId = game.data().currentSave
    setSaves(
      produce(draft => {
        const save = draft.find(e => e.id === saveId);
        if (save) Object.assign(save, {game: game.data(), enemies: enemies.get(), player: player.get().data});
      })
    );
  }

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