// Data
import settingsJson from '../../data/settings.json' with { type: 'json' };

// Dependencies
import { useEffect, useState, useRef } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import * as funcs from '../../utils/functions.js';

// Components
import HealthBar from '../ui/HealthBar.jsx';

// Hooks
import { useGame } from '../../hooks/useGame.js';

// Stylesheet
import styles from './EntityContainer.module.css';



function EntityContainer({ entity }) {

  // useRefs
  const hitSoundRef = useRef(null);
  const firstRun = useRef(true);

  // Contexts
  const { tick, audio, player, enemies, game } = useGame();

  // Loading Game Storage
  const [settings] = useLocalStorage('settings', settingsJson);

  // Getting useStates
  const [frame, setFrame] = useState(entity?.img);
  const [standBy, setStandBy] = useState(true);
  const [selected, setSelected] = useState(false);
  const [standByIndex, setStandByIndex] = useState(0);
  const [damageNumbers, setDamageNumbers] = useState([]);
  const [hit, setHit] = useState(false);

  // Initializing funcs
  funcs.init(game);

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
    if (game.get().currentTurn !== 'enemies' || game.get().specificEnemyTurn !== entity?.id) return;
    // --------------------------

    // --- Processing the enemy's turn ---
    (async () => {
      // Start of the enemy's turn
      if (!entity?.isDead()) {  // executes only if the enemy is not dead
        await enemyTurn(entity);
      }

      // Ending of the enemy's turn.
      if (player.get().isDead()) {
        game.update({ specificEnemyTurn: 'none' });
        game.update({ currentTurn: 'none' });
        player.update({ currentAnim: 'death' })
      } else
        if ((game.get().specificEnemyTurn >= enemies.get().length - 1) && (!player.get().isDead())) {
          game.update({ specificEnemyTurn: 'player' });
          game.update({ currentTurn: 'player' });
          funcs.phrase('Its your turn!');
        } else {
          game.update({ specificEnemyTurn: game.get().specificEnemyTurn + 1 });
        }

    })();  // the '()' is to call the async function!
    // -------------------------------------

  }, [game.get().specificEnemyTurn]);

  // Checks if the animation changed
  useEffect(() => {
    // Conditions to skip
    if (entity?.currentAnim === 'standBy') return;
    if (isFirstRun()) return;  // Checks if it is the first run and changes the ref

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
    (game.get().target === entity?.id) ? setSelected(true) : setSelected(false);
    if (game.get().currentTurn === 'enemies' && typeof (game.get().target) === 'number') {
      setSelected(false)
      game.update({ target: NaN });
    };
  }, [game.get()]);

  // Entity life
  useEffect(() => {
    // Conditions to skip
    if (isFirstRun()) return;
    if (entity.dmgTaken === null || entity.dmgTaken === undefined) return;

    // Creating an ID for the new damage number
    const newDamageId = Date.now() + Math.random();
    const damageValue = entity.dmgTaken;
    const wasCrit = entity.dmgWasCrit;

    // Adding the new damage to the state
    setDamageNumbers(prev => [...prev, {
        id: newDamageId,
        value: damageValue,
        isCrit: wasCrit
    }]);

    // Handling damage sound and animation
    if (damageValue !== 'Missed') {
        setHit(true);
        setTimeout(() => setHit(false), 1000); // Animation duration

        hitSoundRef.current.play().catch(err => {
            console.log("Autoplay bloqueado pelo navegador:", err);
        });
    }
    
    // Removing the damage from the state after 2 seconds
    setTimeout(() => {
        setDamageNumbers(prev => prev.filter(d => d.id !== newDamageId));
    }, 2000); // 2s

    // Checks if the entity died
    if (entity.isDead()) {
        entity.update({ currentAnim: 'death' });
    }

    // Returning the dmgTaken to null
    // This will make sure that, even if the last damage as equals to the current, it will update
    entity.update({ dmgTaken: null });

  }, [entity.dmgTaken]);



  // ----- FUNCTIONS -----
  function enemyTurn(enemy) {
    return new Promise(resolve => {
      // CODE FOR THE ENEMY'S TURN
      const turn = enemy?.handleTurn(player.get());

      if (turn.actionType === 'atk') {
        var { attackMsg, timeToWait } = turn.action;
        funcs.phrase(`${turn.msg}. ${attackMsg}`);

        // Verifying if the player died
        if (player.get().isDead()) {
          funcs.phrase('You died.');
          game.update({ currentMusic: ['/assets/sounds/musics/you_died.ogg', false] });
          audio.stopMusic();
          audio.playMusic('/assets/sounds/musics/you_died.ogg', false);
        }
      };

      // Timer to skip the current enemy turn
      const timer = setTimeout(() => {
        resolve();  // resolving the promise!
        clearTimeout(timer);
      }, timeToWait + 550);  // more 550ms to the enemy's actions
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
          entity.update({ currentAnim: "standBy" });
          setStandBy(true);
        }
        clearInterval(interval);
      } else {
        setFrame(animationFrames[index]);
        index = index + 1;
        entity.update({ img: "/assets/entities/death/death4.png" });
        entity.update({ dmgTaken: null });
      }
    }, frameDuration);
  }

  function selectTarget() {
    if (game.get().currentTurn === 'player' && typeof entity?.id === 'number') {
      game.update({ target: entity?.id })
    }
  }

  function isFirstRun() {
    const lastState = firstRun.current
    firstRun.current = false

    return lastState
  }

  // Returning the Component
  return (
    <>
      {/* Code to toggle both the selected and the turn class */}
      <div className={
          `${styles[`enemy${entity?.id + 1}`]} ${styles.entityContainer} ${selected ? styles.selected : ''} 
        ${game.get().specificEnemyTurn === entity?.id ? styles.turn : ''}`}>

        {/* Name and health bar */}
        <h2>{entity?.name}</h2>
        {entity?.entityType !== 'player' && <HealthBar entityId={entity.id} />}

        {/* Image and control of the hit animation */}
        <img src={frame} alt="entity image" onClick={selectTarget} className={hit ? styles.hit : ''} />

        {/* Extra div (those ones are displayed as "none" by default) */}
        <div className={styles.shadow}></div>
        <div className={styles.selectedArrow}>▼</div>

        {/* Code to show the damage dealt */}
        {damageNumbers.map((dmg) => (
          <div 
            key={dmg.id} 
            className={`${styles.damage} ${dmg.isCrit ? styles.crit : ''}`}
          >
            {dmg.value}
          </div>
        ))}
      </div>
    </>
  );
}

export default EntityContainer;
