// Dependencies
import { useState, useEffect } from "react";
import { useAnimation } from "../../hooks/useAnimation";
import { useStore } from "@/stores";

// Components
import HealthBar from "../ui/HealthBar";
import ExperienceBar from "../ui/ExperienceBar";
import ValueSpan from "../ui/ValueSpan";

// Stylesheet
import styles from "./Entity.module.css";

// Entity Component
function Entity({ entityId }) {
  // React States
  const [firstLoad, setFirstLoad] = useState(true);
  // Stores
  const audiosActions = useStore("audios", "actions");
  // --== entity ==--
  const entity =
    entityId === 0 ? useStore("player", (s) => s.player) : useStore("enemies", (s) => s.enemies[entityId - 1]);

  // spanMessages
  const spanMessages =
    entityId === 0
      ? useStore("player", (s) => s.player.spanMessages)
      : useStore("enemies", (s) => s.enemies[entityId - 1].spanMessages);

  const game = useStore("game", "actions");
  const target = useStore("game", (s) => s.game.target);
  // Custom Hooks
  const framePath = useAnimation(entityId);

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
      if (audiosActions.getAudio("hitSound")) audiosActions.getAudio("hitSound").start();
    }

    if (entity?.states.includes("leveling")) {
      if (audiosActions.getAudio("levelUp")) audiosActions.getAudio("levelUp").start();
    }
  }, [entity?.states]);

  // This function just executes in the component construct
  function handleFirstLoad() {
    // This will make all other useEffects/functions work
    setFirstLoad(false);
  }

  // This function sets the game target to the current entity
  function selectTarget() {
    if (game.getCurrent().currentTurn === "player" && entity.id !== 0) {
      game.update({ target: entity?.id });
    }
  }

  // Entity container classes
  const entityContainerClasses = `
    ${styles.entityContainer}
    ${entity?.id === target && ["player", "onAction"].includes(game.getCurrent().currentTurn) && styles.selected}
    ${!entity?.isBoss && styles[`enemy${entity?.id}`]}
    ${entity?.isBoss && styles[`boss`]}
    ${game.getCurrent().specificEntityTurn === entity?.id ? styles.turn : ""}
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
        <h2>{entity?.name}{!entity?.isBoss && ` Lv.${entity?.level}`}</h2>

        {/* Experience and health bars */}
        {entity?.entityType !== "player" ? <HealthBar entityId={entity.id} /> : <ExperienceBar />}

        {/* Entity image */}
        {/*<img className={entityImageClasses} src={framePath || entity?.img} alt="entity image" onClick={selectTarget} />*/}

        {/* reminder: every individual sprite is 320x320px, for later, also this div below is volatile so touch with caution*/}
        <div
          style={{
            width: `${100}px`,
            height: `${entity?.entityType === "player" ? 100 : 300}px`,
            backgroundImage: `url(${framePath.img})`,
            backgroundPosition: `-${framePath?.coords?.x}px -${framePath?.coords?.y}px`,
            backgroundSize: `${entity.animations.collums * 100}px ${entity.animations.rows * 100}px`, // new sheet size
          }}/>

        {/* Extra div (those ones are displayed as "none" by default) */}
        <div className={styles.shadow}></div>
        <div className={styles.selectedArrow}>▼</div>

        {/* Component that controls the span message when the entity is hit, levelUps, etc */}
        <ValueSpan spanMessages={spanMessages} entityUpdater={entity?.update} />
      </div>
    </>
  );
}

export default Entity;
