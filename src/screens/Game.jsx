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

// Dependencies
import { useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import * as funcs from '../utils/functions.js';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// Components
import MapContainer from '../components/game/MapContainer.jsx';
import SectionButtons from '../components/common/SectionButtons.jsx';
import Header from '../components/game/Header.jsx';
import PlayerHUD from '../components/ui/PlayerHUD.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import Loading from '../components/common/Loading.jsx';
import ActionSection from '../components/sections/ActionSection.jsx';
import InventorySection from '../components/sections/InventorySection.jsx';
import SkillsSection from '../components/sections/SkillsSection.jsx';

// Hooks
import { useGame } from '../hooks/useGame.js';

// Stylesheet
import styles from'./Game.module.css';



function Game() {
  // React Hooks
  const { audio, player, enemies, game } = useGame();
  const navigate = useNavigate();
  const location = useLocation();
  const [confirmDialog, setConfirmDialog] = useState({
    visible: false,
    message: 'Are you sure?',
    onConfirm: null,
    onCancel: null
  });

  // Setting the localStorage
  const [loading, setLoading] = useLocalStorage('loading', true);

  // Initializing funcs
  funcs.init(game);

  // On game load:
  useEffect(() => {
    if (loading) return;
    if (location.pathname === "/game") navigate("/game/action", { replace: true });

    // THIS IS TEMPORARY!!!!!!
    // This will be executed when the game start for the first time
    if (game.get().firstLoad === false && enemies.get().length < 1) {
      spawnEnemies();
    };
    
    // Starting game music
    if (game.get().currentMusic[0] === "/assets/sounds/musics/the_music.ogg" && !audio.isPlaying()) {
      audio.playMusic(game.get().currentMusic[0], game.get().currentMusic[1]);
    }
    
    // Changing the animations tickSpeed to fit with the game tick
    player.update({ "animations.standBy.duration": game.get().tickSpeed })

    enemies.get().forEach((enemy) => {
      enemy.update({ "animations.standBy.duration": game.get().tickSpeed })
    })

    // Defining that the player already started the game
    if (!game.get().firstLoad) game.update({ firstLoad: true });

    return () => {
      setLoading(true);
    };
    
  }, [loading]);

  // Check if it's the player turn
  useEffect(() => {
    if (loading) return;

    if (game.get().specificEnemyTurn !== 'player') return;
      player.update({ actionsLeft: player.get().actions })  // resets the actionsLeft of the player
  }, [game.get().specificEnemyTurn]);

  
  // --- MAIN FUNCTIONS ---
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
        <PlayerHUD />
        {enemies.get().length > 0 && <MapContainer map={funcs.getCurrentMap()}/>}
      </section>
    
      
      {/* STATS AND TERMINAL */}
      <section className={`${styles['x-section']} ${styles['statistics']}`}>
        <Routes>
          <Route path='action' element={<ActionSection />} />
          <Route path='inventory' element={<InventorySection />} />
          <Route path='skills' element={<SkillsSection />} />
        </Routes>
      </section>
  
      {/* ACTION BUTTONS */}
      <section className={`${styles['x-section']} ${styles['bottom']}`}>
        <SectionButtons
          sec1={() => navigate("action")} 
          sec2={() => navigate("inventory")}
          sec3={() => navigate("skills")}
          sec4={() => navigate("#")}
        />
      </section>
      
    </main>
  );
}

export default Game;
