// Data
import gameJson from '../data/game.json' with { type: 'json' };

// Dependencies
import { useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { faGear, faVolumeHigh, faVolumeMute } from '@fortawesome/free-solid-svg-icons';
import { produce } from "immer";

// Components
import HealthBar from './HealthBar';

// Stylesheet
import '../assets/css/components_style/EntityContainer.css';



// Custom interval to execute a callback when cleaned
function setIntervalOnClean(callback, delay, onCleanup) {
  const interval = setInterval(callback, delay);

  return () => { // function that cleans the interval
    clearInterval(interval);
    if (onCleanup) onCleanup(); // this will be executed on cleanup
  };
}



function EntityContainer({ entityData }) {
  const entity = entityData.data;
  const setEntity = entityData.setData;

  // Getting useStates
  const [frame, setFrame] = useState(entity?.img);
  const [standBy, setStandBy] = useState(true);
  const [selected, setSelected] = useState(false);
  const [standByIndex, setStandByIndex] = useState(0);

  // Loading Game Storage
  const [game, setGame] = useLocalStorage('game', gameJson);
  const [gameTick] = useLocalStorage('gameTick');

  // Code for enemies turn
  useEffect(() => {
    // Conditions to skip
    if (game.currentTurn !== 'enemies' || entityData?.isDead() || entity?.entityType !== 'enemy') return;

    // Code for the enemies turn (for today i'm done)
  }, [game.currentTurn]);


  // Checks if the animation changed
  useEffect(() => {
    // Conditions to skip
    if (entity?.currentAnim === 'standBy') return;


    setStandBy(false);
    runAnim();
  }, [entity?.currentAnim]);


  // Game tick useEffect
  useEffect(() => {
    // Updates the index
    // Unfortunately, the standBy animation NEEDS to have only 2 frames, otherwise I'll need to change this (1).
    const nexIndex = standByIndex < (1) ? standByIndex + 1 : 0;
    setStandByIndex(nexIndex);

    // Conditions to continue
    if (!standBy) return;

    // Setting a variable to the animation. It consists in:
    // anim[0] -> Object: animation frames
    // anim[1] -> Int: Animation duration
    const anim = entity?.animations[entity?.currentAnim];
    const animationFrames = Object.values(anim[0]);

    // Updates the entity's image if the animation is standBy
    if (entity?.currentAnim === 'standBy') {
      setFrame(animationFrames[standByIndex]);
    }
  }, [gameTick]);


  // Game useEffect
  useEffect(() => {
    (game.target === entity?.id) ? setSelected(true) : setSelected(false);
    if (game.currentTurn === 'enemies' && typeof (game.target) === 'number') {
      setSelected(false)
      setGame(produce(draft => {
        draft.target = NaN;
      }));
    };
  }, [game]);

  // Entity useEffect
  useEffect(() => {
  if (entityData?.isDead && entityData.isDead() === true) {
    setEntity(draft => {
      if (draft) draft.currentAnim = 'death';
    });
  }
}, [entity?.stats?.health]);
  
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
        if (entity?.currentAnim !== 'death') {
          setEntity(draft => {
            draft.currentAnim = 'standBy';
          });
          setStandBy(true);
        }
        clearInterval(interval);
      } else {
        setFrame(animationFrames[index]);
        index = index + 1;
      }
    }, frameDuration);
  }

  function selectTarget() {
    if (game.currentTurn === 'player' && typeof entity?.id === 'number') {
      setGame(produce(draft => {
        draft.target = entity?.id;
      }));
    }
  }

  // Returning the Component
  return (
    <div id={`enemy${entity?.id+1}`} className={`entity-container ${selected ? 'selected' : ''}`}>
      <h2>{entity?.name}</h2>
      {entity?.entityType !== 'player' && <HealthBar entity={entity}/>}
      <img src={frame} alt="entity image" onClick={selectTarget}/>
      <div className='shadow'></div>
      <div className='selectedArrow'>▼</div>
    </div>
  );
}

export default EntityContainer;
