// Data
import playerData from '../data/player.json' with { type: 'json' };
import enemiesData from '../data/enemies.json' with { type: 'json' };

// Dependencies
import { useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { attack, phrase } from '../scripts/playerActions.js';

// Components
import EntityContainer from '../components/EntityContainer';
import ActionButtons from '../components/ActionButtons.jsx';
import OptionButtons from '../components/OptionButtons.jsx';
import Terminal from '../components/Terminal.jsx';

// Stylesheet
import '../assets/css/screens_style/Game.css';


function Game() {

  const enemyData = enemiesData['goblin']; // Assuming you want the first enemy for now

  const [player, setPlayer] = useLocalStorage('player', playerData);
  const [enemy, setEnemy] = useLocalStorage('enemy', enemyData);
  const [terminalText, setTerminalText] = useLocalStorage('terminalText', []);

  useEffect(() => {
    console.log(player.stats.health);
  }, [player.stats.health]);

  return (
    <main>
      {/* TOP SECTION */}
      <section className='x-section top'>
        <h1>The</h1>
      </section>

      {/* GAME CONTENT */}
      <section className='x-section middle'>
        <EntityContainer entity={player} />

        <Terminal />

        <EntityContainer entity={enemy} />

      </section>

      {/* BOTTOM OPTIONS AND INVENTORY */}
      <section className='x-section bottom'>
        <ActionButtons attack={() => attack(setPlayer)} sendMsg={() => phrase(setTerminalText,'p', 'Hi! ')} />
        <OptionButtons />
      </section>
    </main>
  );
}

export default Game;
