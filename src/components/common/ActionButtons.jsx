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
          id='attack'
          className="default leftanchor"
          onClick={props.attack}
          disabled={currentTurn !== "player" ? true : false}
        >
          (Q) Attack
        </button>
        <button
          id='spells'
          className="default leftanchor"
          onClick={props.sendMsg}
          disabled={currentTurn !== "player" ? true : false}
        >
          (W) Spells
        </button>
        <button
          id='wip2'
          className="default leftanchor"
          onClick={props.changeAnim}
          disabled={currentTurn !== "player" ? true : false}
        >
          (E) WIP
        </button>
        <button
          id='endturn'
          className="default leftanchor"
          onClick={props.endTurn}
          disabled={currentTurn !== "player" ? true : false}
        >
          (R) End Turn
        </button>
      </div>
    </ComponentBorder>
  );
}

export default memo(ActionButtons);
