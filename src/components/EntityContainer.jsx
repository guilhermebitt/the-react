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



function EntityContainer({entityData, id}) {
  const entity = entityData.data;
  const setEntity = entityData.setData;

  // Getting useStates
  const [frame, setFrame] = useState(entity?.img);
  const [, setStandBy] = useState(true);
  const [isDead, setIsDead] = useState(false);
  const [selected, setSelected] = useState(false);
  const [animIndex, setAnimIndex] = useState(0);  // !!! Attention: animation only will be sync if both components starts at same moment
  const [standByIndex, setStandByIndex] = useState(0);

  // Loading Game Storage
  const [game, setGame] = useLocalStorage('game', gameJson);
  const [gameTick] = useLocalStorage('gameTick');
  const [, setEnemiesData] = useLocalStorage('enemies');

  // Checks if the animation changed
  useEffect(() => {
    if (entity?.currentAnim && entity?.currentAnim !== 'standBy') {
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
      setFrame(animationFrames[standByIndex]);
    }
    // Updates the index
    // Unfortunately, the standBy animation NEEDS to have only 2 frames, otherwise I'll need to change this (1).
    const nexIndex = standByIndex < (1) ? standByIndex + 1 : 0;
    setStandByIndex(nexIndex);
  }, [gameTick]);

  // Game useEffect
  useEffect(() => {
    (game.target === id) ? setSelected(true) : setSelected(false);
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
  if (!isDead) {
    return (
      <div id={`enemy${id+1}`} className={`entity-container ${selected ? 'selected' : ''}`}>
        <h2>{entity?.name}</h2>
        {entity?.entityType !== 'player' && <HealthBar entity={entity}/>}
        <img src={frame} alt="entity image" onClick={selectTarget}/>
        <div className='shadow'></div>
        <div className='selectedArrow'>▼</div>
      </div>
    );
  }
}

export default EntityContainer;
