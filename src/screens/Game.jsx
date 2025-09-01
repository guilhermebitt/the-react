// COLLAPSE ALL: CONTROL + K + CONTROL + 0
// COLLAPSE CLASSES: CONTROL + K + CONTROL + 1
// COLLAPSE METHODS: CONTROL + K + CONTROL + 2
// UNCOLLAPSE ALL: CONTROL+ K + CONTROL + J

/*
feat: uma nova funcionalidade
👉 Ex: feat(game): adiciona sistema de inventário

fix: correção de bug
👉 Ex: fix(ui): corrige alinhamento do botão

docs: mudanças apenas na documentação
👉 Ex: docs(readme): adiciona instruções de instalação

style: mudanças de formatação, sem alterar lógica
👉 Ex: style(css): aplica padrão de indentação

refactor: mudanças internas no código que não alteram comportamento
👉 Ex: refactor(api): simplifica função de busca

perf: melhoria de performance
👉 Ex: perf(render): otimiza renderização dos sprites

test: adição ou modificação de testes
👉 Ex: test(user): adiciona testes para cadastro

chore: tarefas de manutenção, dependências, configs, etc.
👉 Ex: chore(deps): atualiza eslint para v9
*/


// Data
import enemiesJson from '../data/enemies.json' with { type: 'json' };
import maps from '../data/maps.json' with { type: 'json' };

// Dependencies
import { useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import * as funcs from '../utils/functions.js';

// Components
import MapContainer from '../components/game/MapContainer.jsx';
import ActionButtons from '../components/common/ActionButtons.jsx';
import Terminal from '../components/game/Terminal.jsx';
import Header from '../components/game/Header.jsx';
import Stats from '../components/ui/Stats.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import Loading from '../components/common/Loading.jsx';

// Hooks
import { useGame } from '../hooks/useGame.js';

// Stylesheet
import styles from'./Game.module.css';



function Game() {
  // React Hooks
  const { audio, player, enemies, game } = useGame();
  const [confirmDialog, setConfirmDialog] = useState({
    visible: false,
    message: 'Are you sure?',
    onConfirm: null,
    onCancel: null
  });

  // Setting the localStorage
  const [loading, setLoading] = useLocalStorage('loading', true);
  const [, setTerminalText] = useLocalStorage('terminalText', []);

  // Initializing funcs
  funcs.init(game);

  // On game load:
  useEffect(() => {
    if (loading) return;

    // THIS IS TEMPORARY!!!!!!
    // This will be executed when the game start for the first time
    if (game.data().firstLoad === false && enemies.get().length < 1) {
      spawnEnemies();
    };
    
    // Starting game music
    if (game.data().currentMusic[0] === "/assets/sounds/musics/the_music.ogg" && !audio.isPlaying()) {
      audio.playMusic(game.data().currentMusic[0], game.data().currentMusic[1]);
    }
    
    // Changing the animations tickSpeed to fit with the game tick
    player.get().animations.standBy.duration = game.data().tickSpeed;

    enemies.get().forEach((enemy) => {
      enemy.animations.standBy.duration = game.data().tickSpeed;
    })

    // Defining that the player already started the game
    if (!game.data().firstLoad) game.update({ firstLoad: true });

    return () => {
      setLoading(true);
    };
    
  }, [loading]);

  // Check if it's the player turn
  useEffect(() => {
    if (loading) return;

    if (game.data().specificEnemyTurn !== 'player') return;
    player.get().actionsLeft = player.get().actions;  // resets the actionsLeft of the player

  }, [game.data().specificEnemyTurn]);


  // --- MAIN FUNCTIONS ---
  function doAttack() {
    // Conditions
    if (typeof game.data().target !== 'number') return funcs.phrase('Select a target!');
    if (player.get().actionsLeft <= 0) return funcs.phrase('You do not have actions left!');
    if (enemies.get([game.data().target])?.currentAnim === 'death') return funcs.phrase('This enemy is dead.');

    const { attackMsg, timeToWait } = player.get().attack(enemies.get([game.data().target]));  // this function executes an attack and return some data

    // Changing the turn 
    const lastTurn = game.data().currentTurn;
    game.update({ currentTurn: 'onAction' });

    setTimeout(() => {
      game.update({ currentTurn: lastTurn });
    }, timeToWait);
    // ------------------

    funcs.phrase(attackMsg);  // showing the result of the attack
    player.get().actionsLeft -= 1;
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

  function spawnEnemies() {
    const snake = createEntityObj('snake');
    enemies.spawnEnemies([snake, snake, snake])
  }


  // -- RETURNING THE GAME ---
  if (loading) return <Loading enemies={enemies.get()} player={player.get()} mapSrc={funcs.getCurrentMap().src}/>
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
        {enemies.get().length > 0 && <MapContainer map={funcs.getCurrentMap()}/>}
      </section>
  
      {/* STATS AND TERMINAL */}
      <section className={`${styles['x-section']} ${styles['statistics']}`}>
        <Stats entity={player.get()} />

        <Terminal />
      </section>
  
      {/* ACTION BUTTONS */}
      <section className={`${styles['x-section']} ${styles['bottom']}`}>
        <ActionButtons 
          attack={() => game.data().currentTurn === 'player' && doAttack()} 
          changeAnim={(null)} 
          sendMsg={() => funcs.phrase('Hi!')}
          endTurn={() => game.data().currentTurn === 'player' && confirmScreen(
            () => {funcs.endTurn('enemies')}
          )}
        />
      </section>
    </main>
  );
}

export default Game;
