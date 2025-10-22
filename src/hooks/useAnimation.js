// Dependencies
import { useEffect, useState, useRef } from 'react';
// Stores
import { useStore } from '@/stores';

export function useAnimation(entity) {
  // React States
  const [framePath, setFramePath] = useState();
  const [standByIndex, setStandByIndex] = useState(0);
  // Other Hooks
  const animInterval = useRef(null);
  // Stores
  const tick = useStore("tick", s => s.tick);

  // Runs every time the game tick updates
  useEffect(() => {
    handleTickUpdate();
  }, [tick]);

  // Executed when the component deconstruct
  useEffect(() => {return deconstruct}, []);

  // Constantly checks if the current animation changed
  useEffect(() => verifyAnim(entity?.currentAnim), [entity?.currentAnim]);

  // Runs every time the tick updates
  function handleTickUpdate() {
    // Checks if the current animation is standBy and runs it
    if (entity?.currentAnim === 'standBy') runStandByAnim();

    // Calculates the nexIndex (updates EVERY tick update)
    const nexIndex =
      standByIndex < entity?.animations['standBy']?.frames?.length - 1
        ? standByIndex + 1
        : 0;

    // Updates the standByIndex to the next index
    setStandByIndex(nexIndex);
  }

  // Checks the current animation
  function verifyAnim(animName) {
    // Checks if the current animation is the standBy
    if (animName === 'standBy') return;

    // If it's not standBy, runs the current animation
    return runAnim(animName);
  }

  // Runs the standBy animation
  function runStandByAnim() {
    // Gets the standBy animation from the entity
    const standByAnim = entity?.animations?.standBy;

    // If there is not a standBy animation, returns undefined
    if (!standByAnim) return;

    // Updates the frame path to the path of the standBy animation index
    setFramePath(standByAnim['frames'][standByIndex]);
  }

  // Runs the current animation
  function runAnim(animName) {
    // Clears the interval to prevent many intervals at the same time
    clearInterval(animInterval.current);

    // If the enemy is dead and the current animation is death, skips
    if (
      animName === 'death' &&
      entity?.img === '/assets/entities/death/death4.png'
    )
      return;

    // Gets the animation by the animation name
    const anim = entity?.animations[animName];

    // Set the first frame and changes the index to next frames
    setFramePath(anim['frames'][0]);
    let index = 1;

    // Changes the path according to the animation duration
    animInterval.current = setInterval(() => {
      // When the animation get to the last frame
      if (index === anim['frames'].length) {
        // If the current animation is death, will not return it to standBy
        if (animName !== 'death') {
          entity.update({ currentAnim: 'standBy' });
        } else {
          entity.update({ img: '/assets/entities/death/death4.png' });
        }

        // Clears the interval
        clearInterval(animInterval.current);
      } else {
        // Updates the next frame path to the path of the animation index
        setFramePath(anim['frames'][index]);

        // updates the next index
        index = index + 1;
      }
    }, anim['duration']);
  }

  // Clears the animation interval
  function clearAnimationInterval() {
    clearInterval(animInterval.current);
  }

  // Function to deconstruct the component
  function deconstruct() {
    clearAnimationInterval
  }

  // Returning the current entity frame path
  return framePath;
}
