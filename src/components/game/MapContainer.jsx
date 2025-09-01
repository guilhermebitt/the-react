// Components
import EntityContainer from './EntityContainer.jsx';

// Hooks
import { useGame } from '../../hooks/useGame.js'

// Stylesheet
import styles from './MapContainer.module.css';



function MapContainer({ map }) {
  const { player, enemies } = useGame();

  // Returning the Component
  return (
    <div className={styles.mapContainer}>

      <img src={map.src} alt="game map" id={styles.map} />
      {/* Player on the left */}
      <div className={styles.playerSide}>
        <EntityContainer entity={player.get()} />
      </div>

      {/* Enemies on the right */}
      <div className={styles.enemiesSide}>
        {enemies.get().map((enemy, index) => (
          <EntityContainer key={enemy.id || index} entity={enemy} id={enemy.id}/>
        ))}
      </div>
    </div>
  );
}

export default MapContainer;
