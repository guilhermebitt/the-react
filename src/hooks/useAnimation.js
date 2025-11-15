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
    if (!entity) return;
  
    const standByFrames = entity?.animations?.standBy?.frames; // To get the frames
    if (!standByFrames || standByFrames.length === 0) return;
  
    const frameIndex = standByIndex % standByFrames.length; // To get the array with all frames
    const frameToUse = standByFrames[frameIndex];
  
    setFramePath({
      img: entity.img, // The sprite sheet image path
      coords: frameToUse, // The coordinates specified in the json {x, y}
      columns: entity.animations.columns, // The amount columns in the image (on 320x320 pieces)
      rows: entity.animations.rows // The amount rows in the image (on 320x320 pieces)
    });
  }, [standByIndex, entity]);

  const runAnim = useCallback(
    (animName) => {
      if (!entity) return;
  
      // Clears previous interval
      clearInterval(animInterval.current);
  
      // Skip if already dead    PS:::::: Im not sure how you should do the death thing, because of that, I havent deleted the individual pngs
      // PS::::::: remember too that the coords of the death sheet would be {x0,y0}{x100,y0}{x200,y0}{x0,y100}{x100,y100} cause its five frames and all one animation
      /*if (animName === "death" && entity.img === "/assets/entities/death/death.png") return;*/
  
      const anim = entity?.animations[animName];
      if (!anim || !anim.frames || anim.frames.length === 0) return;
  
      // Start from the first frame
      let index = 0;
  
      const nextFrame = () => {
        //console.log("called", anim.duration)
        // Determine the frame to use
        const frameCoords = anim.frames[index];
        setFramePath({
          img: animName === "death" ? "/assets/entities/death/death.png" : entity.img,       // Sprite sheet path again
          coords: frameCoords,  // {x, y}
          columns: animName === "death" ? 3 : entity.animations.columns, // columns
          rows: animName === "death" ? 2 : entity.animations.rows // rows
        });
        
        index += 1;
  
        // If we reached the end
        if (index >= anim.frames.length) {
          clearInterval(animInterval.current);
  
          // If not death, return to standBy
          if (animName !== "death") {
            // Instantly running the standBy animation
            runStandByAnim();
            entity.update({ currentAnim: "standBy" });
          } else {
            entity.update({ img: "/assets/entities/death/death4.png" });
          }
        }
      };
  
      // Immediately show first frame
      nextFrame();
      // Run subsequent frames at animation duration
      animInterval.current = setInterval(nextFrame, anim.duration);
    },
    [entity, animInterval]
  );

  /*const runAnim = useCallback(
    (animName) => {
      // Clears the interval to prevent many intervals at the same time
      clearInterval(animInterval.current);

      // If the enemy is dead and the current animation is death, skips
      if (animName === "death" && entity?.img === "/assets/entities/death/death4.png") return;

      // Gets the animation by the animation name
      const anim = entity?.animations[animName];

      // Set the first frame and changes the index to next frames
      const atkFrames = entity?.animations?.atk?.frames;
      if (!atkFrames || atkFrames.length === 0) return;
  
      const atkframeIndex = index % atkFrames.length;
      const atkframeToUse = atkFrames[atkframeIndex];
  
      // Changes the path according to the animation duration
      animInterval.current = setInterval(() => {
        // When the animation get to the last frame
        if (index === atkFrames.length) {
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
          setFramePath({
            img: entity.img,
            coords: atkframeToUse,
          });

          // updates the next index
          index = index + 1;
        }
      }, anim["duration"]);
    },
    [entity?.img, animInterval.current]
  );*/

  // Runs the current animation
  /*const runAnim = useCallback(
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
  );*/

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
