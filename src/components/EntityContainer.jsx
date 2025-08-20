// Dependencies
import { useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { produce } from "immer";

// Components
import Stats from "./Stats";

// Stylesheet
import '../assets/css/components_style/EntityContainer.css';



function EntityContainer({entityData}) {
  const entity = entityData.data;
  const setEntity = entityData.setData;

  // Getting useStates
  const [frame, setFrame] = useState(entity?.img);
  const [loop, setLoop] = useState(true);
  const [resetAnim, setResetAnim] = useState(false);
  const [startAnim, setStartAnim] = useState(false);

  // Setting the entities and getting the gameTick (for reset the animation loop)
  const [, setPlayer] = useLocalStorage('player');
  const [, setEnemy] = useLocalStorage('enemy');
  const [animIndex, setAnimIndex] = useLocalStorage('animIndex', 0);
  const [gameTick] = useLocalStorage('gameTick');



  // Game tick useEffect
  useEffect(() => {
    setAnimIndex(gameTick % 2);

    !startAnim && setStartAnim(true);

    if (resetAnim) {
      setEntity(produce(draft => {
        draft.currentAnim = 'standBy';
        }));
      setResetAnim(false);
    }

  }, [gameTick]);



  // Controlling the entity animation
  useEffect(() => {
    // checks if there is the animation and wait to sync with gameTick
    if (!entity?.animations?.[entity?.currentAnim] || !startAnim) return;

    // Setting a variable to the animation
    // It consists in:
    // anim[0] -> Object: animation frames
    // anim[1] -> Int: Animation duration
    // anim[2] -> Boolean: Repeatable
    const anim = entity?.animations[entity?.currentAnim];
    const animationFrames = Object.values(anim[0]);
    const frameDuration = anim[1];
    setLoop(anim[2]);

    let index = animIndex;
    //if (entity?.currentAnim === 'standBy') index = animIndex;
    setFrame(animationFrames[index]); // sets the first frame

    const interval = setInterval(() => {
      index = (index + 1) % animationFrames.length;
      setFrame(animationFrames[index]);

      if (!loop && index === animationFrames.length - 1) {
        // Timer to keep the last frame for at least the frameDuration
        const timer = setTimeout(() => {
          setResetAnim(true);
        }, frameDuration);
        clearInterval(interval);
      }
    }, frameDuration);

    return () => clearInterval(interval);
  }, [entity?.currentAnim, loop, startAnim]);



  // Returning the Component
  return (
    <div className="entity-container">
      <h2>{entity?.name}</h2>
      <img src={frame} alt="entity image" />
      <Stats entity={entity} />
    </div>
  );
}

export default EntityContainer;
