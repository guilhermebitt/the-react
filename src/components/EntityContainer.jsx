// Dependencies
import { useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { produce } from "immer";

// Stylesheet
import '../assets/css/components_style/EntityContainer.css';



function EntityContainer({entityData}) {
  const entity = entityData.data;
  const setEntity = entityData.setData;

  // Getting useStates
  const [frame, setFrame] = useState(entity?.img);
  const [, setStandBy] = useState(true);
  const [animIndex, setAnimIndex] = useState(0);  // !!! Attention: animation only will be sync if both components starts at same moment

  // Game tick
  const [gameTick] = useLocalStorage('gameTick');

  // Checks if the animation changed
  useEffect(() => {
    if (entity?.currentAnim !== 'standBy') {
      setStandBy(false);
      runAnim();
    }
  }, [entity?.currentAnim]);

  // Game tick useEffect
  useEffect(() => {
    // Setting a variable to the animation. It consists in:
    // anim[0] -> Object: animation frames
    // anim[1] -> Int: Animation duration
    const anim = entity?.animations[entity?.currentAnim];
    const animationFrames = Object.values(anim[0]);

    // Updates the entity's image if the animation is standBy
    if (entity?.currentAnim === 'standBy') {
      setFrame(animationFrames[animIndex]);
    }
    // Updates the index
    const nexIndex = animIndex < (animationFrames.length - 1) ? animIndex + 1 : 0;
    setAnimIndex(nexIndex);
  }, [gameTick]);

  function runAnim() {
    const anim = entity?.animations[entity?.currentAnim];
    const animationFrames = Object.values(anim[0]);
    const frameDuration = anim[1];

    // Set the first frame and changes the index to next frames
    setFrame(animationFrames[0]);
    let index = 1;

    const interval = setInterval(() => {
      // When the animation get to the last frame
      if (index === animationFrames.length) {
        setEntity(produce(draft => {
          draft.currentAnim = 'standBy';
        }));
        setStandBy(true)
        clearInterval(interval);
      } else {
        setFrame(animationFrames[index]);
        index = index + 1;
      }
    }, frameDuration);
  }

  // Returning the Component
  return (
    <div className="entity-container">
      <h2>{entity?.name}</h2>
      {/*<img src={frame} alt="entity image" />*/}
    </div>
  );
}

export default EntityContainer;
