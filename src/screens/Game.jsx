// COLLAPSE ALL: CONTROL + K + CONTROL + 0
//# COLLAPSE CLASSES: CONTROL + K + CONTROL + 1
//# COLLAPSE METHODS: CONTROL + K + CONTROL + 2
//UNCOLLAPSE ALL: CONTROL+ K + CONTROL + J

// Data
import playerJson from '../data/player.json' with { type: 'json' };
import enemiesJson from '../data/enemies.json' with { type: 'json' };
import gameJson from '../data/game.json' with { type: 'json' };
import settingsJson from '../data/settings.json' with { type: 'json' };

// Dependencies
import { useEffect, useRef } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import * as funcs from '../scripts/functions.js';
import * as Entities from '../scripts/entities.js';
import { produce } from "immer";

// Components
import MapContainer from '../components/MapContainer.jsx';
import EntityContainer from '../components/EntityContainer.jsx';
import ActionButtons from '../components/ActionButtons.jsx';
import Terminal from '../components/Terminal.jsx';
import Header from '../components/Header.jsx';
import Stats from '../components/Stats.jsx';

// Stylesheet
import '../assets/css/screens_style/Game.css';



function Game() {
  const gameMusicRef = useRef(null);

  // Setting the localStorage
  const [playerData, setPlayerData] = useLocalStorage('player', playerJson);
  const [enemiesData, setEnemiesData] = useLocalStorage('enemies', [enemiesJson['goblin'], enemiesJson['goblin'], enemiesJson['goblin']]);
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

  // On game load:
  useEffect(() => {
    // Applying an id for each enemy in enemies list
    enemies.forEach((enemy, index) => {
      enemy.setData(draft => draft.id = index)
    })

    // ----- TICK SPEED -----
    // setting the gameTickSpeed
    const tickTime = game.gameTickSpeed; // default is 1000
    
    player.setData(produce(draft => {
      draft.animations.standBy[1] = tickTime;
      draft.currentAnim = 'standBy';  // for some reason the player was starting with the atk animation (???)
    }));
    enemies.forEach((enemy) => {
      enemy.setData(draft => {
        draft.animations.standBy[1] = tickTime;
      });
    })
    
    // Updating gameTick
    const intervalId = setInterval(() => {
      setGameTick(prev => prev + 1);
    }, tickTime);

    // ----- GAME MUSIC -----
    // Loading music
    const gameMusic = new Audio('./assets/sounds/musics/the_music.ogg');
    gameMusic.loop = true;   // para repetir em loop
    gameMusic.volume = 0.5;  // volume de 0 a 1
    gameMusic.muted;
    gameMusic.play().catch(err => {
      console.log("Autoplay bloqueado pelo navegador:", err);
    });
    gameMusicRef.current = gameMusic

    return () => {
      clearInterval(intervalId);
      gameMusic.pause();
      gameMusic.currentTime = 0; // reset
      gameMusicRef.current = null;
    };
  }, []);

  // Mute/Unmute game music
  useEffect(() => {
    gameMusicRef.current.muted = settings.muted;
  }, [settings]);

  function doAttack() {
    if (typeof game.target !== 'number') return funcs.phrase('Select a target!');
    if (enemies[game.target]?.data?.currentAnim === 'death') return funcs.phrase('This enemy is dead');
    const result = player.attack(enemies[game.target]);  // this function executes an attack and return a phrase
    funcs.phrase((result));
  }

  return (
    <main id='game'>
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
          run={() => funcs.turnHandler('enemies')}
        />
      </section>
    </main>
  );
}

export default Game;
