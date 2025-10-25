// Components
import ComponentBorder from '../ui/ComponentBorder';
import { memo } from 'react';

// Hooks
import { useStore } from '@/stores';

// Stylesheet
import styles from './ActionButtons.module.css';

function ActionButtons(props) {
  const currentTurn = useStore("game", s => s.game.currentTurn);

  return (
    <ComponentBorder title="Action">
      <div className={styles.actBtnContainer}>
        <button
          className="default"
          onClick={props.attack}
          disabled={currentTurn !== "player" ? true : false}
        >
          Attack
        </button>
        <button
          className="default"
          onClick={props.sendMsg}
          disabled={currentTurn !== "player" ? true : false}
        >
          Spells
        </button>
        <button
          className="default"
          onClick={props.changeAnim}
          disabled={currentTurn !== "player" ? true : false}
        >
          WIP
        </button>
        <button
          className="default"
          onClick={props.endTurn}
          disabled={currentTurn !== "player" ? true : false}
        >
          End Turn
        </button>
      </div>
    </ComponentBorder>
  );
}

export default memo(ActionButtons);
