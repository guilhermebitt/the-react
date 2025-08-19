// Data
import playerJson from '../data/player.json' with { type: 'json' };
import enemiesJson from '../data/enemies.json' with { type: 'json' };
import gameJson from '../data/game.json' with { type: 'json' };

// Dependencies
import { useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { phrase, turnHandler } from '../scripts/functions.js';
import { Entity } from '../scripts/entities.js';
import { produce } from "immer";

// Components
import EntityContainer from '../components/EntityContainer';
import ActionButtons from '../components/ActionButtons.jsx';
import Terminal from '../components/Terminal.jsx';
import Header from '../components/Header.jsx';

// Stylesheet
import '../assets/css/screens_style/Game.css';



function Game() {
  // Setting the localStorage
  const [playerData, setPlayerData] = useLocalStorage('player', playerJson);
  const [enemyData, setEnemyData] = useLocalStorage('enemy', enemiesJson['goblin']);
  const [game, setGame] = useLocalStorage('game', gameJson);
  const [, setTerminalText] = useLocalStorage('terminalText', []);
  const [, setGameTick] = useLocalStorage('gameTick', 0);

  // Setting entities
  const player = new Entity(playerData, setPlayerData);
  const enemy = new Entity(enemyData, setEnemyData);

  // Load Game:
  useEffect(() => {
    // setting the gameTickSpeed
    const tickTime = game.gameTickSpeed; // default is 1000
    /*
    player.setData(produce(draft => {
      draft.animations.standBy[1] = tickTime;
    }));
    enemy.setData(produce(draft => {
      draft.animations.standBy[1] = tickTime;
    }));
    */
    const intervalId = setInterval(() => {
      setGameTick(prev => prev + 1);
    }, tickTime);

    // changing the currentTurn to Player (temporary?)
    setGame(produce(draft => {
      draft.currentTurn = "player";
    }));

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Handling enemy's turn
  useEffect(() => {
    // Defining a timer (this will stay here 
    // just to remember how to do it)
    const timer = setTimeout(() => {
      if (game.currentTurn === "enemy") {
        setGame(produce(draft => {
          draft.currentTurn = "player";
        }));
        phrase(setTerminalText, 'p', 'Its your turn!')
      };
    }, 1000); // 1 second

    // Cleaning the timer
    return () => clearTimeout(timer);
  }, [game.currentTurn]);

  return (player) && (
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
          attack={() => game.currentTurn === 'player' && player.attack(enemy, 1)} 
          changeAnim={() => player.changeAnim('hurt')} 
          sendMsg={() => phrase(setTerminalText, 'p', 'Hi!')}
          run={() => turnHandler(setGame, 'enemy')}
        />
      </section>
    </main>
  );
}

export default Game;
