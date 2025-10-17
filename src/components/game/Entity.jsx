// Dependencies
import { useState, useEffect } from "react";
import { useAnimation } from "../../hooks/useAnimation";
import { useGame } from "../../hooks/useGame";

// Components
import HealthBar from "../ui/HealthBar";
import ExperienceBar from "../ui/ExperienceBar";
import ValueSpan from "../ui/ValueSpan";

// Stylesheet
import styles from "./Entity.module.css";

// Entity Component
function Entity({ entity }) {
  // React States
  const [firstLoad, setFirstLoad] = useState(true);

  // Custom Hooks
  const framePath = useAnimation(entity);
  const { game, audios } = useGame();

  // First load useEffect
  useEffect(handleFirstLoad, []);

  // Checking changes on enemy's life
  useEffect(() => {
    if (firstLoad) return;

    if (entity?.stats?.health <= 0) {
      entity.update({ currentAnim: "death" });
    }
  }, [entity?.stats?.health]);

  // UseEffect that updates each time the states of the entity changes
  useEffect(() => {
    if (firstLoad) return;

    if (entity?.states.includes("hit")) {
      if (audios.get("hitSound")) audios.get("hitSound").start();
    }

    if (entity?.states.includes("leveling")) {
      if (audios.get("levelUp")) audios.get("levelUp").start();
    }
  }, [entity?.states]);

  // This function just executes in the component construct
  function handleFirstLoad() {
    // This will make all other useEffects/functions work
    setFirstLoad(false);
  }

  // This function sets the game target to the current entity
  function selectTarget() {
    if (game.get().currentTurn === "player" && typeof entity?.id === "number") {
      game.update({ target: entity?.id });
    }
  }

  // Entity container classes
  const entityContainerClasses = `
    ${styles.entityContainer}
    ${entity?.id === game.get()?.target && ["player", "onAction"].includes(game.get().currentTurn) && styles.selected}
    ${styles[`enemy${entity?.id}`]}
    ${game.get().specificEntityTurn === entity?.id ? styles.turn : ""}
  `;

  // Entity image classes
  const entityImageClasses = `
    ${entity?.states.includes("hit") && styles.hit}
    ${entity?.states.includes("leveling") && entity?.entityType === "player" && styles.levelingUp}
  `;

  // Returning the Component
  return (
    <>
      {/* Entity container */}
      <div className={entityContainerClasses}>
        {/* Name and level */}
        {/* prettier-ignore */}
        <h2>{entity?.name} Lv.{entity?.level}</h2>

        {/* Experience and health bars */}
        {entity?.entityType !== "player" ? <HealthBar entityId={entity.id} /> : <ExperienceBar />}

        {/* Entity image */}
        <img className={entityImageClasses} src={framePath || entity?.img} alt="entity image" onClick={selectTarget} />

        {/* Extra div (those ones are displayed as "none" by default) */}
        <div className={styles.shadow}></div>
        <div className={styles.selectedArrow}>▼</div>

        {/* Component that controls the span message when the entity is hit, levelUps, etc */}
        <ValueSpan spanMessages={entity?.spanMessages} entityUpdater={entity?.update} />
      </div>
    </>
  );
}

export default Entity;
