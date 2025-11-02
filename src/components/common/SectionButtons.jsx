// Hooks
import { useStore } from '@/stores';
import { memo } from 'react';

// Stylesheet
import styles from './SectionButtons.module.css';
 
function SectionButtons(props) {
  const game = useStore("game", "actions");

  return (
    <div className={styles.container}>
      <button
        id='action'
        onClick={props.sec1}
        className="default"
        disabled={game.getCurrent().currentTurn !== "player" ? true : false}
      >
        (1) Action
      </button>
      <button
        id='inventory'
        onClick={props.sec2}
        className="default"
        disabled={game.getCurrent().currentTurn !== "player" ? true : false}
      >
        (2) Inventory
      </button>
      <button
        id='perks'
        onClick={props.sec3}
        className="default"
        disabled={game.getCurrent().currentTurn !== "player" ? true : false}
      >
        (3) Perks
      </button>
      <button
        id='wip'
        onClick={props.sec4}
        className="default"
        disabled={game.getCurrent().currentTurn !== "player" ? true : false}
      >
        (4) WIP
      </button>
    </div>
  );
}

export default memo(SectionButtons);
