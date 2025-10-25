// Dependencies
import { useEffect, useState, useRef, useCallback } from "react";
// Stores
import { useStore } from "@/stores";

export function useAnimation(entityId) {
  // React States
  const [framePath, setFramePath] = useState(0);
  const [standByIndex, setStandByIndex] = useState(0);
  // Other Hooks
  const animInterval = useRef(null);
  // Stores
  const tick = useStore("tick", (s) => s.tick);
  const entity = entityId === 0 ? useStore("player", "actions").getCurrent() : useStore("enemies", "actions").getCurrent(entityId);

  // Runs every time the game tick updates
  useEffect(() => {
    handleTickUpdate();
  }, [tick]);

  // Executed when the component deconstruct
  useEffect(() => {
    return deconstruct;
  }, []);

  // Constantly checks if the current animation changed
  useEffect(() => verifyAnim(entity?.currentAnim), [entity?.currentAnim]);

  // Runs every time the tick updates
  const handleTickUpdate = useCallback(() => {
    // Checks if the current animation is standBy and runs it
    if (entity?.currentAnim === "standBy") runStandByAnim();

    // Calculates the nexIndex (updates EVERY tick update)
    const nexIndex = standByIndex < entity?.animations["standBy"]?.frames?.length - 1 ? standByIndex + 1 : 0;

    // Updates the standByIndex to the next index
    setStandByIndex(nexIndex);
  }, [entity?.currentAnim, standByIndex]);

  // Checks the current animation
  const verifyAnim = useCallback(
    (animName) => {
      // Checks if the current animation is the standBy
      if (animName === "standBy") return;

      // If it's not standBy, runs the current animation
      return runAnim(animName);
    },
    [entity?.currentAnim]
  );

  // Runs the standBy animation
  const runStandByAnim = useCallback(() => {
    // Gets the standBy animation from the entity
    const standByAnim = entity?.animations?.standBy;

    // If there is not a standBy animation, returns undefined
    if (!standByAnim) return;

    // Updates the frame path to the path of the standBy animation index
    setFramePath(standByAnim["frames"][standByIndex]);
  }, [standByIndex]);

  // Runs the current animation
  const runAnim = useCallback(
    (animName) => {
      // Clears the interval to prevent many intervals at the same time
      clearInterval(animInterval.current);

      // If the enemy is dead and the current animation is death, skips
      if (animName === "death" && entity?.img === "/assets/entities/death/death4.png") return;

      // Gets the animation by the animation name
      const anim = entity?.animations[animName];

      // Set the first frame and changes the index to next frames
      setFramePath(anim["frames"][0]);
      let index = 1;

      // Changes the path according to the animation duration
      animInterval.current = setInterval(() => {
        // When the animation get to the last frame
        if (index === anim["frames"].length) {
          // If the current animation is death, will not return it to standBy
          if (animName !== "death") {
            entity.update({ currentAnim: "standBy" });
          } else {
            entity.update({ img: "/assets/entities/death/death4.png" });
          }

          // Clears the interval
          clearInterval(animInterval.current);
        } else {
          // Updates the next frame path to the path of the animation index
          setFramePath(anim["frames"][index]);

          // updates the next index
          index = index + 1;
        }
      }, anim["duration"]);
    },
    [entity?.img, animInterval.current]
  );

  // Clears the animation interval
  const clearAnimationInterval = useCallback(() => {
    clearInterval(animInterval.current);
  }, [animInterval.current]);

  // Function to deconstruct the component
  const deconstruct = useCallback(() => {
    clearAnimationInterval;
  }, []);

  // Returning the current entity frame path
  return framePath;
}
