// Hooks
import { useStore } from '@/stores';

// Stylesheet
import styles from './SectionButtons.module.css';

function SectionButtons(props) {
  const game = useStore("game", "actions");

  return (
    <div className={styles.container}>
      <button
        onClick={props.sec1}
        className="default"
        disabled={game.getCurrent().currentTurn !== "player" ? true : false}
      >
        Action
      </button>
      <button
        onClick={props.sec2}
        className="default"
        disabled={game.getCurrent().currentTurn !== "player" ? true : false}
      >
        Inventory
      </button>
      <button
        onClick={props.sec3}
        className="default"
        disabled={game.getCurrent().currentTurn !== "player" ? true : false}
      >
        Perks
      </button>
      <button
        onClick={props.sec4}
        className="default"
        disabled={game.getCurrent().currentTurn !== "player" ? true : false}
      >
        WIP
      </button>
    </div>
  );
}

export default SectionButtons;
