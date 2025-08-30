// Data
import gameJson from '../../data/game.json' with { type: 'json' };
import settingsJson from '../../data/settings.json' with { type: 'json' };

// Dependencies
import { useEffect, useState, useRef } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import * as funcs from '../../utils/functions.js';
import { produce } from "immer";

// Components
import HealthBar from '../ui/HealthBar.jsx';

// Hooks
import { useGame } from '../../hooks/useGame.js';

// Stylesheet
import styles from './EntityContainer.module.css';



function EntityContainer({ entityData }) {
  const hitSoundRef = useRef(null);
  const entity = entityData?.data;

  // Contexts
  const { tick, audio, player, enemiesController } = useGame();
  const enemiesData = enemiesController.get();

  // Loading Game Storage
  const [game, setGame] = useLocalStorage('game', gameJson);
  const [, setTerminalText] = useLocalStorage('terminalText', []);
  const [settings] = useLocalStorage('settings', settingsJson);

  // Getting useStates
  const [frame, setFrame] = useState(entity?.img);
  const [standBy, setStandBy] = useState(true);
  const [selected, setSelected] = useState(false);
  const [standByIndex, setStandByIndex] = useState(0);
  const [damage, setDamage] = useState([[]]);
  const [hit, setHit] = useState(false);

  // Initializing funcs
  funcs.init(setTerminalText, setGame);

  // On component first load
  useEffect(() => {
    // ----- GAME MUSIC -----
    const hitSound = new Audio('/assets/sounds/misc/hit_sound.ogg');
    hitSound.volume = settings.volume;  // volume, from 0 to 1
    hitSound.muted;
    hitSoundRef.current = hitSound;

    return () => {
      hitSound.pause();
      hitSound.currentTime = 0; // reset
      hitSoundRef.current = null;
    };
  }, []);



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
        await enemyTurn(entityData);
      }

      // Ending of the enemy's turn.
      if (player.isDead()) {
        setGame(produce(draft => {
          draft.specificEnemyTurn = 'none';
          draft.currentTurn = 'none';
        }));
      } else
        if ((game.specificEnemyTurn >= enemiesData.length - 1) && (!player.isDead())) {
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
    const nexIndex = standByIndex < (entity?.animations['standBy']?.frames?.length - 1) ? standByIndex + 1 : 0;
    setStandByIndex(nexIndex);

    // Conditions to continue
    if (!standBy) return;

    // Setting a variable to the animation.
    const anim = entity?.animations[entity?.currentAnim];
    const animationFrames = anim.frames;

    // Updates the entity's image if the animation is standBy
    if (entity?.currentAnim === 'standBy') {
      setFrame(animationFrames[standByIndex]);
    }
  }, [tick]);



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
    if (!entity.dmgTaken) return;

    if (entity?.dmgTaken >= 0) setDamage(prev => [...prev, [entity?.dmgTaken, entity?.dmgWasCrit]]);
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
      entity.currentAnim = 'death';
    }

  }, [entity.dmgTaken]);


  // ----- FUNCTIONS -----
  function enemyTurn(enemy) {
    return new Promise(resolve => {
      // CODE FOR THE ENEMY'S TURN
      const turn = enemy?.handleTurn(player);

      if (turn.actionType === 'atk') {
        var { attackMsg, timeToWait } = turn.action;
        funcs.phrase(`${turn.msg}. ${attackMsg}`);

        // Verifying if the player died
        if (player.isDead()) {
          funcs.phrase('You died.');
          setGame(produce(draft => { draft.currentMusic = ['/assets/sounds/musics/you_died.ogg', false] }))
          audio.stopMusic();
          audio.playMusic('/assets/sounds/musics/you_died.ogg', false);
        }
      };

      // Timer to skip the current enemy turn
      const timer = setTimeout(() => {
        resolve();  // resolving the promise!
        clearTimeout(timer);
      }, timeToWait + 250);  // more 250ms to the enemy's actions
    });
  }

  function runAnim() {
    const anim = entity?.animations[entity?.currentAnim];
    const animationFrames = anim.frames;
    const frameDuration = anim.duration;

    // Set the first frame and changes the index to next frames
    setFrame(animationFrames[0]);
    let index = 1;

    const interval = setInterval(() => {
      // When the animation get to the last frame
      if (index === animationFrames.length) {
        if (entity?.currentAnim !== 'death') {
          entity.currentAnim = 'standBy';
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
    <>
      {/* Code to toggle both the selected and the turn class */}
      <div className={
          `${styles[`enemy${entity?.id + 1}`]} ${styles.entityContainer} ${selected ? styles.selected : ''} 
        ${game.specificEnemyTurn === entity?.id ? styles.turn : ''}`}>

        {/* Name and health bar */}
        <h2>{entity?.name}</h2>
        {entity?.entityType !== 'player' && <HealthBar entityId={entity.id} />}

        {/* Image and control of the hit animation */}
        <img src={frame} alt="entity image" onClick={selectTarget} className={hit ? styles.hit : ''} />

        {/* Extra div (those ones are displayed as "none" by default) */}
        <div className={styles.shadow}></div>
        <div className={styles.selectedArrow}>▼</div>

        {/* Code to show the damage dealt */}
        {damage.length > 0 && damage.map((dmg, index) => (
          <div key={index} className={`${styles.damage} ${dmg[1] === true ? styles.crit : ''}`}>{dmg[0]}</div>
        ))}
      </div>
    </>
  );
}

export default EntityContainer;
