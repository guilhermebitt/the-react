// Components
import EntityContainer from './EntityContainer';
import Entity from './Entity';
import ComponentBorder from '../ui/ComponentBorder';

// Hooks
import { useGame } from '../../hooks/useGame'
import { useStore } from '@/stores';

// Stylesheet
import styles from './MapContainer.module.css';



function MapContainer({ map }) {

  // TEMPORARY STORE
  const enemies = useStore("enemies", "actions");

  // Returning the Component
  return (
    <ComponentBorder title='Map'>
      <div className={styles.mapContainer}>
        <img src={map.src} alt="game map" id={styles.map} />
        {/* Player on the left */}
        <div className={styles.playerSide}>
          <Entity entityId={0} />
        </div>
        {/* Enemies on the right */}
        <div className={styles.enemiesSide}>
          {enemies.getCurrent().map((enemy, index) => (
            <Entity key={enemy.id - 1 || index} entityId={enemy.id}/>
          ))}
        </div>
      </div>
    </ComponentBorder>
  );
}

export default MapContainer;
