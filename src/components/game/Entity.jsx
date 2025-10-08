// Dependencies
import { useState, useEffect } from 'react';
import { useAnimation } from '../../hooks/useAnimation.js';
import { useGame } from '../../hooks/useGame.js';

// Components
import HealthBar from '../ui/HealthBar';
import ExperienceBar from '../ui/ExperienceBar';

// Stylesheet
import styles from './Entity.module.css';

// Entity Component
function Entity({ entity }) {
  // React States
  const [hitAnim, setHitAnim] = useState(false);
  const [levelAnim, setLevelAnim] = useState(false);
  const [selectedAnim, setSelectedAnim] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);

  // Custom Hooks
  const framePath = useAnimation(entity);
  const { game } = useGame();

  // Test useEffect
  useEffect(() => {
    if (game.get().currentTurn === 'enemies') {
      console.log(game.switchTurn())
    }
  }, [game.get().currentTurn]);

  // First load useEffect
  useEffect(handleFirstLoad, []);

  // This function just executes in the component construct
  function handleFirstLoad() {
    // This will make all other useEffects/functions work
    setFirstLoad(false);
  }

  // This function sets the game target to the current entity
  function selectTarget() {
    if (game.get().currentTurn === 'player' && typeof entity?.id === 'number') {
      game.update({ target: entity?.id });
    }
  }

  // Returning the Component
  return (
    <>
      {/* Entity container */}
      <div className={styles.entityContainer}>
        {/* Name and level */}
        {/* prettier-ignore */}
        <h2>{entity?.name} Lv.{entity?.level}</h2>

        {/* Experience and health bars */}
        {entity?.entityType !== 'player' ? <HealthBar entityId={entity.id} /> : <ExperienceBar />}

        {/* Entity image */}
        <img src={framePath || entity?.img} alt="entity image" onClick={selectTarget} />
      </div>
    </>
  );
}

export default Entity;
