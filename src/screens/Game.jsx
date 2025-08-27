// COLLAPSE ALL: CONTROL + K + CONTROL + 0
// COLLAPSE CLASSES: CONTROL + K + CONTROL + 1
// COLLAPSE METHODS: CONTROL + K + CONTROL + 2
// UNCOLLAPSE ALL: CONTROL+ K + CONTROL + J

// Data
import playerJson from '../data/player.json' with { type: 'json' };
import enemiesJson from '../data/enemies.json' with { type: 'json' };
import gameJson from '../data/game.json' with { type: 'json' };
import settingsJson from '../data/settings.json' with { type: 'json' };

// Dependencies
import { useEffect, useRef, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import * as funcs from '../scripts/functions.js';
import * as Entities from '../scripts/entities.js';
import { produce } from "immer";

// Components
import MapContainer from '../components/MapContainer.jsx';
import ActionButtons from '../components/ActionButtons.jsx';
import Terminal from '../components/Terminal.jsx';
import Header from '../components/Header.jsx';
import Stats from '../components/Stats.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';

// Stylesheet
import '../assets/css/screens_style/Game.css';



function Game() {
  // React Hooks
  const gameMusicRef = useRef(null);
  const [loading, setLoading] = useState(true);
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
  const [, setTerminalText] = useLocalStorage('terminalText', []);
  const [, setGameTick] = useLocalStorage('gameTick', 0);

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


  // --- USE EFFECTS --- 
  // On game load:
  useEffect(() => {
    // Applying an id for each enemy in enemies list
    enemies.forEach((enemy, index) => {
      enemy.setData(draft => draft.id = index)
    })

    // ----- TICK SPEED -----
    // setting the gameTickSpeed
    const tickTime = game.gameTickSpeed; // default is 1000
    
    player.setData((draft => {
      draft.animations.standBy[1] = tickTime;
    }));
    enemies.forEach((enemy) => {
      enemy.setData(draft => {
        draft.animations.standBy[1] = tickTime;
      });
    })
    
    // Updating gameTick
    const gameTickInterval = setInterval(() => {
      setGameTick(prev => prev + 1);
    }, tickTime);

    // ----- GAME MUSIC -----
    // Loading music
    const gameMusic = new Audio('/assets/sounds/musics/the_music.ogg');
    gameMusic.loop = true;   // to loop the music
    gameMusic.volume = settings.musicVolume;  // volume, from 0 to 1
    gameMusic.muted;
    gameMusic.play().catch(err => {
      console.log("Autoplay bloqueado pelo navegador:", err);
    });
    gameMusicRef.current = gameMusic

    // Finished loading
    setLoading(false);

    return () => {
      clearInterval(gameTickInterval);
      gameMusic.pause();
      gameMusic.currentTime = 0; // reset
      gameMusicRef.current = null;
    };
  }, []);
  // --- END OF USE EFFECT ---


  // Check if it's the player turn
  useEffect(() => {
    if (loading) return;

    if (game.specificEnemyTurn !== 'player') return;
    player.setData(draft => draft.actionsLeft = player.data.actions);  // resets the actionsLeft of the player

  }, [game.specificEnemyTurn]);
  // --- END OF USE EFFECT ---


  // Mute/Unmute game music
  useEffect(() => {
    if (loading) return;

    gameMusicRef.current.muted = settings.muted;
  }, [settings]);
  // --- END OF USE EFFECT ---
  // -------------------------


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
  // -------------------


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

  // -- RETURNING THE GAME ---
  return (
    <main id='game'>
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
      <section className='x-section top'>
        <Header />
      </section>

      {/* MAP SECTION */}
      <section className='x-section map'>
        <MapContainer player={player} enemies={enemies} />
      </section>

      {/* STATS AND TERMINAL */}
      <section className='x-section statistics'>
        <Stats entity={player.data} />

        <Terminal />
      </section>

      {/* ACTION BUTTONS */}
      <section className='x-section bottom'>
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
