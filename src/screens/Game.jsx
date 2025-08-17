// Data
import playerData from '../data/player.json' with { type: 'json' };
import enemiesData from '../data/enemies.json' with { type: 'json' };
import gameData from '../data/game.json' with { type: 'json' };

// Dependencies
import { useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { attack, phrase, turnHandler } from '../scripts/functions.js';

// Components
import EntityContainer from '../components/EntityContainer';
import ActionButtons from '../components/ActionButtons.jsx';
import OptionButtons from '../components/OptionButtons.jsx';
import Terminal from '../components/Terminal.jsx';
import Header from '../components/Header.jsx';

// Stylesheet
import '../assets/css/screens_style/Game.css';
import { current } from 'immer';



function Game() {

  const enemyData = enemiesData['goblin'];

  // Setting the localStorage
  const [player] = useLocalStorage('player', playerData);
  const [enemy, setEnemy] = useLocalStorage('enemy', enemyData);
  const [currentTurn, setCurrentTurn] = useLocalStorage('currentTurn', gameData.currentTurn);
  const [,setTerminalText] = useLocalStorage('terminalText', []);

  // Handling enemy's turn
  useEffect(() => {
    // Defining a timer (this will stay here 
    // just to remember how to do it)
    const timer = setTimeout(() => {
      if (currentTurn === "enemy") {
        setCurrentTurn("player");
        phrase(setTerminalText, 'p', 'Its your turn!')
      };
    }, 1000); // 1 second

    // Cleaning the timer
    return () => clearTimeout(timer);
  }, [currentTurn]);

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

      {/* BOTTOM OPTIONS AND INVENTORY */}
      <section className='x-section bottom'>
        <ActionButtons 
          attack={() => attack(setEnemy, currentTurn)} 
          sendMsg={() => phrase(setTerminalText, 'p', 'Hi!')}
          run={() => turnHandler(setCurrentTurn, 'enemy')}
        />
      </section>
    </main>
  );
}

export default Game;
