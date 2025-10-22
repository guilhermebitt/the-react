// Components
import ComponentBorder from '../ui/ComponentBorder';

// Hooks
import { useStore } from '@/stores';

// Stylesheet
import styles from './ActionButtons.module.css';

function ActionButtons(props) {
  const game = useStore("game", "actions");

  return (
    <ComponentBorder title="Action">
      <div className={styles.actBtnContainer}>
        <button
          className="default"
          onClick={props.attack}
          disabled={game.getCurrent().currentTurn !== "player" ? true : false}
        >
          Attack
        </button>
        <button
          className="default"
          onClick={props.sendMsg}
          disabled={game.getCurrent().currentTurn !== "player" ? true : false}
        >
          Spells
        </button>
        <button
          className="default"
          onClick={props.changeAnim}
          disabled={game.getCurrent().currentTurn !== "player" ? true : false}
        >
          WIP
        </button>
        <button
          className="default"
          onClick={props.endTurn}
          disabled={game.getCurrent().currentTurn !== "player" ? true : false}
        >
          End Turn
        </button>
      </div>
    </ComponentBorder>
  );
}

export default ActionButtons;
