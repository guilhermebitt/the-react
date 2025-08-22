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
import EntityContainer from '../components/EntityContainer';
import ActionButtons from '../components/ActionButtons.jsx';
import Terminal from '../components/Terminal.jsx';
import Header from '../components/Header.jsx';

// Stylesheet
import '../assets/css/screens_style/Game.css';

function Game() {
  const gameMusicRef = useRef(null);

  // Setting the localStorage
  const [playerData, setPlayerData] = useLocalStorage('player', playerJson);
  const [enemyData, setEnemyData] = useLocalStorage('enemy', enemiesJson['goblin']);
  const [game, setGame] = useLocalStorage('game', gameJson);
  const [settings] = useLocalStorage('settings', settingsJson);
  const [, setTerminalText] = useLocalStorage('terminalText', []);
  const [, setGameTick] = useLocalStorage('gameTick', 0);

  // Setting entities
  const player = new Entities.Player(playerData, setPlayerData);
  const enemy = new Entities.Goblin(enemyData, setEnemyData);

  // Initializing funcs
  funcs.init(setTerminalText, setGame);

  // On game load:
  useEffect(() => {
    // ----- TICK SPEED -----
    // setting the gameTickSpeed
    const tickTime = game.gameTickSpeed; // default is 1000
    
    player.setData(produce(draft => {
      draft.animations.standBy[1] = tickTime;
    }));
    enemy.setData(produce(draft => {
      draft.animations.standBy[1] = tickTime;
    }));
    
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

  // Handling turn changes
  useEffect(() => {
    if (game.currentTurn === "enemy") {
      const action = enemy.turn;
    };
  }, [game.currentTurn]);

  function doAttack() {
    const result = player.attack(enemy);
    funcs.phrase(result);
  }

  return (
    <main id='game'>
      {/* TOP SECTION */}
      <section className='x-section top'>
        <Header />
      </section>

      {/* GAME CONTENT */}
      <section className='x-section middle'>
        <EntityContainer entityData={player} />

        <Terminal />

        <EntityContainer entityData={enemy} />
      </section>

      {/* ACTION BUTTONS */}
      <section className='x-section bottom'>
        <ActionButtons 
          attack={() => game.currentTurn === 'player' && doAttack()} 
          changeAnim={() => player.changeAnim('hurt')} 
          sendMsg={() => funcs.phrase('Hi!')}
          run={() => funcs.turnHandler('enemy')}
        />
      </section>
    </main>
  );
}

export default Game;
