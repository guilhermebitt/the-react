// Components
import EntityContainer from './EntityContainer.jsx';

// Hooks
import { useGame } from '../../hooks/useGame.js'

// Stylesheet
import styles from './MapContainer.module.css';



function MapContainer({ map }) {
  const { player, enemiesController } = useGame();
  const enemies = enemiesController.get();

  // Returning the Component
  return (
    <div className={styles.mapContainer}>

      <img src={map.src} alt="game map" id="map" />
      {/* Player on the left */}
      <div className={styles.playerSide}>
        <EntityContainer entityData={player} />
      </div>

      {/* Enemies on the right */}
      <div className={styles.enemiesSide}>
        {enemies.map((enemy, index) => (
          <EntityContainer key={enemy.data.id || index} entityData={enemy} id={enemy.data.id}/>
        ))}
      </div>
    </div>
  );
}

export default MapContainer;
