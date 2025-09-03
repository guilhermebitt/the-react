// Hooks
import { useGame } from '../../hooks/useGame.js';

// Stylesheets
import styles from './PlayerHUD.module.css';



function PlayerHUD() {
  const { player } = useGame()

  /*
  const [healthPercent, setHealthPercent] = useState(100);
  const [staminaPercent, setStaminaPercent] = useState(100);

  useEffect(() => {
    setHealthPercent(calcPercent(entity?.stats?.health, entity?.stats?.maxHealth));
  }, [entity?.stats.health]);

  useEffect(() => {
    setStaminaPercent(calcPercent(entity?.stats?.stamina, entity?.stats?.maxStamina));
  }, [entity?.stats.stamina]);

  const calcPercent = (hp, maxHp) => (hp / maxHp) * 100;
  */
  return (
    <div className={styles.hudContainer}>
      <div className={styles.hpContainer}>
        <div className={styles.hpBar}></div>
      </div>
      <div className={styles.mnContainer}>
        <div className={styles.mnBar}></div>
      </div>
      <p>Actions Left: 2</p>
    </div>
  );
};

export default PlayerHUD;