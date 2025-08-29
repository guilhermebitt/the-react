// COLLAPSE ALL: CONTROL + K + CONTROL + 0
// COLLAPSE CLASSES: CONTROL + K + CONTROL + 1
// COLLAPSE METHODS: CONTROL + K + CONTROL + 2
// UNCOLLAPSE ALL: CONTROL+ K + CONTROL + J



// Data
import playerJson from '../data/player.json' with { type: 'json' };
import enemiesJson from '../data/enemies.json' with { type: 'json' };
import gameJson from '../data/game.json' with { type: 'json' };
import settingsJson from '../data/settings.json' with { type: 'json' };
import maps from '../data/maps.json' with { type: 'json' };

// Dependencies
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';
import * as funcs from '../utils/functions.js';
import * as Entities from '../utils/entities.js';
import { produce } from "immer";

// Components
import MapContainer from '../components/game/MapContainer.jsx';
import ActionButtons from '../components/common/ActionButtons.jsx';
import Terminal from '../components/game/Terminal.jsx';
import Header from '../components/game/Header.jsx';
import Stats from '../components/ui/Stats.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import Loading from '../components/common/Loading.jsx';

// Hooks
import useGameTick from '../hooks/useGameTick.js';

// Stylesheet
import styles from'./Game.module.css';



function Game() {
  // React Hooks
  const gameMusicRef = useRef(null);
  const [confirmDialog, setConfirmDialog] = useState({
    visible: false,
    message: 'Are you sure?',
    onConfirm: null,
    onCancel: null
  });

  // Creating enemies
  const snake = createEntityObj('snake');

  // Setting the localStorage
  const [playerData, setPlayerData] = useLocalStorage('player', playerJson);
  const [enemiesData, setEnemiesData] = useLocalStorage('enemies', [snake, snake, snake]);
  const [game, setGame] = useLocalStorage('game', gameJson);
  const [settings] = useLocalStorage('settings', settingsJson);
  const [loading, setLoading] = useLocalStorage('loading', true);
  const [, setTerminalText] = useLocalStorage('terminalText', []);

  const location = useLocation();

  // Setting player
  const setSafePlayerData = (recipe) => {
    setPlayerData(prev => produce(prev, draft => {
      recipe(draft);
    }));
  };

  const player = new Entities.Player(playerData, setSafePlayerData);

  // Settings enemies
  const enemies = enemiesData.map((enemy, index) => {
    const setEnemyData = (recipe) => {  // creates a setter that updates the enemy by the index
      setEnemiesData(prev => produce(prev, draft => {
        recipe(draft[index]); // applies only to the current enemy
      }));
    };
    return new Entities[enemy.name](enemy, setEnemyData);  // gets the correct class from the enemy name
  });

  // Initializing funcs
  funcs.init(setTerminalText, setGame);

  // Starting the gameTick
  useGameTick();


  // On game load:
  useEffect(() => {
    if (loading) return;
    // Applying an id for each enemy in enemies list
    enemies.forEach((enemy, index) => {
      enemy.setData(draft => draft.id = index)
    })
    
    // Changing the animations tickSpeed to fit with the game tick
    player.setData((draft => {
      draft.animations.standBy[1] = game.tickSpeed;
    }));
    enemies.forEach((enemy) => {
      enemy.setData(draft => {
        draft.animations.standBy[1] = game.tickSpeed;
      });
    })

    // Loading GameMusic
    const gameMusic = new Audio(game.currentMusic);
    startMusic(gameMusic);

    // Defining that the player already started the game
    setGame(produce(draft => {draft.firstLoad = true}));

    return () => {
      deconstructGame();
      setLoading(true);
    };
    
  }, [loading]);


  // Changing game music
  useEffect(() => {
    if (loading) return;

    const gameMusic = gameMusicRef.current;
    gameMusic.currentTime = 0;
    gameMusic.loop = false;
    gameMusic.src = game.currentMusic;
    gameMusic.play()
    gameMusicRef.current = gameMusic;

  }, [game.currentMusic]);


  // Mute/Unmute game music
  useEffect(() => {
    if (loading) return;

    gameMusicRef.current.muted = settings.muted;
  }, [settings, loading]);


  // Check if it's the player turn
  useEffect(() => {
    if (loading) return;

    if (game.specificEnemyTurn !== 'player') return;
    player.setData(draft => draft.actionsLeft = player.data.actions);  // resets the actionsLeft of the player

  }, [game.specificEnemyTurn]);


  // --- MAIN FUNCTIONS ---
  function doAttack() {
    // Conditions
    if (typeof game.target !== 'number') return funcs.phrase('Select a target!');
    if (player.data.actionsLeft <= 0) return funcs.phrase('You do not have actions left!');
    if (enemies[game.target]?.data?.currentAnim === 'death') return funcs.phrase('This enemy is dead.');

    const { attackMsg, timeToWait } = player.attack(enemies[game.target]);  // this function executes an attack and return some data

    // Changing the turn 
    const lastTurn = game.currentTurn;
    setGame(produce(draft => {draft.currentTurn = 'onAction'}));

    setTimeout(() => {
      setGame(produce(draft => {draft.currentTurn = lastTurn}));
    }, timeToWait);
    // ------------------


    funcs.phrase(attackMsg);  // showing the result of the attack
    player.setData(draft => {  // reducing player action
      draft.actionsLeft -= 1;
    });
  }

  function confirmScreen(onConfirm, onCancel, msg='Are you sure?') {
    setConfirmDialog({
      visible: true,
      message: msg,
      onConfirm: onConfirm || (() => {}),
      onCancel: onCancel || (() => setConfirmDialog(prev => ({ ...prev, visible: false }))),
    });
  }

  function createEntityObj(name) {
    const entity = new Object({
      ...enemiesJson['commonProperties'],
      ...enemiesJson[name],
      "animations": {
        ...enemiesJson[name]['animations'],
        ...enemiesJson['deathAnimation']
      }
    });
    
    return entity;
  }

  function getCurrentMap() {
    return maps[game.currentMap];
  }

  function handleReady(music) {
    music.play().catch(err => console.warn("Erro ao tocar música:", err));
  }

  function startMusic(music) {
    music.loop = true;
    music.volume = settings.musicVolume;

    music.addEventListener("canplaythrough", () => handleReady(music), { once: true });
    gameMusicRef.current = music;
  }

  function deconstructGame() {
    gameMusicRef.current.pause();
    gameMusicRef.current.currentTime = 0;
    gameMusicRef.current.removeEventListener("canplaythrough", handleReady);
    gameMusicRef.current = null;
  }

  // -- RETURNING THE GAME ---
  if (loading) return <Loading enemies={enemies} player={player} mapSrc={getCurrentMap().src}/>
  return (
    <main id={styles['game']}>
      {/* CONFIRM DIALOG */}
     <ConfirmDialog 
        visible={confirmDialog.visible}
        message={confirmDialog.message}
        onConfirm={() => {
          confirmDialog.onConfirm?.();
          setConfirmDialog(prev => {return{...prev, visible: false}});
        }}
        onCancel={() => {
          confirmDialog.onCancel?.();
          setConfirmDialog(prev => {return{...prev, visible: false}});
        }}
      />
  
      {/* TOP SECTION */}
      <section className={`${styles['x-section']} ${styles['top']}`}>
        <Header />
      </section>
  
      {/* MAP SECTION */}
      <section className={`${styles['x-section']} ${styles['map']}`}>
        <MapContainer player={player} enemies={enemies} map={getCurrentMap()}/>
      </section>
  
      {/* STATS AND TERMINAL */}
      <section className={`${styles['x-section']} ${styles['statistics']}`}>
        <Stats entity={player.data} />

        <Terminal />
      </section>
  
      {/* ACTION BUTTONS */}
      <section className={`${styles['x-section']} ${styles['bottom']}`}>
        <ActionButtons 
          attack={() => game.currentTurn === 'player' && doAttack()} 
          changeAnim={(null)} 
          sendMsg={() => funcs.phrase('Hi!')}
          endTurn={() => game.currentTurn === 'player' && confirmScreen(
            () => {funcs.endTurn('enemies')}
          )}
        />
      </section>
    </main>
  );
}

export default Game;
