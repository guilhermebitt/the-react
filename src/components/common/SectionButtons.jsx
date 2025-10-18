// Hooks
import { useGame } from '../../hooks/useGame';

// Stylesheet
import styles from './SectionButtons.module.css';

function SectionButtons(props) {
  const { game } = useGame();

  return (
    <div className={styles.container}>
      <button
        onClick={props.sec1}
        className="default"
        disabled={game.get().currentTurn !== "player" ? true : false}
      >
        Action
      </button>
      <button
        onClick={props.sec2}
        className="default"
        disabled={game.get().currentTurn !== "player" ? true : false}
      >
        Inventory
      </button>
      <button
        onClick={props.sec3}
        className="default"
        disabled={game.get().currentTurn !== "player" ? true : false}
      >
        Perks
      </button>
      <button
        onClick={props.sec4}
        className="default"
        disabled={game.get().currentTurn !== "player" ? true : false}
      >
        WIP
      </button>
    </div>
  );
}

export default SectionButtons;
