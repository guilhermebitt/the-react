// Hooks
import { useGame } from '../../hooks/useGame';

// Stylesheet
import styles from './SectionButtons.module.css';

function SectionButtons(props) {
  const { game } = useGame();

  return (
    <div className={styles.container}>
      <button
        onClick={props.sendMsg}
        className="default"
        disabled={game.get().currentTurn !== "player" ? true : false}
      >
        Action
      </button>
      <button
        className="default"
        disabled={game.get().currentTurn !== "player" ? true : false}
      >
        Inventory
      </button>
      <button
        className="default"
        disabled={game.get().currentTurn !== "player" ? true : false}
      >
        Skills
      </button>
      <button
        className="default"
        disabled={game.get().currentTurn !== "player" ? true : false}
      >
        WIP
      </button>
    </div>
  );
}

export default SectionButtons;
