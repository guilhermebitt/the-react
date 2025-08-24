// Data
import gameJson from '../data/game.json' with { type: 'json' };
import settingsJson from '../data/settings.json' with { type: 'json' };

// Dependencies
import { useEffect, useState, useRef } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import * as funcs from '../scripts/functions.js';
import { produce } from "immer";

// Components
import HealthBar from './HealthBar';

// Stylesheet
import '../assets/css/components_style/EntityContainer.css';



function EntityContainer({ entityData, player }) {
  const hitSoundRef = useRef(null);
  const entity = entityData.data;
  const setEntity = entityData.setData;

  // Getting useStates
  const [frame, setFrame] = useState(entity?.img);
  const [standBy, setStandBy] = useState(true);
  const [selected, setSelected] = useState(false);
  const [standByIndex, setStandByIndex] = useState(0);
  const [damage, setDamage] = useState([[]]);
  const [hit, setHit] = useState(false);

  // Loading Game Storage
  const [game, setGame] = useLocalStorage('game', gameJson);
  const [, setTerminalText] = useLocalStorage('terminalText', []);
  const [gameTick] = useLocalStorage('gameTick');
  const [enemiesData] = useLocalStorage('enemies');
  const [settings] = useLocalStorage('settings', settingsJson);

  // Initializing funcs
  funcs.init(setTerminalText, setGame);

  // On component first load
  useEffect(() => {
    // ----- GAME MUSIC -----
    // Loading music
    const hitSound = new Audio('/assets/sounds/misc/hit_sound.ogg');
    hitSound.volume = settings.volume;  // volume, from 0 to 1
    hitSound.muted;
    hitSoundRef.current = hitSound;

    return () => {
      hitSound.pause();
      hitSound.currentTime = 0; // reset
      hitSoundRef.current = null;
    };
  }, [])

  // Code for enemies turn
  useEffect(() => {
    // --- Conditions to skip ---
    // This guarantee that the code will only be executed if its the enemy's turn
    if (game.currentTurn !== 'enemies' || game.specificEnemyTurn !== entity?.id) return;
    // --------------------------

    // --- Processing the enemy's turn ---
    (async () => {
      // Start of the enemy's turn
      if (!entityData?.isDead()) {  // executes only if the enemy is not dead
        var playerIsDead = await enemyTurn(entityData);
      }

      // Ending of the enemy's turn.
      if (playerIsDead) {
        setGame(produce(draft => {
          draft.specificEnemyTurn = 'none';
          draft.currentTurn = 'none';
        }));
      } else
      if ((game.specificEnemyTurn >= enemiesData.length - 1) && (!playerIsDead)) {
        setGame(produce(draft => {
          draft.specificEnemyTurn = 'player';
          draft.currentTurn = 'player';
        }));
        funcs.phrase('Its your turn!');
      } else {
        setGame(produce(draft => {
          draft.specificEnemyTurn = game.specificEnemyTurn + 1;
        }));
      }

    })();  // the '()' is to call the async function!
    // -------------------------------------

  }, [game.specificEnemyTurn]);
  // --- END OF USE EFFECT ---

  // Checks if the animation changed
  useEffect(() => {
    // Conditions to skip
    if (entity?.currentAnim === 'standBy') return;

    setStandBy(false);
    runAnim();
  }, [entity?.currentAnim]);
  // --- END OF USE EFFECT ---


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
  // --- END OF USE EFFECT ---

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

  // Entity LIFE useEffect
  useEffect(() => {
    if (!entity?.dmgTaken) return;

    
    

    if (entity?.dmgTaken > 0) setDamage(prev => [...prev, [entity?.dmgTaken, entity?.dmgWasCrit]]);
    if (entity?.dmgTaken === 'Missed') setDamage(prev => [...prev, ["Missed", false]]);

    if (entity?.dmgTaken !== 'Missed') {
      // Running the Hit Animation and Sound FX
      setHit(true);
      setTimeout(() => {
        setHit(false);
        clearTimeout();
      }, 1000)

      hitSoundRef.current.play().catch(err => {
        console.log("Autoplay bloqueado pelo navegador:", err);
      });
      // ---------------------------------------
    }

    // Checking if the enemy died
    if (entityData?.isDead && entityData.isDead() === true) {
      setEntity(draft => {
        if (draft) draft.currentAnim = 'death';
      });
    }

    entityData.setData(draft => {
      draft.dmgTaken = 0;
      draft.dmgWasCrit = false;
    })

  }, [entity?.dmgTaken]);
  // --- END OF USE EFFECT ---

  function enemyTurn(enemy) {
    return new Promise(resolve => {
      // CODE FOR THE ENEMY'S TURN
      const turn = enemy?.handleTurn(player);
      
      if (turn.actionType === 'atk') {
        var { attackMsg, killed, timeToWait } = turn.action;
        funcs.phrase(`${turn.msg}. ${attackMsg}`);

        // Verifying if the player died
        if (killed) {
          funcs.phrase('You died.');
          setGame(produce(draft => {draft.currentMusic = '/assets/sounds/musics/you_died.ogg'}))
        }
      };

      // Timer to skip the current enemy turn
      const timer = setTimeout(() => {
        resolve(killed);  // resolving the promise!
        clearTimeout(timer);
      }, timeToWait);
    });
  }
  
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
    <div id={`enemy${entity?.id+1}`} className={`entity-container ${selected ? 'selected' : ''} ${game.specificEnemyTurn === entity?.id ? 'turn' : ''}`}>
      <h2>{entity?.name}</h2>
      {entity?.entityType !== 'player' && <HealthBar entity={entity}/>}
      <img src={frame} alt="entity image" onClick={selectTarget} className={hit ? 'hit' : ''}/>
      <div className='shadow'></div>
      <div className='selectedArrow'>▼</div>
      {damage.length > 0 && damage.map((dmg, index) => (
        <div key={index} className={`damage ${dmg[1] === true ? 'crit' : ''}`}>{dmg[0]}</div>
      ))}
    </div>
  );
}

export default EntityContainer;
