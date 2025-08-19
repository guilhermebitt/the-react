// Data
import playerData from '../data/player.json' with { type: 'json' };
import enemiesData from '../data/enemies.json' with { type: 'json' };
import gameData from '../data/game.json' with { type: 'json' };

// Dependencies
import { useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { attack, phrase, turnHandler, changeAnim } from '../scripts/functions.js';
import { produce } from "immer";

// Components
import EntityContainer from '../components/EntityContainer';
import ActionButtons from '../components/ActionButtons.jsx';
import Terminal from '../components/Terminal.jsx';
import Header from '../components/Header.jsx';

// Stylesheet
import '../assets/css/screens_style/Game.css';



function Game() {

  const enemyData = enemiesData['goblin'];

  // Setting the localStorage
  const [player, setPlayer] = useLocalStorage('player', playerData);
  const [enemy, setEnemy] = useLocalStorage('enemy', enemyData);
  const [game, setGame] = useLocalStorage('game', gameData);
  const [, setTerminalText] = useLocalStorage('terminalText', []);
  const [, setGameTick] = useLocalStorage('gameTick', 0);

  // Load Game:
  useEffect(() => {
    // setting the gameTickSpeed
    const tickTime = game.gameTickSpeed; // default is 1000
    setPlayer(produce(draft => {
      draft.animations.standBy[1] = tickTime;
      console.log(draft.standBy)
    }));
    setEnemy(produce(draft => {
      draft.animations.standBy[1] = tickTime;
    }));

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

  return (
    <main id='game'>
      {/* TOP SECTION */}
      <section className='x-section top'>
        <Header />
      </section>

      {/* GAME CONTENT */}
      <section className='x-section middle'>
        <EntityContainer entity={player} />

        <Terminal />

        <EntityContainer entity={enemy} />

      </section>

      {/* ACTION BUTTONS */}
      <section className='x-section bottom'>
        <ActionButtons 
          attack={() => attack(setEnemy, game.currentTurn)} 
          changeAnim={() => changeAnim(setPlayer, "hurt")}
          sendMsg={() => phrase(setTerminalText, 'p', 'Hi!')}
          run={() => turnHandler(setGame, 'enemy')}
        />
      </section>
    </main>
  );
}

export default Game;
