// Components
import ComponentBorder from '../ui/ComponentBorder';

// Hooks
import { useGame } from '../../hooks/useGame';

// Stylesheet
import styles from './ActionButtons.module.css';

function ActionButtons(props) {
  const { game } = useGame();

  return (
    <ComponentBorder title="Action">
      <div className={styles.actBtnContainer}>
        <button
          className="default"
          onClick={props.attack}
          disabled={game.get().currentTurn !== "player" ? true : false}
        >
          Attack
        </button>
        <button
          className="default"
          onClick={props.sendMsg}
          disabled={game.get().currentTurn !== "player" ? true : false}
        >
          Message
        </button>
        <button
          className="default"
          onClick={props.changeAnim}
          disabled={game.get().currentTurn !== "player" ? true : false}
        >
          Change Animation
        </button>
        <button
          className="default"
          onClick={props.endTurn}
          disabled={game.get().currentTurn !== "player" ? true : false}
        >
          End Turn
        </button>
      </div>
    </ComponentBorder>
  );
}

export default ActionButtons;
