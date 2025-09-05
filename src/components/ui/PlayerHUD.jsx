// Components
import ComponentBorder from './ComponentBorder.jsx';

// Hooks
import { useGame } from '../../hooks/useGame.js';

// Stylesheets
import styles from './PlayerHUD.module.css';

function PlayerHUD() {
  const { player } = useGame();

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

      {/* HEALTH BAR */}
      <ComponentBorder
        title="HP"
        borderStyles={{ borderColor: 'red', padding: '5px' }}
        titleStyles={{ borderColor: 'red', padding: '0 5px', fontSize: "0.75rem" }}
        boxStyles={{ color: 'red' }}
      >
        <div className={styles.hpContainer}>
          <div className={styles.hpBar}></div>
        </div>
      </ComponentBorder>


      {/* MANA BAR */}
      <ComponentBorder
        title="MN"
        borderStyles={{ borderColor: 'aqua', padding: '5px' }}
        titleStyles={{ borderColor: 'aqua', padding: '0 5px', fontSize: "0.75rem" }}
        boxStyles={{ color: 'aqua' }}
      >
        <div className={styles.mnContainer}>
          <div className={styles.mnBar}></div>
        </div>
      </ComponentBorder>

      
      <p>Actions Left: 2</p>

      
    </div>
  );
}

export default PlayerHUD;
